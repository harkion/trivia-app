"use client";
import { useSearchParams } from "next/navigation";

export default function Result() {
const params = useSearchParams();
const score = params.get("score");

return (
    <main>
    <h1>Game Over</h1>
    <p>Your Score: {score}</p>
    </main>
);
}
