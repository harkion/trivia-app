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
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1000,
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: 34, marginBottom: 8 }}>Quiz Craft</h1>
        <p style={{ opacity: 0.85, marginBottom: 18 }}>
          Pick a category. → Lock in. → Speed = Aura.
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
        <p
          style={{
            marginTop: 8,
            fontSize: 14,
            opacity: 0.7,
            marginBottom: 24,
          }}
        >
          💡 Enter a name to save your score & appear on the leaderboard
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
            <div
              className="category-grid"
              style={{
                marginTop: 36,
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 18,
              }}
            >
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/quiz?category=${cat.id}&user=${encodeURIComponent(username)}`}
                  style={{
                    padding: 18,
                    borderRadius: 18,
                    border: "1px solid rgba(255,255,255,0.15)",
                    textDecoration: "none",
                    transition: "all 0.25s ease",
                    background: "rgba(255,255,255,0.02)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-6px)";
                    e.currentTarget.style.border =
                      "1px solid rgba(255,255,255,0.35)";
                    e.currentTarget.style.boxShadow =
                      "0 10px 30px rgba(0,0,0,0.35)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.border =
                      "1px solid rgba(255,255,255,0.15)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: 18 }}>
                    {cat.name}
                  </div>
                  <div style={{ opacity: 0.75, marginTop: 4 }}>
                    Start quiz →
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
        <br />

        <Link
          href="/leaderboard"
          style={{ display: "inline-block", marginBottom: 16 }}
        >
          {" "}
          View Leaderboard →{" "}
        </Link>
      </div>
    </main>
  );
}
