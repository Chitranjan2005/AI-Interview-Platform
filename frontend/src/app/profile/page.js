"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Trophy, Target, ListChecks } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

function ProfileContent() {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchStats() {
            try {
                const res = await apiFetch("/sessions/stats");
                setStats(res.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    if (loading) return <p className="p-10 text-sm text-gray-500">Loading…</p>;
    if (error) return <p className="p-10 text-sm text-red-600">{error}</p>;

    // Aggregate pointsOverTime by date for a cleaner line chart
    const chartData = Object.values(
        stats.pointsOverTime.reduce((acc, entry) => {
            if (!acc[entry.date]) acc[entry.date] = { date: entry.date, points: 0 };
            acc[entry.date].points += entry.points;
            return acc;
        }, {})
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="max-w-3xl mx-auto px-6 py-10">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gray-900 text-white flex items-center justify-center text-xl font-bold">
                        {(user?.fullName || user?.username || "?")[0].toUpperCase()}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{user?.fullName}</h1>
                        <p className="text-sm text-gray-500">@{user?.username} · {user?.email}</p>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-8">
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                        <Trophy className="w-5 h-5 text-amber-500 mb-2" />
                        <p className="text-2xl font-bold text-gray-900">{stats.totalPoints}</p>
                        <p className="text-xs text-gray-500">Total points</p>
                    </div>
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                        <ListChecks className="w-5 h-5 text-gray-900 mb-2" />
                        <p className="text-2xl font-bold text-gray-900">{stats.totalAnswered}</p>
                        <p className="text-xs text-gray-500">Questions answered</p>
                    </div>
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                        <Target className="w-5 h-5 text-emerald-600 mb-2" />
                        <p className="text-2xl font-bold text-gray-900">
                            {stats.accuracyPerSheet.length > 0
                                ? Math.round(stats.accuracyPerSheet.reduce((s, x) => s + x.accuracy, 0) / stats.accuracyPerSheet.length)
                                : 0}%
                        </p>
                        <p className="text-xs text-gray-500">Avg accuracy</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mt-6">
                    <h2 className="text-sm font-bold text-gray-900 mb-4">Points over time</h2>
                    {chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={220}>
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#9ca3af" />
                                <YAxis tick={{ fontSize: 11 }} stroke="#9ca3af" />
                                <Tooltip />
                                <Line type="monotone" dataKey="points" stroke="#111827" strokeWidth={2} dot={{ r: 3 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-sm text-gray-400">No data yet — complete a practice session to see progress.</p>
                    )}
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mt-6">
                    <h2 className="text-sm font-bold text-gray-900 mb-4">Accuracy per sheet</h2>
                    <div className="space-y-3">
                        {stats.accuracyPerSheet.map((s) => (
                            <div key={s.sheetName}>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="font-medium text-gray-700">{s.sheetName}</span>
                                    <span className="text-gray-500">{s.accuracy}% · {s.questionsAnswered} answered</span>
                                </div>
                                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-gray-900 rounded-full" style={{ width: `${s.accuracy}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                    {stats.accuracyPerSheet.length === 0 && (
                        <p className="text-sm text-gray-400">No sheets practiced yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function ProfilePage() {
    return (
        <ProtectedRoute>
            <ProfileContent />
        </ProtectedRoute>
    );
}