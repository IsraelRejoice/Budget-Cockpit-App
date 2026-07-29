# Budget Cockpit

A personal finance tracker: pay-cycle budgeting, savings goals, debt payoff tracking, an optional AI assistant, and automatic cycle reports — running entirely on free infrastructure (GitHub Pages + Google Apps Script + Google Sheets).

**Live app:** https://israelrejoice.github.io/Budget-Cockpit-App/

---

## What it does

- **Pay-cycle budgeting** — set your income and payday (e.g. the 25th of every month, auto-shifted to the preceding Friday if it lands on a weekend). Category budgets, alert thresholds, and a live "safe to spend per day" figure.
- **Savings & Emergency Fund** tracked separately from spending — contributions aren't counted as expenses, and accumulate toward a goal across cycles.
- **Debt tracker** — log multiple creditors, choose an Avalanche/Snowball/Manual payoff strategy, log payments per debt.
- **Extra income** (bonuses, side hustle, gifts) folds into your available income in real time.
- **Reports** — text, PDF (with charts), and email, for the current cycle, any past archived cycle, or a full year-end review.
- **Optional AI assistant** — answers questions about your current cycle's numbers, via a floating chat widget.
- **Light/dark theme**, installable as a home-screen app (PWA), swipe-to-edit/delete on mobile.

---

## Architecture

```
┌─────────────────┐        HTTPS         ┌──────────────────────┐
│   index.html     │  ───────────────▶   │  Google Apps Script  │
│  (GitHub Pages)  │  ◀───────────────   │     (Code.gs)         │
└─────────────────┘        JSON          └──────────┬───────────┘
                                                       │
                                                       ▼
                                            ┌──────────────────────┐
                                            │   Google Sheet        │
                                            │  (your database)      │
                                            └──────────────────────┘
```

- **Frontend**: a single static HTML file (`index.html`), no build step, no framework. Hosted for free on GitHub Pages.
- **Backend**: a Google Apps Script Web App (`Code.gs`), deployed as a JSON API (`?action=getState`, `POST {action:'saveState', ...}`, etc.).
- **Database**: a Google Sheet with tabs — `Settings`, `Categories`, `Transactions`, `ExtraIncome`, `History`, `Debts`.
- **AI assistant** (optional): Apps Script calls Groq's API server-side — your AI provider key never touches the public frontend.

If `API_URL` in `index.html` is left blank, the app falls back to Claude's built-in preview storage (useful only when previewing inside Claude — not for real deployment).

---

## Repo structure

```
index.html          the whole app (HTML + CSS + JS in one file)
Code.gs              paste this into Apps Script (not part of the repo's static files —
                      it lives in your Google Sheet's script editor)
manifest.json        PWA manifest (installable "Add to Home Screen")
sw.js                service worker (caches the app shell for fast/offline loading)
icons/
  icon-192.png
  icon-512.png
```

---

## Setup from scratch

### 1. The Google Sheet + backend

1. Create a new Google Sheet.
2. Extensions → Apps Script. Delete the placeholder code, paste in `Code.gs`.
3. Near the top, set:
   - `SPREADSHEET_ID` — from your Sheet's URL: `docs.google.com/spreadsheets/d/THIS_PART/edit`
   - `API_TOKEN` (optional) — any secret string, or leave blank to disable the check
   - `GROQ_API_KEY` (optional) — from [console.groq.com/keys](https://console.groq.com/keys), free tier, for the AI assistant
4. Run `setupSheets` once from the function dropdown → Run. Authorize when prompted.
5. Deploy → New deployment → Web app → Execute as **Me**, Who has access **Anyone**. Copy the `.../exec` URL.
6. (For the AI assistant) Run a one-off function calling `UrlFetchApp.fetch(...)` once, to trigger the external-request permission prompt, then redeploy a new version.
7. (For automatic per-cycle email reports) Triggers (clock icon) → Add Trigger → function `checkAndRunAutoReport` → Time-driven → Day timer.

### 2. The frontend

1. In `index.html`, set:
   ```js
   const API_URL = 'https://script.google.com/macros/s/XXXX/exec';
   const API_TOKEN = ''; // must match Code.gs exactly, or leave both blank
   ```
2. Push `index.html`, `manifest.json`, `sw.js`, and the `icons/` folder to a GitHub repo, all in the same directory.
3. Repo Settings → Pages → set source to your main branch. Your site will be live at `https://<username>.github.io/<repo>/`.

---

## Making a change later

Every update needs **two** deploys, done in this order:

1. **Apps Script**: paste the updated `Code.gs` → Save → Deploy → Manage deployments → pencil icon → Version: **New version** → Deploy. (Creating a *new* deployment instead of a new *version* changes the URL and breaks the connection — always use "New version".)
2. **GitHub**: edit `index.html` (or whichever file changed) → commit directly to main. GitHub Pages redeploys automatically within a minute or two.

---

## Data model (what's in the Sheet)

| Sheet | Columns | Notes |
|---|---|---|
| `Settings` | `key`, `value` | income, payday, theme, email, debt strategy, etc. — one row per setting |
| `Categories` | `id`, `name`, `group`, `budget`, `threshold`, `goal` | `group` is Needs/Wants/Savings; `threshold` is the alert %; `goal` only applies to Savings |
| `Transactions` | `id`, `date`, `categoryId`, `desc`, `amount`, `method`, `debtId` | `debtId` set only for debt payments |
| `ExtraIncome` | `id`, `date`, `source`, `amount` | |
| `History` | `label`, `income`, `totalBudget`, `totalSpent`, `savingsContributed`, `archivedAt`, `detail` | `detail` is a JSON snapshot of that cycle's transactions, for past-cycle reports |
| `Debts` | `id`, `creditor`, `reason`, `amount`, `interestRate` | payments are transactions with a matching `debtId`, not stored here |

The schema is additive — new columns get defaults for old rows, so pulling a future version of this app won't break existing data. Re-run `setupSheets()` any time to create any newly-added sheet.

---

## Known limitations (by design, not oversights)

- **Single-tenant.** One deployment = one person's data. Sharing your live `index.html` link with someone else means they read/write *your* Sheet — for someone else to use this, they need their own Sheet + Apps Script deployment + their own `API_URL`/`API_TOKEN`.
- **`API_TOKEN` is not real security.** It's visible to anyone who views your page source. It deters casual/automated hits on your backend URL, nothing more.
- **No true background automation beyond the payday email trigger.** The app can't do anything while the tab/app is closed except that one scheduled Apps Script trigger.
- **Offline mode caches only the app shell**, not your data — logging expenses while offline won't save until you're back online.

---

## Credits / stack

Vanilla HTML/CSS/JS, [jsPDF](https://github.com/parallax/jsPDF) (lazy-loaded, for PDF export), [Quotable API](https://github.com/lukePeavey/quotable) (daily quote, with local fallback), [Groq](https://groq.com) (optional AI assistant), Google Apps Script + Sheets (backend/database), GitHub Pages (hosting).
