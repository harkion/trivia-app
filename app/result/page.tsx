"use client";

import { useSearchParams, useRouter } from "next/navigation";

export default function ResultPage() {
const params = useSearchParams();
const router = useRouter();
const score = params.get("score");

return (
    <main
    style={{
        maxWidth: 600,
        margin: "0 auto",
        padding: 32,
        textAlign: "center",
    }}
    >
    <h1 style={{ fontSize: 36, marginBottom: 8 }}>Game Over</h1>

    <p style={{ fontSize: 22, marginBottom: 20 }}>Your Score</p>

    <div
        style={{
        fontSize: 48,
        fontWeight: 800,
        marginBottom: 32,
        }}
    >
        {score}
    </div>

    <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        <button
        onClick={() => router.push("/")}
        style={{
            padding: "10px 18px",
            borderRadius: 10,
            cursor: "pointer",
        }}
        >
        Home
        </button>

        <button onClick={() => router.push("/")}>Play Again</button>

        <button
        onClick={() => router.push("/leaderboard")}
        style={{
            padding: "10px 18px",
            borderRadius: 10,
            cursor: "pointer",
        }}
        >
        Leaderboard
        </button>
    </div>
    </main>
);
}
