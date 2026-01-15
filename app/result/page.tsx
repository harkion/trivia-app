"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Suspense } from "react";
import { supabase } from "../lib/supabase"; //

    type ScoreReaction = {
    title: string;
    subtitle?: string;
    };

function getScoreReaction(score: number): ScoreReaction {
if (score === 0) {
    return { title: "Better luck next time, twin 💀" };
}

if (score < 300) {
    return { title: "NPC energy... locked out 🔒" };
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

return {
    title: "You just crushed it King 👑",
    subtitle: "Main character energy.",
};
}

    function shareLink() {
    navigator.clipboard.writeText(window.location.href);
    alert("Multiplayer link copied! ");
    }

    const shareButtonStyle: React.CSSProperties = {
    padding: "8px 14px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(255,255,255,0.05)",
    cursor: "pointer",
    fontSize: 14,
    };

export default function ResultPage() {
    return (
        <Suspense fallback={<p>Loading result…</p>}>
        <ResultContent />
        </Suspense>
    );
}


function ResultContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const score = Number(searchParams.get("score") ?? 0);
    const reaction = getScoreReaction(score);

    const [name, setName] = useState(searchParams.get("user") ?? "");
    const [saved, setSaved] = useState(false);
    const [showQR, setShowQR] = useState(false);

async function saveScore() {
    if (!name.trim()) return;

    await supabase.from("scores").insert({
    username: name,
    score,
    });

    setSaved(true);
}

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

    {!saved && (
        <>
        {!name && (
            <>
            <p style={{ opacity: 0.7 }}>
                Enter your name to save your score
            </p>
            <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                style={{ padding: 8, borderRadius: 8 }}
            />
            </>
        )}

        <button
            onClick={saveScore}
            disabled={!name.trim()}
            style={{ marginTop: 12 }}
        >
            Save Score
        </button>
        </>
    )}

    {saved && (
        <p style={{ marginTop: 12, opacity: 0.8 }}>
        ✅ Score saved to leaderboard
        </p>
    )}

{/* MULTIPLAYER ACTIONS */}
    <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
        <button onClick={shareLink} style={shareButtonStyle}>
        Copy multiplayer link
        </button>

        <button onClick={() => setShowQR((v) => !v)} style={shareButtonStyle}>
        Get QR Code
        </button>
    </div>

    {showQR && (
        <div style={{ marginTop: 12 }}>
        <QRCodeCanvas
            value={typeof window !== "undefined" ? window.location.href : ""}
            size={120}
        />
        <p style={{ opacity: 0.7, fontSize: 13 }}>
            Scan to play the same quiz
        </p>
        </div>
    )}


    <h2 style={{ marginTop: 22 }}>{reaction.title}</h2>

    {reaction.subtitle && (
        <p style={{ opacity: 0.75, marginTop: 6 }}>{reaction.subtitle}</p>
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
