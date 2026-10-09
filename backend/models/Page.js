const mongoose = require("mongoose");

const pageSchema = new mongoose.Schema({
  url: { type: String, required: true, unique: true },
  title: String,
  content: String,
  crawledAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Page", pageSchema);
