"use client";

import { useState } from "react";
import { KeyRound, ArrowRight } from "lucide-react";
import { apiFetch } from "@/lib/api";

export default function ForgotPasswordPage() {
    const [step, setStep] = useState("request");
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleRequest(e) {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await apiFetch("/users/forgot-password", { method: "POST", body: JSON.stringify({ email }) });
            setStep("reset");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleReset(e) {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await apiFetch("/users/reset-password", { method: "POST", body: JSON.stringify({ email, otp, newPassword }) });
            window.location.href = "/login";
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-6">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
                <KeyRound className="w-8 h-8 text-gray-900 mb-4" />
                <h1 className="text-2xl font-bold text-gray-900">Reset password</h1>
                <p className="text-sm text-gray-500 mt-1 mb-6">
                    {step === "request" ? "Enter your email to receive a code." : "Enter the code and your new password."}
                </p>

                {step === "request" ? (
                    <form onSubmit={handleRequest} className="space-y-4">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                        />
                        {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
                        <button type="submit" disabled={loading}
                                className="w-full bg-gray-900 text-white py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-800 disabled:opacity-60 transition-colors">
                            {loading ? "Sending…" : "Send code"} {!loading && <ArrowRight className="w-4 h-4" />}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleReset} className="space-y-4">
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            maxLength={6}
                            placeholder="123456"
                            required
                            className="w-full text-center tracking-[0.5em] px-3 py-3 border border-gray-200 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                        />
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="New password"
                            minLength={8}
                            required
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                        />
                        {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
                        <button type="submit" disabled={loading}
                                className="w-full bg-gray-900 text-white py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-800 disabled:opacity-60 transition-colors">
                            {loading ? "Resetting…" : "Reset password"} {!loading && <ArrowRight className="w-4 h-4" />}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}