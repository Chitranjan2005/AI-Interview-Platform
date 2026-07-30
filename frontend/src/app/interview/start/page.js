"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

function InterviewContent() {
    const searchParams = useSearchParams();
    const sheetId = searchParams.get("sheetId");
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();

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
        if (!authLoading && !user) {
            router.push("/login");
            return;
        }

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

        if (user && sheetId) startPractice();
    }, [user, authLoading, sheetId, router]);

    async function handleSubmit(e) {
        e.preventDefault();
        setSubmitting(true);
        setError("");

        try {
            const currentQuestion = questions[currentIndex];
            const res = await apiFetch("/interview/submit-answer", {
                method: "POST",
                body: JSON.stringify({
                    sessionId,
                    questionId: currentQuestion._id,
                    answer,
                }),
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

    if (authLoading || loading) return <p style={{ padding: "40px" }}>Loading practice set...</p>;
    if (error && questions.length === 0) return <p style={{ padding: "40px", color: "red" }}>{error}</p>;
    if (questions.length === 0) return <p style={{ padding: "40px" }}>No questions available.</p>;

    if (currentIndex >= questions.length) {
        return (
            <div style={{ maxWidth: "600px", margin: "60px auto", textAlign: "center" }}>
                <h2>Practice session complete</h2>
                <p>You answered {questions.length} question(s) from {sheetName}.</p>
                <button onClick={() => router.push("/dashboard")} style={{ padding: "10px 20px", marginTop: "16px" }}>
                    Back to Dashboard
                </button>
            </div>
        );
    }

    const currentQuestion = questions[currentIndex];

    return (
        <div style={{ maxWidth: "700px", margin: "40px auto", padding: "0 20px" }}>
            <p style={{ color: "#666" }}>
                {sheetName} — Question {currentIndex + 1} of {questions.length}
            </p>

            <h2>{currentQuestion.title}</h2>
<p style={{ fontSize: "14px", color: "#888" }}>
    Difficulty: {currentQuestion.difficulty} · Tags: {currentQuestion.approachTags.join(", ")}
</p>

{currentQuestion.generatedStatement?.statement && (
    <div style={{ marginTop: "16px" }}>
        <p>{currentQuestion.generatedStatement.statement}</p>

        <p><strong>Input:</strong> {currentQuestion.generatedStatement.inputFormat}</p>
        <p><strong>Output:</strong> {currentQuestion.generatedStatement.outputFormat}</p>
        <p><strong>Constraints:</strong> {currentQuestion.generatedStatement.constraints}</p>

        {currentQuestion.generatedStatement.examples?.map((ex, i) => (
            <div key={i} style={{ background: "#f5f5f5", padding: "10px", borderRadius: "6px", marginTop: "8px" }}>
                <p><strong>Example {i + 1}</strong></p>
                <p>Input: <code>{ex.input}</code></p>
                <p>Output: <code>{ex.output}</code></p>
                {ex.explanation && <p>Explanation: {ex.explanation}</p>}
            </div>
        ))}
    </div>
)}

{currentQuestion.sourceUrl && (
    <p style={{ marginTop: "10px" }}>
        <a href={currentQuestion.sourceUrl} target="_blank" rel="noopener noreferrer">
            View original problem reference →
        </a>
    </p>
)}

            {!feedback ? (
                <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
                    <textarea
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Write your approach, pseudocode, or code here..."
                        rows={10}
                        required
                        style={{ width: "100%", padding: "10px", fontFamily: "monospace" }}
                    />
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    <button type="submit" disabled={submitting} style={{ padding: "10px 20px", marginTop: "10px" }}>
                        {submitting ? "Evaluating..." : "Submit Answer"}
                    </button>
                </form>
            ) : (
                <div style={{ marginTop: "20px", border: "1px solid #ddd", borderRadius: "8px", padding: "16px" }}>
                    <h3>Feedback</h3>
                    <p><strong>Correctness:</strong> {feedback.correctness.score}/10 — {feedback.correctness.notes}</p>
                    <p><strong>Clarity:</strong> {feedback.clarity.score}/10 — {feedback.clarity.notes}</p>
                    <p><strong>Communication:</strong> {feedback.communication.score}/10 — {feedback.communication.notes}</p>
                    <p><strong>Follow-up:</strong> {feedback.followUpQuestion}</p>

                    <button onClick={handleNext} style={{ padding: "10px 20px", marginTop: "12px" }}>
                        {currentIndex + 1 < questions.length ? "Next Question" : "Finish Session"}
                    </button>
                </div>
            )}
        </div>
    );
}

export default function InterviewStartPage() {
    return (
        <Suspense fallback={<p style={{ padding: "40px" }}>Loading...</p>}>
            <InterviewContent />
        </Suspense>
    );
}