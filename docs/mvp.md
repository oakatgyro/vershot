# vershot — MVP Definition

Status: proposal (pre-implementation). Companion docs:
[demo-video.md](demo-video.md) for the demo video plan,
[unknown-unknowns.md](unknown-unknowns.md) for the surfacing method used in the
blindspot pass at the bottom.

## One-liner

> **vershot** is a float bar you summon with a shortcut, on macOS and the web.
> It captures what's on your screen into a personal knowledge base, and answers
> your questions from it — with the original capture as the receipt.

The name reads as **ver(ified) shot / ver(sion) + shot**: every answer is
backed by a shot of the moment you learned it.

## Who it's for (demo persona)

A founder / knowledge worker who "reads everything and retrieves nothing":
board decks, dashboards, Slack threads, PDFs. Their knowledge is scattered
across screenshots, tabs, and notes. When they need one number in the middle of
writing an email, they lose ten minutes hunting for it.

## "What it can" — the five demo-able claims

The MVP is scoped backwards from the demo. Everything in the MVP maps to one
of these on-screen moments; anything that doesn't is cut.

| # | Claim | On-screen proof |
| - | ----- | --------------- |
| 1 | Summon it anywhere, instantly | Press `⌥ Space` over any app → float bar drops in, current app stays untouched (non-activating panel) |
| 2 | Capture without leaving your work | Drag a region → it's saved, OCR'd, and embedded. One toast, zero windows |
| 3 | Ask in plain language (type or talk) | Speak "what did churn look like in Q3?" → live transcript in the bar |
| 4 | Answers come with receipts | Streamed answer + citation card showing the exact capture and its source/time |
| 5 | Same brain on the web | vershot.app shows the full library and the same Q&A anywhere |

## MVP scope

### In

- **macOS float bar** (menu-bar app, no Dock icon)
  - Global shortcut (default `⌥ Space`, remappable — see blindspot pass)
  - Non-activating floating panel over the current app; `Esc` dismisses
  - Two modes in one bar: *capture* (region screenshot) and *ask* (text input,
    push-to-talk via Apple's on-device speech recognition)
- **Capture pipeline**: region screenshot → OCR (Apple Vision framework,
  on-device, free) → frontmost-app + window-title metadata → embed → store
- **Ask pipeline**: question → embedding search over captures/notes → LLM
  answer constrained to retrieved context → cite the capture(s) used
- **Web app** (`vershot.app`): login, library grid of captures, same chat.
  Read/ask first; organizing features can wait
- **Single LLM provider, single user, simple email auth**

### Out (explicitly, for v0)

- Teams, sharing, permissions
- Windows/Linux/mobile
- Integrations (Slack, Notion, browser extension)
- Automatic/ambient capture (privacy + scope trap — capture is always explicit)
- Editing, tagging, folders (search *is* the organization at MVP)
- Offline LLM / local inference
- Fine-grained billing; a waitlist is the only "growth" surface

### Thin architecture sketch (matches this repo's layout)

- `src/macos` (new): Swift/AppKit menu-bar app — `NSPanel`
  (`.nonactivatingPanel`), `ScreenCaptureKit` for capture, `Speech` for
  push-to-talk, Vision for OCR. Talks only to the backend API
- `src/backend`: FastAPI (uv project already scaffolded) — auth, capture
  ingest, embeddings, retrieval, answer streaming (SSE). SQLite + `sqlite-vec`
  is enough for MVP; Postgres/pgvector when multi-user matters
- `src/frontend/lp`: landing page → waitlist + the demo video
- `src/frontend/web` (new, post-demo): Next.js app for library + chat

### Build order (by volatility, per docs/unknown-unknowns.md)

Most-likely-to-change first, so unknowns surface while cheap:

1. **Demo prototype + video** (this task — zero product code at risk)
2. Float bar interaction model (panel, shortcut, focus behavior) — the UX
   riskiest part; prototype natively before wiring any backend
3. Retrieval quality spike: 30 real captures of your own, measure whether
   OCR+embeddings actually answer your questions — this decides the product
4. Capture pipeline, then backend API, then web app, then auth/waitlist

## Why demo-first is the right MVP

Building all of the above before knowing whether the *story* lands is the
expensive path. The demo video only requires a **prototype that looks and
moves like the product** — see `src/frontend/demo/` — recorded in one take.
It validates the pitch ("what it can") with investors/users for roughly a
day of work instead of months.

## Blindspot pass — surfaced unknowns (product & design)

Known unknowns this exercise surfaced; each would otherwise have bitten
mid-implementation:

- **`⌥ Space` is contested.** Raycast, Alfred, ChatGPT desktop and input-method
  switchers all fight over it. The shortcut must be remappable on day one, and
  onboarding must detect conflicts.
- **Non-activating panels are special.** A normal window steals focus and
  ruins claim #1. This needs `NSPanel` + `.nonactivatingPanel` +
  `canBecomeKeyWindow` overrides — an AppKit corner Tauri/Electron handle
  poorly; this constraint drives the "native Swift shell" choice.
- **Screen-recording permission UX.** First capture triggers macOS's scary
  permission dialog and requires an app restart. The demo can ignore it; the
  product's first-run flow cannot.
- **OCR is the ceiling.** If a capture's text isn't extracted, no LLM can cite
  it. Retrieval quality spike (build-order #3) exists to test this before
  anything else is built.
- **"Ask anything" over-promises.** The MVP answers only from *your captures*.
  Copy and demo must frame it as "ask your screen", not a general assistant,
  or every empty-knowledge-base answer feels broken.
- **Empty state is the real first impression.** A new user has zero captures;
  the bar must teach capture before ask (demo hides this; onboarding can't).
- **App Store sandbox vs. `ScreenCaptureKit` + global shortcuts** — decide
  early whether v0 ships notarized-direct-download (recommended) instead.
