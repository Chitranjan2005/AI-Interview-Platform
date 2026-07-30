"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";

function DashboardContent() {
    const [sheets, setSheets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const { user } = useAuth();
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

    if (loading) return <p style={{ padding: "40px" }}>Loading...</p>;
    if (error) return <p style={{ padding: "40px", color: "red" }}>{error}</p>;

    return (
        <div style={{ maxWidth: "800px", margin: "40px auto", padding: "0 20px" }}>
            <h1>Practice Sets</h1>
            <p>Welcome, {user?.fullName || user?.username}</p>

            <div style={{ display: "grid", gap: "16px", marginTop: "24px" }}>
                {sheets.map((sheet) => (
                    <div key={sheet._id} style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "16px" }}>
                        <h3>{sheet.name}</h3>
                        <p>Difficulty: {sheet.difficulty}</p>
                        <button
                            onClick={() => router.push(`/interview/start?sheetId=${sheet._id}`)}
                            style={{ padding: "8px 16px", marginTop: "8px" }}
                        >
                            Start Practice
                        </button>
                    </div>
                ))}
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