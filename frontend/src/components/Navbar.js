"use client";

import { useRouter } from "next/navigation";
import { Settings, LogOut, User } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
    const { user, logout } = useAuth();
    const router = useRouter();

    async function handleLogout() {
        try {
            await apiFetch("/users/logout", { method: "POST" });
        } catch (err) {
            console.error(err.message);
        } finally {
            logout();
            router.push("/login");
        }
    }

    if (!user) return null;

    return (
        <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
            <a href="/dashboard" className="text-xl font-bold text-gray-900 tracking-tight">
                tyareee
            </a>

            <div className="flex items-center gap-2">
                <button
                    onClick={() => router.push("/profile")}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors"
                >
                    <User className="w-4 h-4" />
                    {user.fullName || user.username}
                </button>

                <button
                    onClick={() => router.push("/settings")}
                    className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                >
                    <Settings className="w-4 h-4" />
                </button>

                <button
                    onClick={handleLogout}
                    className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                </button>
            </div>
        </nav>
    );
}