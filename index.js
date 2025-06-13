const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ OpenAI client (v4 syntax)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4", // You can change to "gpt-3.5-turbo" if needed
      messages: [
        {
          role: "system",
          content: `
          You are an assistant for a company that helps Tunisian students find study opportunities abroad.
          You respond based on how the user talks (English, French, or Tunisian Arabic).
          You help with questions about universities in France, Germany, Canada, and Turkey.
          Be clear, helpful, and friendly. If you don't know something, ask the user to contact the team.
          `,
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    // ✅ Correct way to extract reply in SDK v4
    res.json({ reply: response.choices[0].message.content });
  } catch (err) {
    console.error("OpenAI error:", err);
    res.status(500).json({ error: "Something went wrong." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
