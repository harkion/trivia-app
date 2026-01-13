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
  const [username, setUsername] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      setErrorMsg(null);

      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");
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
      <h1 style={{ fontSize: 34, marginBottom: 8 }}>Quiz Craft</h1>
      <p style={{ opacity: 0.85, marginBottom: 18 }}>
        Pick a category. You get more points for faster answers.
      </p>

      <input
        type="text"
        placeholder="Enter your name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{
          padding: 10,
          marginBottom: 16,
          width: "100%",
          borderRadius: 8,
        }}
      />

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
              href={`/quiz?category=${cat.id}&user=${encodeURIComponent(username)}`}
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
  <br />

      <Link href="/leaderboard" style={{ display: "inline-block", marginBottom: 16 }}> View Leaderboard → </Link>

    </main>
  );
}
