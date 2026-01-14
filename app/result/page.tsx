"use client";

import { useSearchParams, useRouter } from "next/navigation";

type ScoreReaction = {
title: string;
subtitle?: string;
};

function getScoreReaction(score: number): ScoreReaction {
if (score === 0) {
    return {
    title: "Better luck next time, twin 💀",
    };
}

if (score < 300) {
    return {
    title: "NPC energy... locked out 🔒",
    };
}

if (score < 600) {
    return {
    title: "Okay okay… not bad 👀",
    subtitle: "Respectable. Could be better though.",
    };
}

if (score < 800) {
    return {
    title: "You were cooking fr 🔥",
    subtitle: "One more run and you'll dominate.",
    };
}

if (score < 900) {
    return {
    title: "W Rizz.",
    subtitle: "Absolute academic weapon 🧠",
    };
}

if (score >= 1000) {
    return {
        title: "You just crushed it King 👑 GOAT status.",
        subtitle: "Main character energy.",
    };
}

return {
    title: "YOU JUST CRUSHED IT, KING 👑",
    subtitle: "Main character energy.",
};

}


export default function ResultPage() {
const searchParams = useSearchParams();
const router = useRouter();

const score = Number(searchParams.get("score") ?? 0);
const reaction = getScoreReaction(score);

return (
    <main
    style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: 16,
    }}
    >
    <h1 style={{ fontSize: 40, marginBottom: 12 }}>Game Over</h1>

    <p style={{ opacity: 0.7 }}>Your Score</p>

    <div
        style={{
        fontSize: 72,
        fontWeight: 700,
        margin: "12px 0 16px",
        }}
    >
        {score}
    </div>

        <button
        onClick={() => {
        navigator.clipboard.writeText(window.location.origin + "/quiz" + window.location.search);
        alert("Multiplayer link copied! 🔥");
        }}
    >
        🔗 Challenge others with this quiz
    </button>


    <h2 style={{ marginBottom: 6, marginTop: 18 }}>{reaction.title}</h2>

    {reaction.subtitle && (
        <p style={{ opacity: 0.75, marginBottom: 24,}}>{reaction.subtitle}</p>
    )}

    <div
        style={{
        display: "flex",
        gap: 24,
        justifyContent: "center",
        marginTop: 32,
        }}
    >
        <button onClick={() => router.push("/")}>Home</button>
        <button onClick={() => router.push("/quiz")}>Play Again</button>
        <button onClick={() => router.push("/leaderboard")}>Leaderboard</button>
    </div>
    </main>
);
}
