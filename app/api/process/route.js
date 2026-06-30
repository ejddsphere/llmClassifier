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
The primary purpose is selling products or services.

2. social/ugc
The primary purpose is user-generated content,
communities, forums, reviews, creators, or videos.

3. news/media
The primary purpose is journalism,
news publishing, magazines, editorials, or media.

4. other
Anything else including:
government, education,
nonprofits, SaaS,
corporate websites,
documentation,
portfolios.

Return ONLY valid JSON.

{
  "category": "",
  "confidence": 0,
  "reason": "",
  "summary": ""
}

Rules:

- category must be one of:
  ecommerce
  social/ugc
  news/media
  other

- confidence must be an integer 0-100

- reason should be one sentence

- summary should be 2-3 short paragraphs
`;

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

    console.log("================================");
    console.log(`Processing ${url}`);

    console.log("[10%] Saving URL...");
    saveUrl(url);

    console.log("[30%] Scraping website...");

    const scrape = await firecrawl.scrapeUrl(url, {
      formats: ["markdown"],
    });

    if (!scrape.success) {
      return NextResponse.json(
        { error: "Unable to scrape page." },
        { status: 500 }
      );
    }

    console.log("[60%] Scrape complete.");

    const pageContent = (scrape.markdown || "").slice(0, 15000);

    console.log("[75%] Calling OpenAI...");

    const response = await openai.responses.create({
      model: "gpt-5.5",
      input: `
${PROMPT}

URL:
${url}

PAGE CONTENT:

${pageContent}
`,
    });

    console.log("[95%] Parsing response...");

    const result = JSON.parse(response.output_text);

    console.log(
      `[100%] Finished in ${(
        (Date.now() - start) /
        1000
      ).toFixed(2)} seconds`
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
      {
        status: 500,
      }
    );
  }
}
