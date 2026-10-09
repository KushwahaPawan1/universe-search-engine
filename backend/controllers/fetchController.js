const puppeteer = require("puppeteer");
const Page = require("../models/Page");

exports.fetchPreview = async (req, res) => {
  const { url } = req.query;

  if (!url)
    return res.status(400).json({ status: "error", message: "URL required" });

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded" });

    const html = await page.content();
    const title = await page.title();

    const desc = await page.evaluate(() => {
      const meta = document.querySelector("meta[name='description']");
      return meta ? meta.content : document.body.innerText.slice(0, 300);
    });

    await browser.close();

    const exists = await Page.findOne({ url });

    if (!exists) {
      await Page.create({
        url,
        title,
        content: desc,
        crawledAt: new Date(),
      });
    } else {
      await Page.updateOne({ url }, { title, content: desc, crawledAt: new Date() });
    }

    return res.json({ status: "ok", html, title });
  } catch (err) {
    console.log("❌ Fetch Error:", err.message);
    return res.status(500).json({
      status: "error",
      html: "<p>Error fetching content</p>",
      title: "Error",
    });
  }
};
