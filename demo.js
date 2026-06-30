"use client";

import { useState } from "react";

// -------------------------
// SERVER IMPORTS (normally server-only)
// -------------------------

import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import FirecrawlApp from "@mendable/firecrawl-js";

// -------------------------
// CONFIG
// -------------------------

const FILE = path.join(process.cwd(), "urls.json");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const firecrawl = new FirecrawlApp({
  apiKey: process.env.FIRECRAWL_API_KEY,
});

// -------------------------
// SAVE URL
// -------------------------

function saveUrl(url) {
  let urls = [];

  if (fs.existsSync(FILE)) {
    urls = JSON.parse(fs.readFileSync(FILE, "utf8"));
  }

  urls.push({
    url,
    processed: new Date().toISOString(),
  });

  fs.writeFileSync(FILE, JSON.stringify(urls, null, 2));
}

// -------------------------
// AI PROMPT
// -------------------------

const PROMPT = `
You are a website classifier.

Classify the website into EXACTLY ONE category.

Categories:
- ecommerce
- social/ugc
- news/media
- other

Definitions:

1. ecommerce
Selling products or services.

2. social/ugc
Forums, communities, reviews, creators,
social networking, user-generated content.

3. news/media
News organizations, journalism,
editorial or magazine content.

4. other
Government, education, SaaS,
corporate websites,
documentation,
portfolios,
nonprofits, etc.

Return ONLY valid JSON.

{
  "category": "",
  "confidence": 0,
  "reason": "",
  "summary": ""
}

Rules:
- category must be exactly one value above
- confidence must be 0-100
- summary should be 2-3 paragraphs
- reason should be one concise sentence
`;

// -------------------------
// API ROUTE
// -------------------------

export async function POST(request) {
  const start = Date.now();

  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      );
    }

    console.log(`Processing ${url}`);

    saveUrl(url);

    const scrape = await firecrawl.scrapeUrl(url, {
      formats: ["markdown"],
    });

    if (!scrape.success) {
      return NextResponse.json(
        { error: "Unable to scrape page" },
        { status: 500 }
      );
    }

    const pageContent = (scrape.markdown || "").slice(0, 15000);

    const ai = await openai.responses.create({
      model: "gpt-5.5",
      input: `
${PROMPT}

URL:
${url}

PAGE CONTENT:

${pageContent}
`,
    });

    const result = JSON.parse(ai.output_text);

    console.log(
      `Finished in ${(
        (Date.now() - start) /
        1000
      ).toFixed(2)}s`
    );

    return NextResponse.json({
      url,
      title: scrape.metadata?.title || "",
      description: scrape.metadata?.description || "",
      ...result,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// -------------------------
// FRONTEND
// -------------------------

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
        <strong> news/media</strong>, or
        <strong> other</strong>.
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
            marginBottom: 16,
            fontSize: 16,
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
          <h3>Processing...</h3>
          <p>✔ Saving URL</p>
          <p>✔ Scraping website</p>
          <p>✔ Sending to OpenAI</p>
          <p>✔ Classifying website</p>
          <p>✔ Generating summary</p>
        </div>
      )}

      {error && (
        <div
          style={{
            color: "red",
            marginTop: 20,
          }}
        >
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
