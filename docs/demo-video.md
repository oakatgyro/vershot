# vershot — Demo Video Plan

Status: proposal. Companion docs: [mvp.md](mvp.md) (what the video must prove),
[unknown-unknowns.md](unknown-unknowns.md) (method for the blindspot pass below).

## Strategy: record the prototype, not the product

The video does not require the app to exist. `src/frontend/demo/index.html` is
a self-contained, pixel-styled simulation of the whole demo — fake macOS
desktop, float bar, capture, voice ask, answer with citation, web library, end
card. It **autoplays the entire script on one keypress**, so the recording is
a single continuous take and the editing step almost disappears. That is the
cost-saver: no design tools, no motion-graphics software, no timeline editing
skills required.

- Open the file in Chrome, press `F` (fullscreen), start recording, press `A`.
- ~60 seconds later the end card appears and holds indefinitely; let it sit a
  few seconds, stop recording, trim head/tail.

## Format

- **Length:** 60–70 s master. Cut a 30 s version later from the same take
  (beats 2–3 + end card) for social.
- **Frame:** 16:9, 1920×1080 minimum (record on a Retina display for 2× crisp
  UI). 60 fps if your recorder allows — UI motion at 30 fps looks cheap.
- **Sound:** design for **muted autoplay**. The prototype burns captions into
  every beat, so the video works silently. Voiceover and music are optional
  polish, added later without re-recording the screen.

## Script / storyboard

Beat timings match the prototype's autoplay timeline.

| Beat | Time | On screen (prototype scene) | Caption (burned in) |
| ---- | ---- | --------------------------- | ------------------- |
| 1 Hook | 0–6 s | Title card: logo, wordmark | "You read everything. You retrieve nothing." |
| 2 Capture | 6–18 s | Board deck on screen → `⌥ Space` keycaps → bar drops in → drag-select the churn chart → flash → "Saved" toast | "Capture anything — without leaving your work." |
| 3 Ask | 18–38 s | Later, writing an investor email → `⌥ Space` → mic waveform, live transcript "what did churn look like in Q3?" → answer streams in → citation card shows the exact capture | "Ask out loud. Answers come with the receipt." |
| 4 Web | 38–49 s | Browser: vershot.app library grid + same chat thread | "Your whole library — on the web too." |
| 5 End | 49 s → hold | End card: logo, tagline, URL (holds until you stop recording) | "vershot — ask your screen anything. vershot.app" |

Narrative rule: **one story, one number.** The chart captured in beat 2 is the
answer cited in beat 3 and visible in the library in beat 4. Nothing else is
introduced.

## Production guide (zero-budget path)

1. **Prepare the machine:** Do Not Disturb on, notifications off, hide the
   real menu bar (fullscreen handles it), plug in power (thermal throttling
   causes dropped frames).
2. **Record:** macOS built-in `⌘⇧5` → "Record Entire Screen" is enough. If
   you can spend ~$20+, [Screen Studio](https://screen.studio) adds automatic
   smooth zooms and cursor easing — the single biggest "looks professional"
   lever for a non-editor.
3. **Trim:** QuickTime (`⌘T`) to cut head/tail. That can be the whole edit.
4. **Optional voiceover:** read the caption column into Voice Memos in a
   closet (soft clothes = free acoustic treatment); align in iMovie/CapCut
   (both free). Record VO *after* picture-lock, never during the screen take.
5. **Optional music:** one quiet track, −20 dB under VO. Free/safe sources:
   YouTube Audio Library, Pixabay Music. Avoid anything with vocals.
6. **Export:** H.264, 1080p (or 4K if recorded Retina), high bitrate
   (~16 Mbps for 1080p60). Upload the master to YouTube (unlisted) and embed
   on the landing page; upload natively per platform for social.

## Acceptance checklist

- [ ] Watches correctly with sound OFF (captions carry the story)
- [ ] The hook lands inside the first 3 seconds
- [ ] The same artifact (churn chart) appears in beats 2, 3 and 4
- [ ] No real personal data on screen (the prototype is fully synthetic)
- [ ] Text is legible on a phone at 30 % size
- [ ] End card holds ≥ 4 s with the URL

## Second take — `spec-to-slack.html` (vershot specs concept)

Same strategy, different story: `src/frontend/demo/spec-to-slack.html` is a
recordable simulation of the **spec assistant** concept. One keypress (`A`)
plays the whole ~60 s take; `src/frontend/demo/record.mjs` can record it
headlessly with Playwright when no Mac is at hand.

| Beat | Time | On screen (prototype scene) | Caption (burned in) |
| ---- | ---- | --------------------------- | ------------------- |
| 1 Hook | 0–5 s | Title card: logo, "vershot specs" | "Your spec knows the answer. Nobody can find it." |
| 2 Question | 5–15 s | Slack-style app, #customer-eng: Mara asks for SAML SSO + API rate limit, camera pushes in | "4:52 PM. Sales needs the exact spec — in five minutes." |
| 3 Ask | 15–33 s | Camera glides to a phone (mobile web app): type the question → loading → answer streams with **600 req/min** + source chip | "Ask the spec — in plain English." / "The spec answers — with the source." |
| 4 Copy | 33–38 s | Zoom onto the answer card, spotlight cursor clicks **Copy answer** → "✓ Copied" | "One tap — copy the answer." |
| 5 Paste | 38–54 s | Camera glides to the Slack composer, `⌘V`, message posts with "answered with vershot specs" chip, Mara reacts 🙌, pull back to wide | "Paste it where the question lives — receipt included." |
| 6 End | 54 s → hold | End card: logo, tagline, URL | "vershot specs — ask the spec. Ship the answer. vershot.app" |

Narrative rule again: **one story, one number** — `600 requests/min` appears
in the phone answer and in the pasted Slack message; nothing else is introduced.

### Zoom & cursor emphasis — unknown-unknown, resolved

"How do I zoom into the Mac app, and make the cursor captivating?" has two
answers; the second take uses the first one:

1. **Bake it into the prototype (used here, $0).** The entire fake desktop
   sits inside a `#camera` div; one CSS transform
   (`scale(s) translate(960-x, 540-y)` with a slow `cubic-bezier` ease)
   pushes in on any stage point, and clamping the centre keeps the frame
   from ever showing past the desktop edge. The cursor is a DOM element with
   a breathing radial-gradient halo and an expanding ring animation on every
   click. Because zoom and cursor are part of the page, the screen recording
   needs **no post-production at all**, and every take is pixel-identical.
2. **Do it to a real recording (for live-product footage later).**
   - [Screen Studio](https://screen.studio) (~$20+) — automatic smooth zooms
     toward clicks and cursor easing/enlargement; the single biggest
     "looks professional" lever for a non-editor.
   - macOS built-ins: Accessibility → Zoom (`⌃`+scroll, enable "smooth
     images") for live push-ins; Accessibility → Display → Pointer size +
     "Shake mouse pointer to locate" for a bigger, findable cursor.
   - Free post path: any editor (iMovie/CapCut) can keyframe scale+position
     on the clip — same effect, more labour, do it after picture-lock.

## Blindspot pass — surfaced unknowns (design & video)

These are the design/video unknown-unknowns this exercise converted into
known knowns:

- **Most viewers watch muted.** Feeds autoplay silently; a VO-dependent video
  dies there. Hence burned-in captions as the primary narration channel.
- **Aspect ratio is per-platform, not per-video.** 16:9 master, but X/LinkedIn
  feeds favor 1:1 and Reels/Shorts need 9:16. Keeping the float bar center-frame
  in the prototype makes center-crops possible later.
- **Retina scaling:** recording a 1× display makes UI text look soft when the
  platform re-encodes. Record 2× (Retina) and downscale on export.
- **Frame rate mismatch:** 30 fps recording of 60 fps animation produces
  visible stutter on smooth movement (the bar's spring-in). Record 60 fps.
- **The cursor is a character.** A default-speed human cursor wanders and
  distracts; the prototype animates its own cursor for the capture drag, so
  the recorded take needs no live mouse movement at all.
- **Color shift on export:** QuickTime/H.264 color-profile conversion can wash
  out the dark UI. Check the export on a second device before publishing.
- **Notifications ruin takes** (and can leak personal data into a public
  video). DND is a pre-flight item, not an editing fix.
- **File-size ceilings:** some platforms re-compress aggressively above
  certain bitrates; a too-hot master looks worse after their transcode than a
  clean 16 Mbps one.
- **Demo honesty:** the video shows a simulation. For investor/user
  conversations, say "concept demo" when asked; never claim recorded footage
  is the shipped product.
