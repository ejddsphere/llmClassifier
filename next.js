//Pre-reqs:

npm install express openai dotenv @mendable/firecrawl-js

.env file:
OPENAI_API_KEY=your_openai_key
FIRECRAWL_API_KEY=your_firecrawl_key

//<<code>>

Website:
"use client";

import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Processing failed");
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(135deg, #2563eb 0%, #4f46e5 50%, #7c3aed 100%)",
        padding: "40px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "750px",
          background: "#ffffff",
          borderRadius: "20px",
          boxShadow: "0 20px 60px rgba(0,0,0,.25)",
          padding: "40px",
        }}
      >
        <h1
          style={{
            fontSize: "2.5rem",
            marginBottom: 10,
            color: "#111827",
          }}
        >
          🌐 Website Classifier
        </h1>

        <p
          style={{
            color: "#6b7280",
            lineHeight: 1.6,
            marginBottom: 30,
          }}
        >
          Enter any public website URL and our AI will scrape the page,
          analyze its contents, classify it, and generate a summary.
        </p>

        <div
          style={{
            display: "flex",
            gap: "12px",
            marginBottom: "24px",
          }}
        >
          <span
            style={{
              background: "#E0F2FE",
              color: "#0369A1",
              padding: "8px 14px",
              borderRadius: "999px",
              fontSize: 14,
            }}
          >
            Ecommerce
          </span>

          <span
            style={{
              background: "#ECFDF5",
              color: "#047857",
              padding: "8px 14px",
              borderRadius: "999px",
              fontSize: 14,
            }}
          >
            Social / UGC
          </span>

          <span
            style={{
              background: "#FEF3C7",
              color: "#92400E",
              padding: "8px 14px",
              borderRadius: "999px",
              fontSize: 14,
            }}
          >
            News / Media
          </span>

          <span
            style={{
              background: "#F3F4F6",
              color: "#374151",
              padding: "8px 14px",
              borderRadius: "999px",
              fontSize: 14,
            }}
          >
            Other
          </span>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="url"
            required
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={{
              width: "100%",
              padding: "18px",
              fontSize: "16px",
              border: "2px solid #d1d5db",
              borderRadius: "12px",
              outline: "none",
              marginBottom: "20px",
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "18px",
              fontSize: "18px",
              fontWeight: "bold",
              border: "none",
              borderRadius: "12px",
              background: loading
                ? "#9CA3AF"
                : "linear-gradient(90deg,#2563EB,#7C3AED)",
              color: "white",
              cursor: loading ? "not-allowed" : "pointer",
              transition: ".3s",
            }}
          >
            {loading ? "Analyzing Website..." : "Analyze Website"}
          </button>
        </form>

        {loading && (
          <div
            style={{
              marginTop: 30,
              background: "#F9FAFB",
              borderRadius: 12,
              padding: 20,
            }}
          >
            <h3 style={{ marginBottom: 15 }}>Processing...</h3>

            <p>✅ Saving URL</p>
            <p>🌐 Scraping website with Firecrawl</p>
            <p>🤖 Sending content to OpenAI</p>
            <p>📊 Classifying website</p>
            <p>📝 Generating summary</p>
          </div>
        )}

        {error && (
          <div
            style={{
              marginTop: 25,
              background: "#FEE2E2",
              color: "#991B1B",
              padding: 16,
              borderRadius: 10,
            }}
          >
            {error}
          </div>
        )}

        {result && (
          <div
            style={{
              marginTop: 30,
              background: "#F9FAFB",
              borderRadius: 14,
              padding: 24,
              border: "1px solid #E5E7EB",
            }}
          >
            <h2>{result.title}</h2>

            <p>
              <strong>Category:</strong> {result.category}
            </p>

            <p>
              <strong>Confidence:</strong> {result.confidence}%
            </p>

            <p>
              <strong>Reason:</strong> {result.reason}
            </p>

            <hr
              style={{
                margin: "20px 0",
                border: "none",
                borderTop: "1px solid #E5E7EB",
              }}
            />

            <p style={{ lineHeight: 1.7 }}>{result.summary}</p>
          </div>
        )}
      </div>
    </main>
  );
}
