# vershot — recordable concept demos

Self-contained HTML files that simulate product concepts well enough to
screen-record as demo videos. No build step, no dependencies, no real data.

| File | Concept | Story |
| ---- | ------- | ----- |
| `index.html` | vershot MVP | macOS float bar: capture → ask → cited answer → web library |
| `spec-to-slack.html` | vershot specs | spec question lands in Slack → mobile web app answers it → copy → paste back with the source |

`spec-to-slack.html` additionally bakes the two "looks professional" effects
into the page itself, so the recording needs zero post-production:

- **Cinematic zoom** — the whole desktop lives in a `#camera` div; a single
  CSS `scale()+translate()` transform with a slow ease pushes in and glides
  between the Slack window and the phone (the Screen Studio effect, for free).
- **Spotlight cursor** — the fake cursor carries a breathing ember halo and
  fires an expanding ring on every click, so the eye never loses it.

## Use

1. Open the demo file in Chrome (or any modern browser).
2. Press `F` for fullscreen. Start your screen recorder (`⌘⇧5` on macOS).
3. Press `A` — the whole ~60 s demo plays itself with captions burned in;
   the end card holds until you stop recording.

Other keys: `space` step beat-by-beat (stills / re-takes), `R` reset,
`H` help overlay.

## Headless recording (no Mac needed)

`record.mjs` drives the demo with Playwright and writes a 1920×1080 webm —
good for review cuts and CI; record the publishable master on a Retina Mac
per the production guide.

```bash
node record.mjs spec-to-slack.html out/   # → out/demo.webm
```

A recorded cut lives at [`media/spec-to-slack.webm`](media/spec-to-slack.webm)
(1080p, ~62 s, VP8 — plays in any modern browser).

Script, shot list and production guide: [docs/demo-video.md](../../../docs/demo-video.md).
MVP scope the first demo is built against: [docs/mvp.md](../../../docs/mvp.md).
