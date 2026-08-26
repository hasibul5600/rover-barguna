"use client";

import { useEffect } from "react";
import "./globals.css";

/**
 * Last-resort fallback for a crash in the root layout itself. It replaces the
 * layout entirely, so it must render its own <html>/<body> and import the
 * stylesheet on its own. Kept deliberately dependency-free — no shared
 * components — so a broken import elsewhere can't take this page down too.
 */
export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    console.error("Root layout error:", error);
  }, [error]);

  return (
    <html lang="bn" dir="ltr">
      <body>
        <div
          style={{
            display: "grid",
            placeItems: "center",
            minHeight: "100vh",
            padding: "2rem",
            textAlign: "center",
            background: "#f8f7f0",
            color: "#13251f",
            fontFamily: '"Hind Siliguri", "Noto Sans Bengali", Arial, sans-serif',
          }}
        >
          <div style={{ maxWidth: "30rem" }}>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#073b2c", margin: 0 }}>
              সাইটটি এখন লোড করা যাচ্ছে না
            </h1>

            <p style={{ marginTop: "0.75rem", color: "#475569", lineHeight: 1.7 }}>
              একটি গুরুতর ত্রুটির কারণে পৃষ্ঠাটি দেখানো সম্ভব হচ্ছে না। কিছুক্ষণ পর আবার চেষ্টা করুন।
            </p>

            <a
              href="/"
              style={{
                display: "inline-block",
                marginTop: "1.75rem",
                padding: "0.85rem 1.5rem",
                borderRadius: "999px",
                background: "#f5bf43",
                color: "#073b2c",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              আবার লোড করুন
            </a>

            {error.digest ? (
              <p style={{ marginTop: "2rem", fontSize: "0.75rem", color: "#94a3b8" }}>
                রেফারেন্স কোড: {error.digest}
              </p>
            ) : null}
          </div>
        </div>
      </body>
    </html>
  );
}
