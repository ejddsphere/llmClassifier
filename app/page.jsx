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
    setResult(null);
    setError("");

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
        maxWidth: 900,
        margin: "40px auto",
        padding: 20,
        fontFamily: "Arial",
      }}
    >
      <h1>Website Classifier</h1>

      <p>
        Enter a website URL to classify it as
        <strong> ecommerce</strong>,
        <strong> social/ugc</strong>,
        <strong> news/media</strong>,
        or <strong>other</strong>.
      </p>

      <form onSubmit={handleSubmit}>
        <input
          type="url"
          required
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{
            width: "100%",
            padding: 12,
            fontSize: 16,
            marginBottom: 16,
          }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "12px 24px",
            fontSize: 16,
          }}
        >
          {loading ? "Processing..." : "Submit"}
        </button>
      </form>

      {loading && (
        <div style={{ marginTop: 30 }}>
          <h3>Processing Website...</h3>
          <p>✔ Saving URL</p>
          <p>✔ Scraping website with Firecrawl</p>
          <p>✔ Sending content to OpenAI</p>
          <p>✔ Classifying website</p>
          <p>✔ Generating summary</p>
        </div>
      )}

      {error && (
        <div style={{ color: "red", marginTop: 20 }}>
          {error}
        </div>
      )}

      {result && (
        <div
          style={{
            marginTop: 40,
            border: "1px solid #ddd",
            padding: 20,
            borderRadius: 8,
          }}
        >
          <h2>Results</h2>

          <p><strong>URL:</strong> {result.url}</p>
          <p><strong>Title:</strong> {result.title}</p>
          <p><strong>Category:</strong> {result.category}</p>
          <p><strong>Confidence:</strong> {result.confidence}%</p>
          <p><strong>Reason:</strong> {result.reason}</p>

          <h3>Summary</h3>
          <p>{result.summary}</p>
        </div>
      )}
    </main>
  );
}
