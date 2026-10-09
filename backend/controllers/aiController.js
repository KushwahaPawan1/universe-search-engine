const axios = require("axios");

const GEMINI_KEYS = [
  process.env.GEMINI_KEY1,
  process.env.GEMINI_KEY2,
  process.env.GEMINI_KEY3,
  process.env.GEMINI_KEY4,
];

exports.getAIAnswer = async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: "Query is required" });

  for (let i = 0; i < GEMINI_KEYS.length; i++) {
    const api_key = GEMINI_KEYS[i];

    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${api_key}`,
        {
          contents: [
            {
              role: "user",
              parts: [{ text: q }]
            }
          ]
        }
      );

      const answer =
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No AI answer available";

      console.log(`✔ Working Key: GEMINI_KEY${i + 1}`);

      return res.json({
        ai: answer,
        usedKey: `GEMINI_KEY${i + 1}`,
      });

    } catch (err) {
      console.log(`❌ Key Failed GEMINI_KEY${i + 1}`, err.response?.data?.error?.message);
      // Continue loop to try next key
    }
  }

  return res.status(500).json({ error: "All API keys failed. No credits left." });
};
