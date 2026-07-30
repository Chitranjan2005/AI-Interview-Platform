"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
    const [sheets, setSheets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login");
            return;
        }

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

        if (user) fetchSheets();
    }, [user, authLoading, router]);

    if (authLoading || loading) return <p style={{ padding: "40px" }}>Loading...</p>;
    if (error) return <p style={{ padding: "40px", color: "red" }}>{error}</p>;

    return (
        <div style={{ maxWidth: "800px", margin: "40px auto", padding: "0 20px" }}>
            <h1>Practice Sets</h1>
            <p>Welcome, {user?.fullName || user?.username}</p>

            <div style={{ display: "grid", gap: "16px", marginTop: "24px" }}>
                {sheets.map((sheet) => (
                    <div
                        key={sheet._id}
                        style={{
                            border: "1px solid #ccc",
                            borderRadius: "8px",
                            padding: "16px",
                        }}
                    >
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