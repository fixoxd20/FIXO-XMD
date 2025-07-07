const { cmd, commands } = require('../command');
const axios = require('axios');

cmd(
  {
    pattern: "metaai",
    alias: ["meta", "ai4"],
    react: "🤖",
    desc: "Get AI responses from Meta AI API.",
    category: "ai",
    filename: __filename,
  },
  async (
    robin,
    mek,
    m,
    { from, quoted, body, isCmd, command, args, q, isGroup, sender, reply }
  ) => {
    try {
      // Default message if no input
      q = q || "Hi";

      // Newsletter context info
      const newsletterContext = {
        mentionedJid: [sender],
        forwardingScore: 1000,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363292876277898@newsletter',
          newsletterName: "𝐅𝐈𝐗𝐎 𝐗𝐌𝐃",
          serverMessageId: 143,
        },
      };

      // API URL for Meta AI
      let apiUrl = `https://apis.davidcyriltech.my.id/ai/metaai?text=${encodeURIComponent(q)}`;

      // Fetch AI response from Meta AI API
      let { data } = await axios.get(apiUrl);

      if (!data || !data.response) {
        return reply("❌ Meta AI response error! Please try again.");
      }

      // Send Meta AI response with newsletter context
      await robin.sendMessage(
        from,
        { 
          text: `🤖 **Meta AI:**\n\n${data.response}`,
          contextInfo: newsletterContext,
        },
        { quoted: mek }
      );

    } catch (e) {
      console.error(e);
      reply(`❌ Error: ${e.message}`);
    }
  }
);
