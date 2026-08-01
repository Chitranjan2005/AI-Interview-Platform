"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    User, KeyRound, AtSign, History, LogOut, ArrowRight, Check,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

const TABS = [
    { id: "profile", label: "Profile", icon: User },
    { id: "username", label: "Change username", icon: AtSign },
    { id: "password", label: "Change password", icon: KeyRound },
    { id: "history", label: "History", icon: History },
    { id: "logout", label: "Logout", icon: LogOut },
];

function SettingsContent() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("profile");

    const [newUsername, setNewUsername] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    function selectTab(id) {
        if (id === "history") {
            router.push("/history");
            return;
        }
        if (id === "logout") {
            handleLogout();
            return;
        }
        setActiveTab(id);
        setMessage("");
        setError("");
    }

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

    async function handleUsernameChange(e) {
        e.preventDefault();
        setError("");
        setMessage("");
        setLoading(true);
        try {
            await apiFetch("/users/change-username", {
                method: "POST",
                body: JSON.stringify({ newUsername }),
            });
            setMessage("Username updated successfully.");
            setNewUsername("");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function handlePasswordChange(e) {
        e.preventDefault();
        setError("");
        setMessage("");
        setLoading(true);
        try {
            await apiFetch("/users/change-password", {
                method: "POST",
                body: JSON.stringify({ oldPassword, newPassword }),
            });
            setMessage("Password updated successfully.");
            setOldPassword("");
            setNewPassword("");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    const inputClass =
        "w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10";

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="max-w-3xl mx-auto px-6 py-10">
                <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                <p className="text-sm text-gray-500 mt-2">Manage your account.</p>

                <div className="mt-8 grid sm:grid-cols-[200px_1fr] gap-6">
                    <div className="flex sm:flex-col gap-1 overflow-x-auto">
                        {TABS.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => selectTab(tab.id)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                                        activeTab === tab.id
                                            ? "bg-gray-900 text-white"
                                            : "text-gray-600 hover:bg-white"
                                    }`}
                                >
                                    <Icon className="w-4 h-4" /> {tab.label}
                                </button>
                            );
                        })}
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                        {activeTab === "profile" && (
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 mb-4">Profile</h2>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between border-b border-gray-100 pb-2">
                                        <span className="text-gray-500">Full name</span>
                                        <span className="font-medium text-gray-900">{user?.fullName}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-100 pb-2">
                                        <span className="text-gray-500">Username</span>
                                        <span className="font-medium text-gray-900">{user?.username}</span>
                                    </div>
                                    <div className="flex justify-between pb-2">
                                        <span className="text-gray-500">Email</span>
                                        <span className="font-medium text-gray-900">{user?.email}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "username" && (
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 mb-4">Change username</h2>
                                <form onSubmit={handleUsernameChange} className="space-y-4">
                                    <input
                                        type="text"
                                        value={newUsername}
                                        onChange={(e) => setNewUsername(e.target.value)}
                                        placeholder="New username"
                                        required
                                        className={inputClass}
                                    />
                                    {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
                                    {message && (
                                        <p className="text-sm text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg flex items-center gap-1.5">
                                            <Check className="w-4 h-4" /> {message}
                                        </p>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-gray-800 disabled:opacity-60 transition-colors"
                                    >
                                        {loading ? "Saving…" : "Save changes"} {!loading && <ArrowRight className="w-4 h-4" />}
                                    </button>
                                </form>
                            </div>
                        )}

                        {activeTab === "password" && (
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 mb-4">Change password</h2>
                                <form onSubmit={handlePasswordChange} className="space-y-4">
                                    <input
                                        type="password"
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                        placeholder="Current password"
                                        required
                                        className={inputClass}
                                    />
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="New password"
                                        minLength={8}
                                        required
                                        className={inputClass}
                                    />
                                    {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
                                    {message && (
                                        <p className="text-sm text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg flex items-center gap-1.5">
                                            <Check className="w-4 h-4" /> {message}
                                        </p>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-gray-800 disabled:opacity-60 transition-colors"
                                    >
                                        {loading ? "Saving…" : "Save changes"} {!loading && <ArrowRight className="w-4 h-4" />}
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function SettingsPage() {
    return (
        <ProtectedRoute>
            <SettingsContent />
        </ProtectedRoute>
    );
}