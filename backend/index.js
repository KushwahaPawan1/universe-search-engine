// require("dotenv").config();
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const axios = require("axios");
// const puppeteer = require("puppeteer");
// const Parser = require("rss-parser");
// const crawlPage = require("./crawler");
// const Page = require("./models/Page");

// const rssParser = new Parser();
// const app = express();
// const PORT = process.env.PORT || 5000;

// app.use(cors());
// app.use(express.json());

// /* ===========================================================
//    ✅ MongoDB Connection
// =========================================================== */
// mongoose
//   .connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("✅ MongoDB Connected"))
//   .catch((err) => console.log("❌ MongoDB Connection Error:", err.message));

// /* ===========================================================
//    Helper: send consistent API response
// =========================================================== */
// function ok(res, source, items = []) {
//   return res.json({ status: "ok", source, items });
// }
// function errRes(res, message = "Something went wrong") {
//   return res.status(500).json({ status: "error", message });
// }

// /* ===========================================================
//    🔍 SEARCH API — Local DB → Google APIs → Crawler
//    Response shape ALWAYS: { status, source, items: [...] }
// =========================================================== */
// app.get("/api/search", async (req, res) => {
//   try {
//     const query = (req.query.q || "").trim();
//     const type = (req.query.type || "all").toLowerCase();

//     if (!query) return res.status(400).json({ status: "error", message: "Query required" });

//     /* ===========================================================
//        1️⃣ IMAGES — Google Custom Search (return items array)
//     ============================================================ */
//     if (type === "images") {
//       const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(
//         query
//       )}&searchType=image&key=${process.env.GOOGLE_API_KEY}&cx=${process.env.GOOGLE_CX}`;

//       const { data } = await axios.get(url);
//       const items =
//         (data.items || []).map((img) => ({
//           title: img.title || "",
//           url: img.link || "",
//           thumbnail: img.image?.thumbnailLink || img.link || "",
//           contextLink: img.image?.contextLink || "",
//         })) || [];

//       return ok(res, "google_images", items);
//     }

//     /* ===========================================================
//        2️⃣ VIDEOS — YouTube Search API (return items array)
//     ============================================================ */
//     if (type === "videos") {
//       const ytUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(
//         query
//       )}&maxResults=12&key=${process.env.YOUTUBE_API_KEY}`;

//       const { data } = await axios.get(ytUrl);
//       const items =
//         (data.items || []).map((v) => ({
//           title: v.snippet?.title || "",
//           url: v.id?.videoId ? `https://www.youtube.com/watch?v=${v.id.videoId}` : "",
//           thumbnail: v.snippet?.thumbnails?.medium?.url || "",
//           channel: v.snippet?.channelTitle || "",
//         })) || [];

//       return ok(res, "youtube", items);
//     }

//     /* ===========================================================
//        3️⃣ NEWS — Google News RSS Parser (return items array)
//     ============================================================ */
//     if (type === "news") {
//       const newsUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(
//         query
//       )}&hl=en-IN&gl=IN&ceid=IN:en`;

//       const feed = await rssParser.parseURL(newsUrl);
//       const items = (feed.items || []).map((item) => ({
//         title: item.title || "",
//         url: item.link || "",
//         content: item.contentSnippet || item.content || "",
//         pubDate: item.pubDate || "",
//       }));

//       return ok(res, "news_rss", items);
//     }

//     /* ===========================================================
//        4️⃣ MAPS — Simple Google Maps Link (return items array)
//     ============================================================ */
//     if (type === "maps") {
//       const items = [
//         {
//           title: query,
//           url: `https://www.google.com/maps/search/${encodeURIComponent(query)}`,
//         },
//       ];
//       return ok(res, "maps_link", items);
//     }

//     /* ===========================================================
//        5️⃣ LOCAL DATABASE SEARCH
//     ============================================================ */
//     const localResults = await Page.find({
//       $or: [
//         { title: { $regex: query, $options: "i" } },
//         { content: { $regex: query, $options: "i" } },
//       ],
//     }).limit(20);

//     if (localResults.length > 0) {
//       // return DB results in same format
//       return ok(res, "database", localResults);
//     }

//     /* ===========================================================
//        6️⃣ GOOGLE WEB SEARCH API (fallback)
//     ============================================================ */
//     const googleUrl = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(
//       query
//     )}&key=${process.env.GOOGLE_API_KEY}&cx=${process.env.GOOGLE_CX}`;

//     const googleResponse = await axios.get(googleUrl);
//     const data = googleResponse.data || {};

//     const googleItems =
//       (data.items || []).map((item) => ({
//         title: item.title || "",
//         url: item.link || "",
//         content: item.snippet || "",
//         image: item.pagemap?.cse_image?.[0]?.src || null,
//         displayLink: item.displayLink || "",
//       })) || [];

//     return ok(res, "google_search", googleItems);
//   } catch (err) {
//     console.error("❌ Search Error:", err?.message || err);
//     return errRes(res, err?.message || "Search failed");
//   }
// });

// /* ===========================================================
//    🌐 Manual Crawl API
// =========================================================== */
// app.post("/api/start-crawl", (req, res) => {
//   const { seedUrl } = req.body;

//   if (!seedUrl) return res.status(400).json({ status: "error", message: "Seed URL required" });

//   crawlPage(seedUrl);
//   return res.json({ status: "ok", message: `Crawling started for ${seedUrl}` });
// });

// /* ===========================================================
//    🧠 FETCH PREVIEW API (Crawler Save)
//    returns: { status, html, title }
// =========================================================== */
// app.get("/api/fetch", async (req, res) => {
//   const { url } = req.query;

//   if (!url) return res.status(400).json({ status: "error", message: "URL required" });

//   try {
//     const browser = await puppeteer.launch({
//       headless: true,
//       args: ["--no-sandbox", "--disable-setuid-sandbox"],
//     });

//     const page = await browser.newPage();
//     await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });

//     const html = await page.content();
//     const title = await page.title();

//     const desc = await page.evaluate(() => {
//       const meta = document.querySelector("meta[name='description']");
//       return meta ? meta.content : document.body.innerText.slice(0, 300);
//     });

//     await browser.close();

//     const exists = await Page.findOne({ url });
//     if (!exists) {
//       await Page.create({
//         url,
//         title,
//         content: desc,
//         crawledAt: new Date(),
//       });
//     } else {
//       // update crawledAt/title/content (optional)
//       await Page.updateOne({ url }, { title, content: desc, crawledAt: new Date() });
//     }

//     return res.json({ status: "ok", html, title });
//   } catch (err) {
//     console.error("❌ Fetch error:", err?.message || err);
//     return res.status(500).json({ status: "error", html: "<p>Error fetching content</p>", title: "Error" });
//   }
// });

// app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));


















require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const searchRoutes = require("./routes/searchRoutes");
const crawlRoutes = require("./routes/crawlRoutes");
const fetchRoutes = require("./routes/fetchRoutes");
const aiRoutes = require("./routes/aiRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// MongoDB


const uri = process.env.MONGO_URI;

if (!uri) {
  console.error("❌ MONGO_URI is not defined in environment variables!");
  process.exit(1); // Stop the server if URI not set
}

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err.message));


// Routes
app.use("/api/search", searchRoutes);
app.use("/api/start-crawl", crawlRoutes);
app.use("/api/fetch", fetchRoutes);
app.use("/api/ai", aiRoutes);

// Start Server
app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
