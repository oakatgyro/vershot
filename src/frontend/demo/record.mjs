// Headless recording rig for the concept demos.
//
//   node record.mjs [demo.html] [out-dir]
//
// Loads the demo, presses `A` (autoplay), waits for `window.__demoDone`,
// lets the end card hold a few seconds, and writes a 1920x1080 webm into
// out-dir. Uses the globally installed playwright + the pre-provisioned
// Chromium (PLAYWRIGHT_BROWSERS_PATH), so there is nothing to npm-install.
//
// This is the zero-hardware path — good for review cuts and CI. For the
// publishable master, record on a Retina Mac at 60 fps per docs/demo-video.md.
import { createRequire } from 'module';
import { execSync } from 'child_process';
import { resolve, join } from 'path';
import { renameSync } from 'fs';

const require = createRequire(execSync('npm root -g').toString().trim() + '/');
const { chromium } = require('playwright');

const file = resolve(process.argv[2] ?? 'spec-to-slack.html');
const outdir = resolve(process.argv[3] ?? 'out');

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1920, height: 1080 },
  recordVideo: { dir: outdir, size: { width: 1920, height: 1080 } },
});
const page = await context.newPage();
await page.goto('file://' + file);
await page.waitForTimeout(1000);       // settle fonts/first paint
await page.keyboard.press('a');        // autoplay the whole take
await page.waitForFunction('window.__demoDone', null, { timeout: 180_000 });
await page.waitForTimeout(4500);       // let the end card hold
const video = page.video();
await context.close();                 // flushes the recording
await browser.close();

const path = await video.path();
const named = join(outdir, 'demo.webm');
renameSync(path, named);
console.log('recorded:', named);
