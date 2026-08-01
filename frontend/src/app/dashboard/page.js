"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { useRouter } from "next/navigation";
import { ArrowRight, SlidersHorizontal } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";

const DIFFICULTY_STYLES = {
    Easy: "bg-emerald-50 text-emerald-700",
    Medium: "bg-amber-50 text-amber-700",
    Hard: "bg-red-50 text-red-700",
};

function DashboardContent() {
    const [sheets, setSheets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [difficultyFilter, setDifficultyFilter] = useState("All");
    const [categoryFilter, setCategoryFilter] = useState("All");
    const router = useRouter();

    useEffect(() => {
        async function fetchSheets() {
            try {
                const res = await apiFetch("/sheets");
                setSheets(res.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchSheets();
    }, []);

    const difficulties = ["All", ...new Set(sheets.map((s) => s.difficulty))];
    const categories = ["All", ...new Set(sheets.map((s) => s.category))];

    const filteredSheets = sheets.filter(
        (s) =>
            (difficultyFilter === "All" || s.difficulty === difficultyFilter) &&
            (categoryFilter === "All" || s.category === categoryFilter)
    );

    if (loading) return <p className="p-10 text-gray-500 text-sm">Loading…</p>;
    if (error) return <p className="p-10 text-red-600 text-sm">{error}</p>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="max-w-5xl mx-auto px-6 py-10">
                <h1 className="text-3xl font-bold text-gray-900">Practice sets</h1>
                <p className="text-sm text-gray-500 mt-2 max-w-xl">
                    Pick a sheet to get a randomized set of questions and structured AI feedback on each answer.
                </p>

                <div className="flex flex-wrap items-center gap-2 mt-6">
                    <SlidersHorizontal className="w-4 h-4 text-gray-400" />
                    {categories.map((c) => (
                        <button
                            key={c}
                            onClick={() => setCategoryFilter(c)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                                categoryFilter === c
                                    ? "bg-gray-900 text-white border-gray-900"
                                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                            }`}
                        >
                            {c}
                        </button>
                    ))}
                    <span className="w-px h-4 bg-gray-300 mx-1" />
                    {difficulties.map((d) => (
                        <button
                            key={d}
                            onClick={() => setDifficultyFilter(d)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                                difficultyFilter === d
                                    ? "bg-gray-900 text-white border-gray-900"
                                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                            }`}
                        >
                            {d}
                        </button>
                    ))}
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
                    {filteredSheets.map((sheet) => (
                        <div
                            key={sheet._id}
                            className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                        >
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-medium text-gray-500">{sheet.category}</span>
                                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${DIFFICULTY_STYLES[sheet.difficulty]}`}>
                                        {sheet.difficulty}
                                    </span>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">{sheet.name}</h3>
                                <p className="text-xs text-gray-500 mt-1">{sheet.slotCount} questions per session</p>
                            </div>

                            <button
                                onClick={() => router.push(`/interview/start?sheetId=${sheet._id}`)}
                                className="mt-4 w-full bg-gray-900 text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
                            >
                                Start practice <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>

                {filteredSheets.length === 0 && (
                    <p className="text-sm text-gray-400 mt-10 text-center">No sheets match these filters.</p>
                )}
            </div>
        </div>
    );
}

export default function DashboardPage() {
    return (
        <ProtectedRoute>
            <DashboardContent />
        </ProtectedRoute>
    );
}