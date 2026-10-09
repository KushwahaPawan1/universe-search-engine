// crawler.js
const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const Page = require("./models/Page");

function cleanText(text) {
  return text.replace(/\s+/g, " ").trim().slice(0, 4000);
}

async function crawlPage(url, depth = 1, maxDepth = 2, visited = new Set()) {
  try {
    if (depth > maxDepth || visited.has(url)) return;
    visited.add(url);

    console.log(`🌐 [${depth}/${maxDepth}] Crawling → ${url}`);

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });

    // ✅ Compatible wait (works in all Puppeteer versions)
    await new Promise((r) => setTimeout(r, 3000));

    const html = await page.content();
    const $ = cheerio.load(html);

    const title = $("title").text() || "No Title";
    let content = $("body").text() || "";
    content = cleanText(content);

    console.log(`📄 Extracted Title: ${title}`);
    console.log(`📄 Content Length: ${content.length}`);

    await browser.close();

    if (!content || content.length < 50) {
      console.log(`⚠️ Not enough readable content found for: ${url}`);
      return;
    }

    console.log(`💾 Saving to MongoDB...`);

    const result = await Page.updateOne(
      { url },
      { url, title, content, crawledAt: new Date() },
      { upsert: true }
    );

    console.log(`✅ Mongo Save Result:`, result);

    // 🔗 Collect internal links (limit to 3)
    const links = [];
    $("a[href]").each((_, el) => {
      let link = $(el).attr("href");
      if (!link) return;
      if (link.startsWith("/")) link = new URL(link, url).href;
      if (link.startsWith("http") && !link.includes("#")) links.push(link);
    });

    const uniqueLinks = [...new Set(links)].slice(0, 3);
    console.log(`🔗 Found ${uniqueLinks.length} internal links.`);

    for (const link of uniqueLinks) {
      await crawlPage(link, depth + 1, maxDepth, visited);
    }
  } catch (err) {
    console.error(`❌ Error crawling ${url}:`, err.message);
  }
}

module.exports = crawlPage;
