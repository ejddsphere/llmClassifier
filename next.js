//Pre-reqs:

npm install express openai dotenv @mendable/firecrawl-js

.env file:
OPENAI_API_KEY=your_openai_key
FIRECRAWL_API_KEY=your_firecrawl_key

//<<code>>

Website Frontend:
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
        maxWidth: "900px",
        margin: "40px auto",
        fontFamily: "Arial, sans-serif",
        padding: "20px",
      }}
    >
      <h1>Website Classifier</h1>

      <p>
        Enter a URL to classify it as <strong>ecommerce</strong>,
        <strong> social/ugc</strong>, <strong>news/media</strong>, or
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
            padding: "12px",
            fontSize: "16px",
            marginBottom: "16px",
          }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "12px 24px",
            fontSize: "16px",
            cursor: loading ? "default" : "pointer",
          }}
        >
          {loading ? "Processing..." : "Submit"}
        </button>
      </form>

      {loading && (
        <div style={{ marginTop: "30px" }}>
          <h3>Processing Website...</h3>
          <p>✔ Saving URL</p>
          <p>✔ Scraping website with Firecrawl</p>
          <p>✔ Sending content to OpenAI</p>
          <p>✔ Classifying website</p>
          <p>✔ Generating summary</p>
        </div>
      )}

      {error && (
        <div
          style={{
            marginTop: "20px",
            color: "red",
          }}
        >
          {error}
        </div>
      )}

      {result && (
        <div
          style={{
            marginTop: "40px",
            border: "1px solid #ddd",
            padding: "20px",
            borderRadius: "8px",
          }}
        >
          <h2>Results</h2>

          <p>
            <strong>URL:</strong> {result.url}
          </p>

          <p>
            <strong>Title:</strong> {result.title}
          </p>

          <p>
            <strong>Category:</strong> {result.category}
          </p>

          <p>
            <strong>Confidence:</strong> {result.confidence}%
          </p>

          <p>
            <strong>Reason:</strong> {result.reason}
          </p>

          <h3>Summary</h3>

          <p>{result.summary}</p>
        </div>
      )}
    </main>
  );
}
next.js first file:
import fs from "fs";
import path from "path";

const FILE = path.join(process.cwd(), "urls.json");

export function saveUrl(url) {
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

//API Usages and Outputs:
import { NextResponse } from "next/server";
import OpenAI from "openai";
import FirecrawlApp from "@mendable/firecrawl-js";
import { saveUrl } from "@/lib/saveUrl";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const firecrawl = new FirecrawlApp({
  apiKey: process.env.FIRECRAWL_API_KEY,
});

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

    console.log("====================================");
    console.log(`Processing ${url}`);

    console.log("[10%] Saving URL...");
    saveUrl(url);

    console.log("[30%] Scraping with Firecrawl...");

    const scrape = await firecrawl.scrapeUrl(url, {
      formats: ["markdown"],
    });

    if (!scrape.success) {
      return NextResponse.json(
        {
          error: "Unable to scrape page",
        },
        { status: 500 }
      );
    }

    console.log("[60%] Scrape complete.");

    const markdown = scrape.markdown || "";
    const pageContent = markdown.substring(0, 15000);

    console.log("[75%] Calling OpenAI...");

    const ai = await openai.responses.create({
      model: "gpt-5.5",
      input: `
Analyze the following webpage.

Return ONLY valid JSON.

{
  "category": "",
  "confidence": 0,
  "reason": "",
  "summary": ""
}

Categories:
- ecommerce
- social media/ugc
- news/media
- other

URL:
${url}

CONTENT:
${pageContent}
`,
    });

    console.log("[95%] Parsing response...");

    const result = JSON.parse(ai.output_text);

    console.log(
      `[100%] Finished in ${((Date.now() - start) / 1000).toFixed(2)} seconds`
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
      {
        error: error.message,
      },
      { status: 500 }
    );
  }
}

//Implementation

Call API from next.js page:
const response = await fetch("/api/process", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ url }),
});

const data = await response.json();

Output results classification:
const ai = await openai.responses.create({
  model: "gpt-5.5",
  input: `

//Prompt:

You are a website classifier.

Your job is to classify the website into EXACTLY ONE of these categories:

- ecommerce
- social/ugc
- news/media
- other

Definitions:

1. ecommerce
   - The primary purpose is selling products or services.
   - Examples: online stores, marketplaces, subscription services, booking sites.

2. social/ugc
   - The primary purpose is user-generated content, communities, forums, social networking, reviews, videos, or creator content.
   - Examples: forums, social networks, discussion boards, review sites, video sharing, blogs centered on user contributions.

3. news/media
   - The primary purpose is publishing news, journalism, magazines, editorial content, press releases, or media content.

4. other
   - Any site that does not primarily fit the categories above.
   - Examples: government, education, nonprofits, SaaS tools, corporate websites, documentation, personal portfolios.

Return ONLY valid JSON using this schema:

{
  "category": "ecommerce | social/ugc | news/media | other",
  "confidence": 0,
  "reason": "",
  "summary": ""
}

Rules:
- category MUST be exactly one of the four values.
- confidence must be an integer between 0 and 100.
- summary could be up to 2-3 paragraphs.
- reason should be one concise sentence.

URL:
${url}

PAGE CONTENT:
${pageContent}
`
});
