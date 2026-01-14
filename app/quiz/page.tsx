"use client";

import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
// import Timer from "../components/Timer"; -- REMOVED with TimerBar addition, still here if needed later
import { supabase } from "../lib/supabase";
import TimerBar from "../components/TimerBar";

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
  const username = searchParams.get("user");
  const hasAdvancedRef = useRef(false);

  const [questions, setQuestions] = useState<QuestionRow[]>([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(DEFAULT_TIME_PER_QUESTION);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const currentQuestion = useMemo(
    () => questions[current],
    [questions, current]
  );

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      let data, error;

      if (categoryId) {
        // OPTION A: If a category is selected, get RANDOM questions via RPC
        const response = await supabase.rpc("get_random_questions", {
          category_id_input: categoryId,
          limit_count: 10,
        });
        data = response.data;
        error = response.error;
      } else {
        // OPTION B: No category? Just fetch the first 10 normally (Fallback)
        const response = await supabase.from("questions").select("*").limit(10);
        data = response.data;
        error = response.error;
      }

      if (error) {
        console.error("Supabase error:", error);
        setErrorMsg(error.message);
        setQuestions([]);
      } else {
        const rawQuestions = (data as any[]) ?? [];

        const processedQuestions = rawQuestions.map((q) => {
          // Put all answers (correct + wrong) into one big list
          const allOptions = [
            q.correct_answer,
            q.wrong_answer_1,
            q.wrong_answer_2,
            q.wrong_answer_3,
          ].filter(Boolean); // removes any empty ones

          // Shuffle that list
          const shuffledOptions = shuffleArray(allOptions);

          // Find where the correct answer ended up
          const newCorrectIndex = shuffledOptions.indexOf(q.correct_answer);

          return {
            ...q,
            options: shuffledOptions, // The new random order
            correct_index: newCorrectIndex, // The new correct spot
          };
        });

        setQuestions(processedQuestions);
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  // Function to finish the game and navigate to results page
  const finishGame = useCallback(
    async (finalScore: number) => {
      if (username && categoryId) {
        await supabase.from("scores").insert({
          username,
          score: finalScore,
          category_id: categoryId,
        });
      }

      router.replace(`/result?score=${finalScore}`);
    },
    [username, categoryId, router]
  );

  // Initial fetch
  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  // Start / restart timer for each question
  useEffect(() => {
    if (!currentQuestion) return;

    hasAdvancedRef.current = false;

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
    if (hasAdvancedRef.current) return;

    // Safety check to stop if user already answered !!***
    if (selectedIndex !== null && selectedIndex !== -1) return;

    hasAdvancedRef.current = true;

    setSelectedIndex(-1);
    setIsCorrect(false);

    const timeoutId = setTimeout(() => {
      setSelectedIndex(null);
      setIsCorrect(null);
      setTimeLeft(DEFAULT_TIME_PER_QUESTION);
      setCurrent((c) => c + 1);
    }, 700);

    return () => clearTimeout(timeoutId);
  }, [timeLeft, currentQuestion]);

  // When quiz ends, navigate to result page
  useEffect(() => {
    if (loading) return;
    // Wait until questions are loaded before deciding if the game is over
    if (questions.length === 0 && !errorMsg) return;

    // If user finished the last question, go to results
    if (questions.length > 0 && current >= questions.length) {
      finishGame(score);
    }
  }, [current, loading, questions.length, router, score, errorMsg]);

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

  if (loading)
    return (
      <p style={{ textAlign: "center", marginTop: 40 }}>Loading questions...</p>
    );
  if (errorMsg)
    return (
      <p style={{ textAlign: "center", marginTop: 40 }}>Error: {errorMsg}</p>
    );

  if (!questions.length)
    return (
      <div style={{ textAlign: "center", marginTop: 40 }}>
        <p>No questions found for this category yet.</p>
        <button
          onClick={() => router.push("/")}
          style={{ marginTop: 10, padding: "8px 16px", cursor: "pointer" }}
        >
          Go back
        </button>
      </div>
    );

  if (!currentQuestion)
    return <p style={{ textAlign: "center" }}>Preparing game...</p>;

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div style={{ width: "100%", maxWidth: 720 }}>
        <header
          style={{
            display: "flex",
            // justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
            marginBottom: 24,
          }}
        >
          
          <TimerBar timeLeft={timeLeft} total={DEFAULT_TIME_PER_QUESTION} />

          <div
            style={{
              marginLeft: "auto",
              fontWeight: 700,
              fontSize: 18,
              padding: "6px 12px",
              borderRadius: 10,
              background: "rgba(255,255,255,0.08)",
            }}
          >
            Score: {score}
          </div>
        </header>

        <section style={{ marginTop: 18 }}>
          <div style={{ opacity: 0.8, marginBottom: 8 }}>
            Question {Math.min(current + 1, questions.length)} /{" "}
            {questions.length}
          </div>
          <h2 style={{ fontSize: 22, lineHeight: 1.3 }}>
            {currentQuestion.question}
          </h2>

          {currentQuestion.image_url && (
            <div
              style={{
                margin: "20px 0",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <img
                src={currentQuestion.image_url}
                alt="Quiz context"
                style={{
                  maxHeight: "300px",
                  maxWidth: "100%",
                  borderRadius: "16px",
                  border: "2px solid rgba(255,255,255,0.1)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
                }}
              />
            </div>
          )}

          <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
            {currentQuestion.options.map((opt, i) => {
              const isPicked = selectedIndex === i;
              const shouldShow = selectedIndex !== null;
              const isTheCorrect = currentQuestion.correct_index === i;

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
                    background: "transparent",
                    color: "inherit",
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
      </div>
    </main>
  );
}
function shuffleArray(array: any[]) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
