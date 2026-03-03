import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
puppeteer.use(StealthPlugin());

const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--disable-setuid-sandbox"] });
const page = await browser.newPage();
await page.setViewport({ width: 1920, height: 1080 });
await page.goto("https://prolinker.com/projects", { waitUntil: "networkidle2", timeout: 60000 });
await new Promise(r => setTimeout(r, 5000));

const text = await page.evaluate(() => document.body?.innerText?.slice(0, 1000));
console.log("BODY TEXT:", text);

const links = await page.evaluate(() => {
  return [...document.querySelectorAll("a")].filter(a => {
    const href = a.getAttribute("href") || "";
    return href.includes("project");
  }).slice(0, 5).map(a => ({ href: a.href, text: a.textContent?.trim().slice(0, 80) }));
});
console.log("PROJECT LINKS:", JSON.stringify(links, null, 2));

await browser.close();
