"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "./lib/supabase";

type CategoryRow = {
  id: string;
  name: string;
};

export default function Home() {
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setErrorMsg(null);

      const { data, error } = await supabase.from("categories").select("*").order("name");
      if (error) {
        setErrorMsg(error.message);
        setCategories([]);
      } else {
        setCategories((data as CategoryRow[]) ?? []);
      }

      setLoading(false);
    })();
  }, []);

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 16 }}>
      <h1 style={{ fontSize: 34, marginBottom: 8 }}>Speed Trivia</h1>
      <p style={{ opacity: 0.85, marginBottom: 18 }}>
        Pick a category. You get more points for faster answers.
      </p>

      {loading && <p>Loading categories...</p>}
      {errorMsg && <p>Supabase error: {errorMsg}</p>}

      {!loading && !errorMsg && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 12,
          }}
        >
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/quiz?category=${cat.id}`}
              style={{
                padding: 16,
                borderRadius: 16,
                border: "1px solid rgba(255,255,255,0.15)",
                textDecoration: "none",
              }}
            >
              <div style={{ fontWeight: 700, fontSize: 18 }}>{cat.name}</div>
              <div style={{ opacity: 0.75, marginTop: 4 }}>Start quiz →</div>
            </Link>
          ))}
        </div>
      )}

      <div style={{ marginTop: 22, opacity: 0.75 }}>
        <small>Tip: For MVP, add 3–5 questions per category in Supabase.</small>
      </div>
    </main>
  );
}
