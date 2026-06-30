# Website Classifier

An AI-powered web application built with **Next.js**, **Firecrawl**, and **OpenAI** that analyzes a website from a single URL and classifies it into one of four categories:

* **ecommerce**
* **social/ugc**
* **news/media**
* **other**

The application scrapes the webpage using Firecrawl, extracts the readable content, submits it to the OpenAI API for analysis, and returns a structured response including a category, confidence score, reasoning, and summary.

---

# Features including input submission

* Single URL submission interface
* Website scraping using Firecrawl
* AI-powered website classification
* AI-generated website summary
* Confidence score for classification
* Human-readable explanation of the classification
* URL history logging
* Modular Next.js App Router architecture
* Environment variable configuration
* Production-ready project organization
* Error handling and validation

---

# Classification Categories

Every website is classified into one and only one of the following categories.

## Ecommerce

Websites whose primary purpose is selling products or services.

Examples:

* Online stores
* Marketplaces
* Booking websites
* Subscription services
* Retail brands

Examples include:

* Amazon
* Shopify stores
* Etsy
* Best Buy

---

## Social / UGC

Websites primarily driven by user-generated content or community interaction.

Examples:

* Discussion forums
* Social networks
* Video sharing platforms
* Review sites
* Community websites

Examples include:

* Reddit
* YouTube
* TikTok
* Discord
* Stack Overflow

---

## News / Media

Websites primarily focused on publishing editorial content.

Examples:

* Newspapers
* Blogs
* Online magazines
* Technology news
* Press organizations

Examples include:

* CNN
* BBC
* TechCrunch
* Reuters

---

## Other

Any website that does not primarily fit one of the previous categories.

Examples:

* Government websites
* Educational institutions
* Corporate homepages
* SaaS products
* Documentation
* Personal portfolios
* Nonprofits

---

# Technology Stack

## Frontend

Frontend relies on React for processing

* Next.js (App Router)
* React
* JavaScript

## Backend

Backend APIs leverage OpenAI for categorization and summary while Firecrawl scrapes the URL for submissions

* Next.js API Routes
* OpenAI API
* Firecrawl API

## Storage

Current implementation:

* Local JSON file (`urls.json`)

Possible production storage (future state):

* PostgreSQL
* SQLite
* MySQL

---

# Project Structure

```text
website-classifier/
│ Root Folder 
├── package.json
├── README.md
├──.gitignore
│
├── components/
│   ├── New Bitmap image.bmp
│
├── lib/
│   ├── New Bitmap image.bmp
│
├── data/
│   └── New Bitmap image.bmp
│
├── public/
│   └── New Bitmap image.bmp
│
├── utils/
│   └── New Bitmap image.bmp
│
├── docs/
│   └── New Bitmap image.bmp


```
**Root folder would be converted to /app in the future state**
---

# Installation

Clone the repository.

```bash
git clone https://github.com/yourusername/website-classifier.git
```

Move into the project directory.

```bash
cd website-classifier
```

Install dependencies.

```bash
npm install express openai dotenv
```
**If there are issues with running standard npm install, install the specific dependencies
---

# Environment Variables

Create a file named:

```text
.gitignore
```

Add the following variables.

```text
OPENAI_API_KEY=your_openai_api_key
FIRECRAWL_API_KEY=your_firecrawl_api_key
```

---

# Running the Project

Start the development server.

```bash
npm run dev
```

Open your browser.

```text
http://localhost:3000
```

---

# Application Workflow

1. User enters a URL.
2. URL is validated.
3. URL is saved to local storage.
4. Firecrawl scrapes the webpage.
5. Readable Markdown is extracted.
6. Content is truncated if necessary.
7. Content is submitted to the OpenAI API.
8. OpenAI classifies the website.
9. Results are displayed to the user.

---

# API Endpoint

## POST `/api/process`

### Request

```json
{
  "url": "https://example.com"
}
```

### Response

```json
{
  "url": "https://example.com",
  "title": "Example Website",
  "description": "Website description",
  "category": "news/media",
  "confidence": 96,
  "reason": "The website primarily publishes editorial content.",
  "summary": "This website publishes technology news...",
  "processedAt": "2026-06-30T18:20:00Z"
}
```

---

# OpenAI Prompt and outputs from submission

The application instructs the model to return only valid JSON containing:

* category
* confidence
* reason
* summary

Allowed categories are strictly limited to:

* ecommerce
* social/ugc
* news/media
* other

---

# Firecrawl

Firecrawl is responsible for:

* Downloading webpages
* Extracting readable Markdown
* Removing navigation noise
* Returning metadata
* Preparing content for AI analysis

---

# Logging

Every processed URL is stored locally - this could be upodated to be stored in any DB.

Example:

```json
[
  {
    "url": "https://example.com",
    "processed": "2026-06-30T15:00:00Z"
  }
]
```

---

# Error Handling

The application handles:

* Invalid URLs
* Missing API keys
* Firecrawl failures
* OpenAI failures
* Invalid AI JSON responses
* Network errors
* Empty page content
* Submission state errors

---
# Security

Do not commit your `.env.local` file.

Always:

* Validate user input.
* Protect API keys.
* Sanitize responses.
* Apply rate limiting in production.
* Use HTTPS in production.
* Restrict API usage as appropriate.

---

# Development

Useful commands:

```bash
npm install
npm run dev
npm run build
npm run start
```

# Contributing

Contributions are welcome.

Recommended workflow:

1. Fork the repository.
2. Create a feature branch.
3. Make changes.
4. Run tests.
5. Submit a pull request.

Please include clear descriptions of changes and follow the project's coding style.

---

# Acknowledgements

This project uses:

* Next.js
* React
* Firecrawl API
* OpenAI API
* Environment Variables stored in the .gitignore file (dummy keys for now)

---

# Contact

For questions, feature requests, or bug reports, please open an issue in the project's GitHub repository.

# Notes and Architecture Comments
All contents for this project are in a small set of files.  For future buildout, subfolders should be used as necessary

All future state folders contain a dummy bmp file that should be replaced as necessary

**Architecture design and thought process**


Next.js (App Router)

**Next.js was chosen as the core framework because it provides both:**

* A frontend (React UI)
* Backend API routes (serverless functions)


Why this matters

**Instead of maintaining two separate projects (frontend + backend), Next.js allows:**

* Single codebase for full-stack development
* Built-in routing for UI and APIs
* Easy deployment (especially on Vercel)
* Server-side execution for secure API key usage

**The App Router (main folder) was used instead of the Pages Router because:**

* It is the modern Next.js standard
* It supports better data fetching patterns
* It aligns with server-first architecture
* OpenAI API

**The OpenAI API is responsible for:**

* Website classification
* Summarization
* Reasoning about page content
* Why OpenAI was chosen
* Strong natural language understanding
* Reliable structured JSON output when prompted correctly
* Ability to classify unstructured web content
* Handles ambiguity (important for real-world websites)
* Why structured JSON output is enforced

**Instead of free-form text, the model is forced to return JSON because:**

* It ensures predictable frontend rendering
* It reduces parsing errors
* It makes results database-ready
* It enables analytics and filtering later
* Firecrawl API

**Firecrawl is used to:**

* Scrape web pages
* Extract readable content
* Convert HTML into clean Markdown
* Remove navigation noise and ads
* Why Firecrawl instead of raw scraping

**Traditional scraping (e.g., cheerio, puppeteer) was avoided because:**

* It requires manual HTML parsing logic
* Many websites are heavily JavaScript-rendered
* Boilerplate code becomes complex quickly
* Maintenance overhead is high

**Firecrawl solves this by:**

* Handling dynamic websites automatically
* Returning clean, structured Markdown
* Providing metadata (title, description)
* Reducing engineering complexity significantly

**This allows the app to focus on AI reasoning instead of scraping logic.**

* URL Classification Model Design

**The classification system is intentionally limited to four categories:**

* ecommerce
* social/ugc
* news/media
* other

**Why only four categories**

This constraint was added because:

* It improves model accuracy
* It reduces classification ambiguity
* It makes UI/UX simpler
* It enables downstream analytics (grouping, filtering, dashboards)

**A smaller label space leads to higher consistency and fewer edge-case errors.**

* URL Storage (JSON File)

**Initially, URLs are stored in a local urls.json file.**

Why this approach was used
* Zero setup required
* Works without external infrastructure
* Ideal for development and prototyping
* Easy to inspect/debug manually
* Why it is not production-ready

**This approach does NOT scale because:**

* No concurrency control
* No query capabilities
* No indexing
* Risk of file corruption under load

**In production, this should be would be better replaced with long term storage along with a better file structure:**

* PostgreSQL (preferred)
* SQLite (lightweight alternative)
* Prisma ORM (for structured access)
* Next.js API Routes (/app/api/process)

**The API route handles:**

* Receiving user input (URL)
* Validating input
* Calling Firecrawl
* Calling OpenAI
* Returning structured JSON
* Why API routes are used
* Keeps API keys server-side (secure)
* Avoids CORS issues
* Simplifies deployment
* Eliminates need for a separate backend server

**This follows a serverless architecture model, which is ideal for this type of application.**

* Client-Side React Form

**The frontend uses a simple controlled form with:**

* URL input
* Submit button
* Loading state
* Result rendering

**Why this approach**

* Minimal UI complexity
* Easy state management using useState
* Fast user feedback loop
* No external state libraries required

**Loading states are handled client-side because:**

* API calls are asynchronous
* Firecrawl + OpenAI requests can take several seconds
* User experience improves significantly with feedback
* Progress & Loading Design (Conceptual)

Although the current implementation uses a single loading state:

* Step-based progress updates
* Streaming responses (SSE or WebSockets in future)

**Why this matters**

The pipeline has multiple stages:

* URL validation
* Firecrawl scraping
* Content extraction
* OpenAI classification
* Response formatting

**Each step can fail or take time, so future versions can expose:**

* Real-time progress bars
* Live status updates
* Streaming AI responses

**Why This Architecture Works Well**

**This stack was intentionally chosen because it separates concerns clearly:**

* Layer	Responsibility
* UI (Next.js page)	User interaction
* API Route	Orchestration logic
* Firecrawl	Web scraping
* OpenAI	Intelligence + reasoning
* JSON file	Temporary storage

**This makes the system:**

* Easy to understand
* Easy to extend
* Easy to replace components
* Suitable for production scaling
* There could also be a **Private** subfolder if needed
