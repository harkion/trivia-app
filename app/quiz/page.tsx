"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Timer from "../components/Timer";
import { supabase } from "../lib/supabase";

type QuestionRow = {
  id: string;
  question: string;
  options: string[];
  correct_index: number;
  category_id: string | null;
};

const DEFAULT_TIME_PER_QUESTION = 10; // seconds

export default function QuizPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("category");

  const [questions, setQuestions] = useState<QuestionRow[]>([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(DEFAULT_TIME_PER_QUESTION);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const currentQuestion = useMemo(() => questions[current], [questions, current]);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);

    // If user arrived without a category, just fetch any questions.
    let query = supabase.from("questions").select("*");
    if (categoryId) query = query.eq("category_id", categoryId);

    const { data, error } = await query.limit(10);
    if (error) {
      setErrorMsg(error.message);
      setQuestions([]);
    } else {
      setQuestions((data as QuestionRow[]) ?? []);
    }

    setLoading(false);
  }, [categoryId]);

  // Initial fetch
  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  // Start / restart timer for each question
  useEffect(() => {
    if (!currentQuestion) return;

    setTimeLeft(DEFAULT_TIME_PER_QUESTION);
    setSelectedIndex(null);
    setIsCorrect(null);

    const interval = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [currentQuestion]);

  // When time runs out, auto-advance (0 points)
  useEffect(() => {
    if (!currentQuestion) return;
    if (timeLeft > 0) return;
    // Prevent multiple triggers
    if (selectedIndex !== null) return;

    setSelectedIndex(-1);
    setIsCorrect(false);

    const timeout = setTimeout(() => {
      setCurrent((c) => c + 1);
    }, 700);

    return () => clearTimeout(timeout);
  }, [timeLeft, currentQuestion, selectedIndex]);

  // When quiz ends, navigate to result page
  useEffect(() => {
    if (loading) return;
    if (questions.length === 0) return;
    if (current < questions.length) return;

    router.replace(`/result?score=${score}`);
  }, [current, loading, questions.length, router, score]);

  const handleAnswer = (index: number) => {
    if (!currentQuestion) return;
    if (selectedIndex !== null) return; // already answered or timed out

    const correct = currentQuestion.correct_index === index;
    setSelectedIndex(index);
    setIsCorrect(correct);

    if (correct) {
      // Simple speed scoring: remaining seconds * 10
      setScore((s) => s + Math.max(timeLeft, 0) * 10);
    }

    // Small delay so user sees feedback before next question
    setTimeout(() => {
      setCurrent((c) => c + 1);
    }, 700);
  };

  if (loading) return <p>Loading questions...</p>;
  if (errorMsg) return <p>Supabase error: {errorMsg}</p>;
  if (!questions.length)
    return (
      <div>
        <p>No questions found for this category yet.</p>
        <button onClick={() => router.push("/")}>Go back</button>
      </div>
    );
  if (!currentQuestion) return <p>Loading...</p>;

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: 16 }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <Timer timeLeft={Math.max(timeLeft, 0)} />
        <div style={{ fontWeight: 600 }}>Score: {score}</div>
      </header>

      <section style={{ marginTop: 18 }}>
        <div style={{ opacity: 0.8, marginBottom: 8 }}>
          Question {Math.min(current + 1, questions.length)} / {questions.length}
        </div>
        <h2 style={{ fontSize: 22, lineHeight: 1.3 }}>{currentQuestion.question}</h2>

        <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
          {currentQuestion.options.map((opt, i) => {
            const isPicked = selectedIndex === i;
            const shouldShow = selectedIndex !== null;
            const isTheCorrect = currentQuestion.correct_index === i;

            // basic feedback styling without relying on CSS yet
            let border = "1px solid rgba(255,255,255,0.15)";
            let opacity = 1;

            if (shouldShow) {
              if (isTheCorrect) border = "2px solid #22c55e";
              if (isPicked && !isTheCorrect) border = "2px solid #ef4444";
              if (!isPicked && !isTheCorrect) opacity = 0.75;
            }

            return (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                disabled={selectedIndex !== null}
                style={{
                  textAlign: "left",
                  padding: "12px 14px",
                  borderRadius: 12,
                  border,
                  opacity,
                  cursor: selectedIndex === null ? "pointer" : "default",
                }}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {selectedIndex !== null && (
          <div style={{ marginTop: 14, fontWeight: 600 }}>
            {isCorrect ? "✅ Correct!" : "❌ Wrong!"}
          </div>
        )}
      </section>
    </main>
  );
}
