"use client";

import { useSearchParams, useRouter } from "next/navigation";

export default function ResultPage() {
const params = useSearchParams();
const router = useRouter();
const score = params.get("score");

return (
    <main style={{ maxWidth: 600, margin: "0 auto", padding: 24, textAlign: "center" }}>
    <h1 style={{ fontSize: 32, marginBottom: 12 }}>Game Over</h1>
    <p style={{ fontSize: 20, marginBottom: 24 }}>
        Your Score: <strong>{score}</strong>
    </p>

    <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        <button onClick={() => router.push("/")}>
        Back to Home
        </button>

        <button onClick={() => router.push("/")}>
        Play Again
        </button>
    </div>
    </main>
);
}
