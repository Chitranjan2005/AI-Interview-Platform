"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
    const [identifier, setIdentifier] = useState(""); // username or email
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const { login } = useAuth();

    async function handleLogin(e) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await apiFetch("/users/login", {
                method: "POST",
                body: JSON.stringify({
                    username: identifier,
                    email: identifier,
                    password,
                }),
            });

            login(res.data.user, res.data.accessToken);
            router.push("/dashboard");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{ maxWidth: "400px", margin: "60px auto" }}>
            <h1>Log in</h1>

            <form onSubmit={handleLogin}>
                <div style={{ marginBottom: "12px" }}>
                    <label>Username or Email</label>
                    <input
                        type="text"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        required
                        style={{ width: "100%", padding: "8px" }}
                    />
                </div>

                <div style={{ marginBottom: "12px" }}>
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: "100%", padding: "8px" }}
                    />
                </div>

                {error && <p style={{ color: "red" }}>{error}</p>}

                <button type="submit" disabled={loading} style={{ width: "100%", padding: "10px" }}>
                    {loading ? "Logging in..." : "Log in"}
                </button>
            </form>

            <p style={{ marginTop: "16px" }}>
                Don&apos;t have an account? <a href="/signup">Sign up</a>
            </p>
        </div>
    );
}