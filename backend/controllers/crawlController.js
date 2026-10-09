const crawlPage = require("../crawler");

// Native URL checker (no external package)
function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

exports.startCrawl = async (req, res) => {
  try {
    const { seedUrl, maxDepth = 2 } = req.body;

    // Validate URL
    if (!seedUrl)
      return res
        .status(400)
        .json({ status: "error", message: "Seed URL is required" });

    if (!isValidUrl(seedUrl))
      return res
        .status(400)
        .json({ status: "error", message: "Invalid URL format" });

    console.log("🚀 Background Crawling Started For:", seedUrl);

    // Run Crawler in Background
    setTimeout(() => {
      crawlPage(seedUrl, 1, maxDepth)
        .then(() => console.log("✅ Crawling Finished:", seedUrl))
        .catch((err) => console.error("❌ Crawler Failed:", err));
    }, 10);

    return res.json({
      status: "ok",
      message: `Crawling started for ${seedUrl}`,
      depth: maxDepth,
    });
  } catch (err) {
    console.error("❌ CrawlController Error:", err);
    return res.status(500).json({
      status: "error",
      message: "Server error while starting crawler",
    });
  }
};
