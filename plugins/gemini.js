const { cmd, commands } = require("../command");
const axios = require("axios");
const config = require("../config");

const GEMINI_API_KEY = config.GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

const newsletterContext = {
  mentionedJid: [],
  forwardingScore: 1000,
  isForwarded: true,
  forwardedNewsletterMessageInfo: {
    newsletterJid: "120363292876277898@newsletter",
    newsletterName: "𝐅𝐈𝐗𝐎 𝐗𝐌𝐃",
    serverMessageId: 143,
  },
};

cmd({
  pattern: "hansai",
  alias: ["ai"],
  react: "🤖",
  desc: "Ask anything to Google Gemini AI.",
  category: "ai",
  use: ".gemini <Your Question>",
  filename: __filename
}, async (
  _context, _message, _args, {
    from,
    quoted,
    q,
    pushname,
    sender,
    reply
  }) => {
  try {
    if (!q) return reply("❗️ Please provide a question.");

    const userQuery = `My name is ${pushname}. Your name is HANS BYTE. You are a WhatsApp AI Bot made by HANS TECH. Answer naturally with meaningful emojis. My question is: ${q}`;

    const requestBody = {
      contents: [{ parts: [{ text: userQuery }] }]
    };

    const response = await axios.post(GEMINI_API_URL, requestBody, {
      headers: { "Content-Type": "application/json" }
    });

    if (!response.data?.candidates?.[0]?.content?.parts) {
      return reply("❌ Error: No response from AI.");
    }

    newsletterContext.mentionedJid = [sender];
    const aiResponse = response.data.candidates[0].content.parts[0].text;
    await reply(aiResponse, { contextInfo: newsletterContext });
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    reply("❌ Error processing your question 😢");
  }
});

cmd({
  pattern: "gemini",
  alias: ["ai"],
  react: "🤖",
  desc: "Ask anything to Google Gemini AI.",
  category: "ai",
  use: ".gemini <Your Question>",
  filename: __filename
}, async (
  _context, _message, _args, {
    from,
    quoted,
    q,
    sender,
    reply
  }) => {
  try {
    if (!q) return reply("❗️ Please provide a question.");

    const requestBody = {
      contents: [{ parts: [{ text: q }] }]
    };

    const response = await axios.post(GEMINI_API_URL, requestBody, {
      headers: { "Content-Type": "application/json" }
    });

    if (!response.data?.candidates?.[0]?.content?.parts) {
      return reply("❌ Error: No response from AI.");
    }

    newsletterContext.mentionedJid = [sender];
    const aiResponse = response.data.candidates[0].content.parts[0].text;
    await reply(aiResponse, { contextInfo: newsletterContext });
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    reply("❌ Error processing your question 😢");
  }
});
