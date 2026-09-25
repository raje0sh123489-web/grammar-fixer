# PromptFixer 🪄

> Personal AI writing & prompt-fixing assistant. Turn messy English, unorganized thoughts, and raw prompts into clear, natural prose while **preserving your original meaning and tone**.

---

## 🎯 Features

- **Tone-Preserving Rewrites**: If you write casually ("bro", "hey team", colloquial phrasing), PromptFixer keeps it natural and friendly. No stiff, corporate jargon.
- **Intent & Technical Fidelity**: Technical commands, code keywords, library names, and core requests are never altered.
- **Zero Hallucination or Bloat**: Only fixes grammar, awkward sentence structures, and readability. Does not fabricate extra instructions.
- **Automatic Server-Side Fallback**: 
  - Primary: **Google Gemini** (`gemini-3.8-flash`)
  - Secondary / High-Limit Fallback: **Groq** (`llama-3.3-70b-versatile`)
  - **100% Transparent**: The fallback happens silently on the server. The user never sees error messages, provider switches, or leaking credentials.
- **Clean Developer-Tool UI**: Fast keyboard shortcuts (`⌘/Ctrl + Enter`), one-click copy, live word/character counters, side-by-side comparison mode, and recent history.
- **Vercel & Next.js Ready**: Full server-side API routes compatible with Vercel Serverless and Next.js App Router.

---

## 🏗️ Project Structure

```text
promptfixer/
│
├── app/
│   ├── api/
│   │   └── fix/
│   │       └── route.ts          # Next.js App Router serverless endpoint
│   │
│   ├── components/
│   │   ├── Header.tsx            # Header & branding badge
│   │   ├── PromptInput.tsx       # Textarea, word counts, quick starters
│   │   └── ResultBox.tsx         # Result display, copy, diff compare
│   │
│   ├── globals.css               # Tailwind CSS styles
│   ├── layout.tsx                # Next.js root layout & metadata
│   └── page.tsx                  # Next.js client interactive view
│
├── lib/
│   ├── gemini.ts                 # Google Gemini SDK implementation
│   ├── groq.ts                   # Groq Llama 3.3 implementation
│   ├── fixPrompt.ts              # Fallback orchestrator (Gemini → Groq)
│   └── prompts.ts                # Dedicated system prompt constitution
│
├── types/
│   └── index.ts                  # Shared TypeScript interfaces
│
├── src/                          # Vite/React entry points for dev preview
│   ├── components/               # Synced React components
│   ├── App.tsx                   # Main app interface
│   ├── main.tsx                  # React DOM mount
│   └── index.css                 # Base Tailwind styles
│
├── api/
│   └── fix.ts                    # Vercel serverless function (Vite/Node)
│
├── server.ts                     # Full-stack Express server with Vite middleware
├── .env.example                  # Environment variable reference
├── .gitignore                    # Standard Git exclusions
├── next.config.ts                # Next.js configuration
├── package.json                  # Dependencies & scripts
├── tsconfig.json                 # TypeScript compiler options
└── README.md                     # Documentation & setup guide
```

---

## ⚡ How the Fallback Works

The server-side orchestrator in `lib/fixPrompt.ts` executes the following transparent pipeline:

```text
       User Submits Raw Prompt
                 │
                 ▼
      POST /api/fix (Server-side)
                 │
                 ▼
        ┌─────────────────┐
        │  Try Gemini     │  (gemini-3.8-flash)
        └────────┬────────┘
                 │
        ┌────────┴────────┐
     Success?          Fails / Rate Limit / Error
        │                         │
        ▼                         ▼
   Return Gemini          ┌─────────────────┐
     Response             │  Try Groq       │  (llama-3.3-70b-versatile)
                          └────────┬────────┘
                                   │
                          ┌────────┴────────┐
                       Success?           Fails
                          │                 │
                          ▼                 ▼
                     Return Groq      Return Clean User-
                      Response        Friendly Error Message
```

- **Transparent to User**: The frontend receives `{ success: true, improvedPrompt: "..." }`. It never learns which engine served the output.
- **Fail-Safe**: If Gemini experiences transient network latency, quotas, or downtime, Groq serves the response in milliseconds.
- **Security**: All API keys remain strictly in server environment variables (`GEMINI_API_KEY` and `GROQ_API_KEY`). No secrets are leaked to the client bundle.

---

## ⚙️ Environment Variables

Create a `.env.local` (for Next.js) or `.env` file in the root:

```env
# Gemini API Key (Required for primary AI provider)
# Get your key at: https://aistudio.google.com/
GEMINI_API_KEY="your-gemini-api-key"

# Groq API Key (Required for automatic server-side fallback)
# Get your key at: https://console.groq.com/keys
GROQ_API_KEY="your-groq-api-key"
```

---

## 🚀 Local Development

### 1. Clone & Install

```bash
# Clone repository
git clone https://github.com/your-username/promptfixer.git
cd promptfixer

# Install dependencies
npm install
```

### 2. Configure Keys

```bash
cp .env.example .env.local
# Open .env.local and add your GEMINI_API_KEY and GROQ_API_KEY
```

### 3. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 🚢 Deploy Directly to Vercel

### Method 1: Using the Vercel Dashboard (Recommended)

1. **Push your code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "feat: initial PromptFixer with Gemini + Groq fallback"
   git branch -M main
   git remote add origin https://github.com/your-username/promptfixer.git
   git push -u origin main
   ```

2. **Import into Vercel**:
   - Go to [vercel.com](https://vercel.com/) and sign in.
   - Click **Add New...** → **Project**.
   - Select your `promptfixer` repository.

3. **Configure Environment Variables**:
   Under **Environment Variables**, add:
   - `GEMINI_API_KEY` = your Gemini API key
   - `GROQ_API_KEY` = your Groq API key

4. **Framework Preset & Settings**:
   - `vercel.json` is already included to configure the Vite build and `/api/fix` serverless function.
   - If importing an existing project that previously guessed Next.js, go to **Settings > General > Framework Preset** and choose **Vite** (Output Directory: `dist`).

5. **Deploy**:
   - Click **Deploy**. Vercel will build into `dist` and provision the serverless API function in seconds!

### Method 2: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add production environment variables
vercel env add GEMINI_API_KEY
vercel env add GROQ_API_KEY

# Deploy to production
vercel --prod
```

---

## 💡 Example Rewrites

| Input | Output |
| :--- | :--- |
| *bro with gemini we can use groq because it has higher limit for free usage so implement it and push the code to github* | **Bro, we can use Groq along with Gemini because Groq has a higher free usage limit. Let's implement both and push the code to GitHub.** |
| *hey team auth token expired again in prod and customer getting logout randomly please check refresh logic asap* | **Hey team, auth tokens are expiring again in production, causing customers to get logged out randomly. Please check the token refresh logic ASAP.** |
| *need python script that ping server every 5 min if response not 200 send alert email to admin* | **I need a Python script that pings the server every 5 minutes. If the response status isn't 200, send an alert email to the admin.** |

---

## 📄 License

MIT License. Feel free to use and adapt for your personal workflows!
