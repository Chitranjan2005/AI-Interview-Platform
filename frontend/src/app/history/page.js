"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Target, Layers, MessageSquare } from "lucide-react";
import { apiFetch } from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";

const DIFFICULTY_STYLES = {
    Easy: "bg-emerald-50 text-emerald-700",
    Medium: "bg-amber-50 text-amber-700",
    Hard: "bg-red-50 text-red-700",
};

function ScoreBar({ label, score, icon: Icon }) {
    return (
        <div>
            <div className="flex items-center justify-between mb-1">
                <span className="flex items-center gap-1.5 text-xs font-medium text-gray-600">
                    <Icon className="w-3.5 h-3.5" /> {label}
                </span>
                <span className="text-xs font-semibold text-gray-900">{score}/10</span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gray-900 rounded-full" style={{ width: `${score * 10}%` }} />
            </div>
        </div>
    );
}

function SessionCard({ session }) {
    const [expanded, setExpanded] = useState(false);
    const date = new Date(session.createdAt).toLocaleDateString(undefined, {
        month: "short", day: "numeric", year: "numeric",
    });

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <button
                onClick={() => setExpanded((e) => !e)}
                className="w-full flex items-center justify-between p-5 text-left"
            >
                <div>
                    <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-gray-900">{session.sheet?.name || "Practice session"}</h3>
                        {session.sheet?.difficulty && (
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${DIFFICULTY_STYLES[session.sheet.difficulty]}`}>
                                {session.sheet.difficulty}
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                        {date} · {session.entries.length}/{session.questions.length} answered
                    </p>
                </div>
                {expanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
            </button>

            {expanded && (
                <div className="border-t border-gray-100 divide-y divide-gray-100">
                    {session.entries.map((entry, i) => (
                        <div key={i} className="p-5">
                            <p className="text-sm font-semibold text-gray-900">{entry.question?.title || "Question"}</p>
                            <p className="text-xs text-gray-500 mt-1 mb-3">{entry.userAnswer}</p>

                            <div className="space-y-2 bg-gray-50 rounded-lg p-3">
                                <ScoreBar label="Correctness" score={entry.feedback.correctness.score} icon={Target} />
                                <ScoreBar label="Clarity" score={entry.feedback.clarity.score} icon={Layers} />
                                <ScoreBar label="Communication" score={entry.feedback.communication.score} icon={MessageSquare} />
                            </div>
                        </div>
                    ))}
                    {session.entries.length === 0 && (
                        <p className="p-5 text-xs text-gray-400">No answers submitted in this session.</p>
                    )}
                </div>
            )}
        </div>
    );
}

function HistoryContent() {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchHistory() {
            try {
                const res = await apiFetch("/sessions/history");
                setSessions(res.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchHistory();
    }, []);

    if (loading) return <p className="p-10 text-sm text-gray-500">Loading…</p>;
    if (error) return <p className="p-10 text-sm text-red-600">{error}</p>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="max-w-3xl mx-auto px-6 py-10">
                <h1 className="text-3xl font-bold text-gray-900">History</h1>
                <p className="text-sm text-gray-500 mt-2">Your past practice sessions and feedback.</p>

                <div className="space-y-3 mt-8">
                    {sessions.map((session) => (
                        <SessionCard key={session._id} session={session} />
                    ))}
                </div>

                {sessions.length === 0 && (
                    <p className="text-sm text-gray-400 mt-10 text-center">No practice sessions yet.</p>
                )}
            </div>
        </div>
    );
}

export default function HistoryPage() {
    return (
        <ProtectedRoute>
            <HistoryContent />
        </ProtectedRoute>
    );
}