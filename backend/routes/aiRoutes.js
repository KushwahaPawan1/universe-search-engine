const express = require("express");
const { getAIAnswer } = require("../controllers/aiController");

const router = express.Router();

// http://localhost:5000/api/ai
router.get("/", getAIAnswer);

module.exports = router;
