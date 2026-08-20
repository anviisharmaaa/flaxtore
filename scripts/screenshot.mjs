import { chromium } from "playwright";
import fs from "node:fs";

const url = process.argv[2] ?? "http://localhost:3000/";
const outDir = process.argv[3] ?? "/tmp/shots";
fs.mkdirSync(outDir, { recursive: true });

const viewports = [
  { name: "mobile-390", width: 390, height: 844 },
  { name: "tablet-820", width: 820, height: 1180 },
  { name: "desktop-1440", width: 1440, height: 900 },
];

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });

for (const vp of viewports) {
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
  const errors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("pageerror", (err) => errors.push(String(err)));
  await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
  await page.waitForTimeout(300);

  // Scroll through the full page in steps so whileInView (IntersectionObserver)
  // reveal animations actually fire before the full-page screenshot is taken.
  const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
  const step = 350;
  for (let y = 0; y < scrollHeight; y += step) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(220);
  }
  await page.waitForTimeout(200);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
  const slug = url.replace(/https?:\/\/[^/]+/, "").replace(/\W+/g, "_") || "home";
  const filePath = `${outDir}/${slug || "home"}-${vp.name}.png`;
  await page.screenshot({ path: filePath, fullPage: true });
  console.log(`Saved ${filePath}`);
  if (errors.length) {
    console.log(`Console errors on ${vp.name}:`, errors);
  }
  await page.close();
}

await browser.close();
