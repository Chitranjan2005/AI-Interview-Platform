"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, UserCircle2, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function AuthPage() {
    const [mode, setMode] = useState("login");
    const [showPassword, setShowPassword] = useState(false);
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [signupData, setSignupData] = useState({ username: "", fullName: "", email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const { user, login, loading: authLoading } = useAuth();

    useEffect(() => {
        if (!authLoading && user) router.replace("/dashboard");
    }, [user, authLoading, router]);

    function switchMode(next) {
        setMode(next);
        setError("");
    }

    async function handleLogin(e) {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const res = await apiFetch("/users/login", {
                method: "POST",
                body: JSON.stringify({ username: identifier, email: identifier, password }),
            });
            login(res.data.user, res.data.accessToken);
            router.push("/dashboard");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleSignup(e) {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await apiFetch("/users/register", { method: "POST", body: JSON.stringify(signupData) });
            router.push(`/verify-otp?email=${encodeURIComponent(signupData.email)}`);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-6">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
                <div className="flex bg-gray-100 rounded-xl p-1 mb-8">
                    <button
                        onClick={() => switchMode("login")}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                            mode === "login" ? "bg-white shadow text-gray-900" : "text-gray-500"
                        }`}
                    >
                        Sign in
                    </button>
                    <button
                        onClick={() => switchMode("signup")}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                            mode === "signup" ? "bg-white shadow text-gray-900" : "text-gray-500"
                        }`}
                    >
                        Sign up
                    </button>
                </div>

                {mode === "login" ? (
                    <>
                        <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
                        <p className="text-sm text-gray-500 mt-1 mb-6">Enter your details to access your account.</p>

                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-800 block mb-1.5">Username or email</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        value={identifier}
                                        onChange={(e) => setIdentifier(e.target.value)}
                                        placeholder="username or you@example.com"
                                        required
                                        className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-1.5">
                                    <label className="text-sm font-medium text-gray-800">Password</label>
                                    <a href="/forgot-password" className="text-sm font-medium text-gray-900 hover:underline">
                                        Forgot password?
                                    </a>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Your password"
                                        required
                                        className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                                    />
                                    <button type="button" onClick={() => setShowPassword((s) => !s)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

                            <button type="submit" disabled={loading}
                                    className="w-full bg-gray-900 text-white py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-800 disabled:opacity-60 transition-colors">
                                {loading ? "Signing in…" : "Sign in"} {!loading && <ArrowRight className="w-4 h-4" />}
                            </button>
                        </form>

                        <div className="flex items-center gap-3 my-6">
                            <div className="flex-1 h-px bg-gray-200" />
                            <span className="text-xs text-gray-400">OR</span>
                            <div className="flex-1 h-px bg-gray-200" />
                        </div>

                        <p className="text-center text-sm text-gray-500">
                            Don&apos;t have an account?{" "}
                            <button onClick={() => switchMode("signup")} className="font-semibold text-gray-900 hover:underline">
                                Sign up
                            </button>
                        </p>
                    </>
                ) : (
                    <>
                        <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
                        <p className="text-sm text-gray-500 mt-1 mb-6">Fill in your information to get started.</p>

                        <form onSubmit={handleSignup} className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-800 block mb-1.5">Username</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        value={signupData.username}
                                        onChange={(e) => setSignupData({ ...signupData, username: e.target.value })}
                                        placeholder="yourusername"
                                        required
                                        className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-800 block mb-1.5">Full name</label>
                                <div className="relative">
                                    <UserCircle2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        value={signupData.fullName}
                                        onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                                        placeholder="Jane Doe"
                                        required
                                        className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-800 block mb-1.5">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="email"
                                        value={signupData.email}
                                        onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                                        placeholder="you@example.com"
                                        required
                                        className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-800 block mb-1.5">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={signupData.password}
                                        onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                                        placeholder="At least 8 characters"
                                        required
                                        minLength={8}
                                        className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                                    />
                                    <button type="button" onClick={() => setShowPassword((s) => !s)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

                            <button type="submit" disabled={loading}
                                    className="w-full bg-gray-900 text-white py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-800 disabled:opacity-60 transition-colors">
                                {loading ? "Creating account…" : "Create account"} {!loading && <ArrowRight className="w-4 h-4" />}
                            </button>
                        </form>

                        <div className="flex items-center gap-3 my-6">
                            <div className="flex-1 h-px bg-gray-200" />
                            <span className="text-xs text-gray-400">OR</span>
                            <div className="flex-1 h-px bg-gray-200" />
                        </div>

                        <p className="text-center text-sm text-gray-500">
                            Already have an account?{" "}
                            <button onClick={() => switchMode("login")} className="font-semibold text-gray-900 hover:underline">
                                Sign in
                            </button>
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}