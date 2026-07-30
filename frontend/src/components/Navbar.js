"use client";

import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
    const { user, logout } = useAuth();
    const router = useRouter();

    async function handleLogout() {
        try {
            await apiFetch("/users/logout", { method: "POST" });
        } catch (err) {
            // even if the backend call fails, still clear local state
            console.error("Logout request failed:", err.message);
        } finally {
            logout(); // clears localStorage + React state
            router.push("/login");
        }
    }

    if (!user) return null;

    return (
        <nav
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 24px",
                borderBottom: "1px solid #ddd",
            }}
        >
            <a href="/dashboard" style={{ fontWeight: "bold", textDecoration: "none" }}>
                AI Interview Prep
            </a>

            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <span>{user.fullName || user.username}</span>
                <button onClick={handleLogout} style={{ padding: "6px 12px" }}>
                    Logout
                </button>
            </div>
        </nav>
    );
}