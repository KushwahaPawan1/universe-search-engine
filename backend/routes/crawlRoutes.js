const express = require("express");
const router = express.Router();
const { startCrawl } = require("../controllers/crawlController");

// http://localhost:5000/api/crawl
router.post("/", startCrawl);

module.exports = router;
