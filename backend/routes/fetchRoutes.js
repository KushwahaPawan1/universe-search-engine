const express = require("express");
const router = express.Router();
const { fetchPreview } = require("../controllers/fetchController");

router.get("/", fetchPreview);

module.exports = router;
