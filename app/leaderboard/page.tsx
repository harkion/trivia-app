"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Link from "next/link";

type ScoreRow = {
id: string;
username: string;
score: number;
category_id: string | null;
created_at: string;
categories?: { name: string };
};

export default function LeaderboardPage() {
const [scores, setScores] = useState<ScoreRow[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
    (async () => {
    const { data } = await supabase
        .from("scores")
        .select("id, username, score, created_at, categories(name)")
        .order("score", { ascending: false })
        .limit(10);

    setScores((data as ScoreRow[]) ?? []);
    setLoading(false);
    })();
}, []);

return (
    <main style={{ maxWidth: 700, margin: "0 auto", padding: 24 }}>
    <h1 style={{ fontSize: 32, marginBottom: 20 }}>🏆 Leaderboard</h1>

    {loading && <p>Loading leaderboard...</p>}

    {!loading && scores.length === 0 && <p>No scores yet.</p>}

    {!loading && scores.length > 0 && (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
            <tr style={{ textAlign: "left", opacity: 0.8 }}>
            <th>#</th>
            <th>Player</th>
            <th>Score</th>
            <th>Category</th>
            </tr>
        </thead>
        <tbody>
            {scores.map((row, i) => (
            <tr
                key={row.id}
                style={{ borderTop: "1px solid rgba(255,255,255,0.15)" }}
            >
                <td>{i + 1}</td>
                <td>{row.username}</td>
                <td>{row.score}</td>
                <td>{row.categories?.name ?? "-"}</td>
            </tr>
            ))}
        </tbody>
        </table>
    )}

        <div style={{ marginTop: 24 }}>
            <Link href="/">← Back to Home</Link>
        </div>
    </main>
);
}
