const axios = require("axios");
const Parser = require("rss-parser");
const Page = require("../models/Page");

const rssParser = new Parser();

/* ------------------ MULTIPLE GOOGLE API KEYS ------------------ */
const googleKeys = [
  process.env.GOOGLE_API_KEY,
  process.env.GOOGLE_API_KEY1,
  process.env.GOOGLE_API_KEY2,
  process.env.GOOGLE_API_KEY3,
].filter(Boolean);

let keyIndex = 0;

// Get next key
function getKey() {
  const key = googleKeys[keyIndex];
  keyIndex = (keyIndex + 1) % googleKeys.length;
  return key;
}

/* ------------------ RESPONSE HELPERS ------------------ */
function ok(res, source, items = []) {
  return res.json({ status: "ok", source, items });
}
function errRes(res, message = "Something went wrong") {
  return res.status(500).json({ status: "error", message });
}

/* =============================================================== */

exports.search = async (req, res) => {
  try {
    const query = (req.query.q || "").trim();
    const type = (req.query.type || "all").toLowerCase();

    if (!query)
      return res.status(400).json({ status: "error", message: "Query required" });

    /* ========== 1️⃣ IMAGES SEARCH ========== */
    if (type === "images") {
      let apiKey = getKey();

      const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(
        query
      )}&searchType=image&key=${apiKey}&cx=${process.env.GOOGLE_CX}`;

      try {
        const { data } = await axios.get(url);

        const items =
          (data.items || []).map((img) => ({
            title: img.title || "",
            url: img.link || "",
            thumbnail: img.image?.thumbnailLink || "",
            contextLink: img.image?.contextLink || "",
          })) || [];

        return ok(res, "google_images", items);
      } catch (err) {
        if (err.response?.status === 429) {
          apiKey = getKey(); // switch to next key
          console.log("⚠️ Image key exhausted, switching...");

          const retryUrl = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(
            query
          )}&searchType=image&key=${apiKey}&cx=${process.env.GOOGLE_CX}`;

          const retry = await axios.get(retryUrl);

          const items =
            (retry.data.items || []).map((img) => ({
              title: img.title || "",
              url: img.link || "",
              thumbnail: img.image?.thumbnailLink || "",
              contextLink: img.image?.contextLink || "",
            })) || [];

          return ok(res, "google_images_retry", items);
        }
        throw err;
      }
    }

    /* ========== 2️⃣ YOUTUBE VIDEOS ========== */
    if (type === "videos") {
      const ytUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(
        query
      )}&maxResults=12&key=${process.env.YOUTUBE_API_KEY}`;

      const { data } = await axios.get(ytUrl);

      const items =
        (data.items || []).map((v) => ({
          title: v.snippet?.title,
          url: `https://www.youtube.com/watch?v=${v.id.videoId}`,
          thumbnail: v.snippet?.thumbnails?.medium?.url,
          channel: v.snippet?.channelTitle,
        })) || [];

      return ok(res, "youtube", items);
    }

    /* ========== 3️⃣ NEWS (RSS) ========== */
    if (type === "news") {
      const newsUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(
        query
      )}&hl=en-IN&gl=IN&ceid=IN:en`;

      const feed = await rssParser.parseURL(newsUrl);

      const items = (feed.items || []).map((item) => ({
        title: item.title,
        url: item.link,
        content: item.contentSnippet,
        pubDate: item.pubDate,
      }));

      return ok(res, "news_rss", items);
    }

    /* ========== 4️⃣ MAPS ========== */
    if (type === "maps") {
      return ok(res, "maps_link", [
        {
          title: query,
          url: `https://www.google.com/maps/search/${encodeURIComponent(query)}`,
        },
      ]);
    }

    /* ========== 5️⃣ LOCAL DATABASE SEARCH ========== */
    const localResults = await Page.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } },
      ],
    }).limit(20);

    if (localResults.length > 0) {
      return ok(res, "database", localResults);
    }

    /* ========== 6️⃣ GOOGLE SEARCH (MAIN) ========== */

    let apiKey = getKey();

    let googleUrl = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(
      query
    )}&key=${apiKey}&cx=${process.env.GOOGLE_CX}`;

    try {
      const google = await axios.get(googleUrl);
      const data = google.data;

      const items =
        (data.items || []).map((item) => ({
          title: item.title,
          url: item.link,
          content: item.snippet,
          image: item.pagemap?.cse_image?.[0]?.src || null,
        })) || [];

      return ok(res, "google_search", items);
    } catch (err) {
      if (err.response?.status === 429) {
        apiKey = getKey();
        console.log("⚠️ Search key exhausted, switching...");

        const retryUrl = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(
          query
        )}&key=${apiKey}&cx=${process.env.GOOGLE_CX}`;

        const retry = await axios.get(retryUrl);
        const data = retry.data;

        const items =
          (data.items || []).map((item) => ({
            title: item.title,
            url: item.link,
            content: item.snippet,
            image: item.pagemap?.cse_image?.[0]?.src || null,
          })) || [];

        return ok(res, "google_search_retry", items);
      }
      throw err;
    }
  } catch (err) {
    console.log("❌ Search Error:", err.message);
    return errRes(res, err.message);
  }
};
