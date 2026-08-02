"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
    ArrowRight, ExternalLink, CheckCircle2, Sparkles,
    MessageSquare, Target, Layers,
} from "lucide-react";
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
                <div className="h-full bg-gray-900 rounded-full transition-all" style={{ width: `${score * 10}%` }} />
            </div>
        </div>
    );
}

function InterviewContent() {
    const sheetId = useSearchParams().get("sheetId");
    const router = useRouter();

    const [sessionId, setSessionId] = useState(null);
    const [sheetName, setSheetName] = useState("");
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answer, setAnswer] = useState("");
    const [feedback, setFeedback] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        async function startPractice() {
            try {
                const res = await apiFetch(`/practice/start/${sheetId}`);
                setSessionId(res.data.sessionId);
                setSheetName(res.data.sheetName);
                setQuestions(res.data.questions);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        if (sheetId) startPractice();
    }, [sheetId]);

    async function handleSubmit(e) {
        e.preventDefault();
        setSubmitting(true);
        setError("");
        try {
            const currentQuestion = questions[currentIndex];
            const res = await apiFetch("/interview/submit-answer", {
                method: "POST",
                body: JSON.stringify({ sessionId, questionId: currentQuestion._id, answer }),
            });
            setFeedback(res.data.feedback);
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    }

    function handleNext() {
        setCurrentIndex((prev) => prev + 1);
        setAnswer("");
        setFeedback(null);
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <p className="text-sm text-gray-500">Preparing your practice set…</p>
            </div>
        );
    }

    if (error && questions.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <p className="text-sm text-red-600">{error}</p>
            </div>
        );
    }

    if (currentIndex >= questions.length) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-6">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900">Session complete</h1>
                    <p className="text-sm text-gray-500 mt-2">
                        You answered {questions.length} question{questions.length > 1 ? "s" : ""} from {sheetName}.
                    </p>
                    <button
                        onClick={() => router.push("/dashboard")}
                        className="mt-6 w-full bg-gray-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                    >
                        Back to dashboard
                    </button>
                </div>
            </div>
        );
    }

    const q = questions[currentIndex];
    const gs = q.generatedStatement;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="max-w-3xl mx-auto px-6 py-10">
                <div className="flex items-center justify-between mb-6">
                    <span className="text-xs font-medium text-gray-500">{sheetName}</span>
                    <span className="text-xs font-medium text-gray-500">
                        Question {currentIndex + 1} of {questions.length}
                    </span>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                    <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${DIFFICULTY_STYLES[q.difficulty]}`}>
                            {q.difficulty}
                        </span>
                        {q.approachTags.map((tag) => (
                            <span key={tag} className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                                {tag}
                            </span>
                        ))}
                    </div>

                    <h2 className="text-xl font-bold text-gray-900 mt-2">{q.title}</h2>

                    {gs?.statement && (
                        <div className="mt-4 space-y-3">
                            <p className="text-sm text-gray-700 leading-relaxed">{gs.statement}</p>

                            <div className="grid sm:grid-cols-2 gap-3 text-sm">
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <p className="text-xs font-semibold text-gray-500 mb-1">Input</p>
                                    <p className="text-gray-700">{gs.inputFormat}</p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <p className="text-xs font-semibold text-gray-500 mb-1">Output</p>
                                    <p className="text-gray-700">{gs.outputFormat}</p>
                                </div>
                            </div>

                            {gs.constraints && (
                                <p className="text-xs text-gray-500">
                                    <span className="font-semibold">Constraints:</span> {gs.constraints}
                                </p>
                            )}

                            {gs.examples?.length > 0 && (
                                <div className="space-y-2">
                                    {gs.examples.map((ex, i) => (
                                        <div key={i} className="bg-gray-900 rounded-lg p-3 font-mono text-xs text-gray-100">
                                            <p className="text-gray-400 mb-1">Example {i + 1}</p>
                                            <p>Input: {ex.input}</p>
                                            <p>Output: {ex.output}</p>
                                            {ex.explanation && <p className="text-gray-400 mt-1">{ex.explanation}</p>}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {q.sourceUrl && (
                        <a
                            href={q.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-900 mt-4"
                        >
                            View original reference <ExternalLink className="w-3 h-3" />
                        </a>
                    )}
                </div>

                {!feedback ? (
                    <form onSubmit={handleSubmit} className="mt-4">
                        <textarea
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            placeholder="Write your approach, pseudocode, or code here…"
                            rows={10}
                            required
                            className="w-full p-4 border border-gray-200 rounded-2xl text-sm font-mono bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                        />
                        {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg mt-3">{error}</p>}
                        <button
                            type="submit"
                            disabled={submitting}
                            className="mt-3 bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-gray-800 disabled:opacity-60 transition-colors"
                        >
                            {submitting ? "Evaluating…" : "Submit answer"} {!submitting && <Sparkles className="w-4 h-4" />}
                        </button>
                    </form>
                ) : (
                    <div className="mt-4 bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles className="w-4 h-4 text-gray-900" />
                            <h3 className="text-sm font-bold text-gray-900">AI feedback</h3>
                        </div>

                        <div className="space-y-3">
                            <ScoreBar label="Correctness" score={feedback.correctness.score} icon={Target} />
                            <p className="text-xs text-gray-500 -mt-1">{feedback.correctness.notes}</p>

                            <ScoreBar label="Clarity" score={feedback.clarity.score} icon={Layers} />
                            <p className="text-xs text-gray-500 -mt-1">{feedback.clarity.notes}</p>

                            <ScoreBar label="Communication" score={feedback.communication.score} icon={MessageSquare} />
                            <p className="text-xs text-gray-500 -mt-1">{feedback.communication.notes}</p>
                        </div>

                        <div className="mt-4 bg-gray-50 rounded-lg p-3">
                            <p className="text-xs font-semibold text-gray-500 mb-1">Follow-up</p>
                            <p className="text-sm text-gray-700">{feedback.followUpQuestion}</p>
                        </div>

                        <button
                            onClick={handleNext}
                            className="mt-4 w-full bg-gray-900 text-white py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
                        >
                            {currentIndex + 1 < questions.length ? "Next question" : "Finish session"}
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function InterviewStartPage() {
    return (
        <ProtectedRoute>
            <Suspense fallback={<p className="p-10 text-sm text-gray-500">Loading…</p>}>
                <InterviewContent />
            </Suspense>
        </ProtectedRoute>
    );
}