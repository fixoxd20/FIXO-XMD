const { cmd } = require("../command");
const axios = require("axios");

cmd(
  {
    pattern: "gpt",
    alias: ["chatgpt", "ai"],
    react: "🤖",
    desc: "Chat with AI using GPT-4 API",
    category: "ai",
    use: ".gpt <your message>",
    filename: __filename
  },
  async (conn, mek, msg, { reply, args }) => {
    try {
      const userMessage = args.join(" ");
      if (!userMessage) {
        return reply("❗ Please provide a message to chat with AI.");
      }

      const apiUrl = `https://suhas-bro-apii.vercel.app/Gpt-4?q=${encodeURIComponent(userMessage)}`;

      // Show typing indicator
      await conn.sendPresenceUpdate('composing', msg.key.remoteJid);

      // API request to fetch AI response
      const response = await axios.get(apiUrl);
      console.log("API Response:", response.data);

      // Check and format the response
      if (response.data && response.data.response) {
        const aiResponse = `*${response.data.title || 'AI Response'}*\n` +
                          `💡 ${response.data.response}\n\n` +
                          `_Powered by *FIXO XMD*_`;
        
        await reply(aiResponse);
      } else {
        return reply("❌ Unexpected API response format. Please try again later.");
      }

    } catch (error) {
      console.error("Error:", error);
      reply("❌ Error fetching AI response. The service might be temporarily unavailable.");
    } finally {
      // Stop typing indicator
      await conn.sendPresenceUpdate('paused', msg.key.remoteJid);
    }
  }
);