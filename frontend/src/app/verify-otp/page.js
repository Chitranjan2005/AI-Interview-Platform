"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { apiFetch } from "@/lib/api";

function VerifyOtpContent() {
    const email = useSearchParams().get("email") || "";
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleVerify(e) {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await apiFetch("/users/verify-otp", { method: "POST", body: JSON.stringify({ email, otp }) });
            router.push("/login");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleResend() {
        setError("");
        try {
            await apiFetch("/users/resend-otp", { method: "POST", body: JSON.stringify({ email }) });
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-6">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
                <ShieldCheck className="w-8 h-8 text-gray-900 mb-4" />
                <h1 className="text-2xl font-bold text-gray-900">Verify your email</h1>
                <p className="text-sm text-gray-500 mt-1 mb-6">Enter the code sent to {email}.</p>

                <form onSubmit={handleVerify} className="space-y-4">
                    <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        maxLength={6}
                        placeholder="123456"
                        required
                        className="w-full text-center tracking-[0.5em] px-3 py-3 border border-gray-200 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                    />

                    {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

                    <button type="submit" disabled={loading}
                            className="w-full bg-gray-900 text-white py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-800 disabled:opacity-60 transition-colors">
                        {loading ? "Verifying…" : "Verify"} {!loading && <ArrowRight className="w-4 h-4" />}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-6">
                    Didn&apos;t get a code?{" "}
                    <button onClick={handleResend} className="font-semibold text-gray-900 hover:underline">
                        Resend
                    </button>
                </p>
            </div>
        </div>
    );
}

export default function VerifyOtpPage() {
    return (
        <Suspense fallback={null}>
            <VerifyOtpContent />
        </Suspense>
    );
}