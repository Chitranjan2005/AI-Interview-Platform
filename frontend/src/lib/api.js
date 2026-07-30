const API_URL = process.env.NEXT_PUBLIC_API_URL;

let isRefreshing = false;
let refreshPromise = null;

async function refreshAccessToken() {
    const res = await fetch(`${API_URL}/users/refresh-token`, {
        method: "POST",
        credentials: "include", // sends the httpOnly refreshToken cookie
    });

    if (!res.ok) {
        throw new Error("Session expired");
    }

    const data = await res.json();
    localStorage.setItem("accessToken", data.data.accessToken);
    return data.data.accessToken;
}

export async function apiFetch(endpoint, options = {}) {
    let token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

    async function makeRequest(currentToken) {
        return fetch(`${API_URL}${endpoint}`, {
            ...options,
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                ...(currentToken ? { Authorization: `Bearer ${currentToken}` } : {}),
                ...options.headers,
            },
        });
    }

    let res = await makeRequest(token);

    if (res.status === 401 && token) {
        try {
            if (!isRefreshing) {
                isRefreshing = true;
                refreshPromise = refreshAccessToken().finally(() => {
                    isRefreshing = false;
                });
            }
            const newToken = await refreshPromise;
            res = await makeRequest(newToken);
        } catch (err) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("user");
            if (typeof window !== "undefined") {
                window.location.href = "/login";
            }
            throw new Error("Session expired, please log in again");
        }
    }

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        throw new Error(data.message || "Request failed");
    }

    return data;
}