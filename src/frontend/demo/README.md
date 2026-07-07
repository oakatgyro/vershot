# vershot — recordable concept demo

A single self-contained HTML file that simulates the vershot MVP (macOS float
bar: capture → ask → cited answer → web library) well enough to screen-record
as the demo video. No build step, no dependencies, no real data.

## Use

1. Open `index.html` in Chrome (or any modern browser).
2. Press `F` for fullscreen. Start your screen recorder (`⌘⇧5` on macOS).
3. Press `A` — the whole ~60 s demo plays itself with captions burned in;
   the end card holds until you stop recording.

Other keys: `space` step beat-by-beat (stills / re-takes), `R` reset,
`H` help overlay.

Script, shot list and production guide: [docs/demo-video.md](../../../docs/demo-video.md).
MVP scope this demo is built against: [docs/mvp.md](../../../docs/mvp.md).
