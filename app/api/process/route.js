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
Selling products or services.

2. social/ugc
Forums, communities, reviews, creators, user-generated content.

3. news/media
News organizations, journalism, editorial or magazine content.

4. other
Government, education, SaaS, corporate sites, documentation, nonprofits, portfolios, etc.

Return ONLY valid JSON.

{
  "category": "",
  "confidence": 0,
  "reason": "",
  "summary": ""
}

Rules:
- category must be exactly one category
- confidence must be an integer 0-100
- reason should be one sentence
- summary should be 2-3 paragraphs
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

    console.log(`Processing ${url}`);

    saveUrl(url);

    const scrape = await firecrawl.scrapeUrl(url, {
      formats: ["markdown"],
    });

    if (!scrape.success) {
      return NextResponse.json(
        { error: "Unable to scrape website." },
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
      `Finished in ${((Date.now() - start) / 1000).toFixed(2)} seconds`
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
