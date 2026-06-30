# Website Classifier

An AI-powered web application built with **Next.js**, **Firecrawl**, and **OpenAI** that analyzes a website from a single URL and classifies it into one of four categories:

* **ecommerce**
* **social/ugc**
* **news/media**
* **other**

The application scrapes the webpage using Firecrawl, extracts the readable content, submits it to the OpenAI API for analysis, and returns a structured response including a category, confidence score, reasoning, and summary.

---

# Features

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

* Next.js (App Router)
* React
* JavaScript

## Backend

* Next.js API Routes
* OpenAI API
* Firecrawl API

## Storage

Current implementation:

* Local JSON file (`urls.json`)

Possible production storage:

* PostgreSQL
* SQLite
* MySQL

---

# Project Structure

```text
website-classifier/
│
├── app/
│   ├── api/
│   │   └── process/
│   │       └── route.js
│   ├── globals.css
│   ├── layout.js
│   └── page.js
│
├── components/
│   ├── CategoryBadge.jsx
│   ├── LoadingProgress.jsx
│   ├── ResultCard.jsx
│   └── UrlForm.jsx
│
├── lib/
│   ├── classifier.js
│   ├── firecrawl.js
│   ├── openai.js
│   ├── saveUrl.js
│   └── validators.js
│
├── data/
│   └── urls.json
│
├── public/
│
├── utils/
│
├── docs/
│
├── package.json
├── README.md
└── .env.local
```

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
npm install
```

---

# Environment Variables

Create a file named:

```text
.env.local
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

# OpenAI Prompt

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
* Firecrawl
* OpenAI API

---

# Contact

For questions, feature requests, or bug reports, please open an issue in the project's GitHub repository.

# Note
All contents for this project are in a small set of files.  For future buildout, subfolders should be used as necessary

All future state folders contain a dummy bmp file that should be replaced as necessary
