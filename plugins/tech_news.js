const { cmd } = require('../command');
const axios = require('axios');

// Helper: delay
function delay(ms) {
  console.log(`⏱️ Delay for ${ms}ms`);
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Tech News Command
cmd({
  pattern: "technews",
  desc: "Get the latest tech news from the API",
  category: "tools",
  react: "📰",
  filename: __filename
}, async (conn, mek, m, { reply, sender }) => {
  try {
    // Fetch tech news from the API
    const response = await axios.get("https://fantox001-scrappy-api.vercel.app/technews/random");

    // Check if the API returns the data successfully
    if (response.data.status === "Scraping is successful!") {
      const { news, thumbnail } = response.data;

      // Construct the message text
      const newsMessage = `📢 *Tech News* 📰\n\n*${news}*\n\n🔗 _Source:_ FantoX001 API`;

      // Send the news message with the image in the same message
      await conn.sendMessage(m.chat, {
        image: { url: thumbnail },  // Use the thumbnail image from the API
        caption: `${newsMessage}\n\nHere is the image related to the tech news!`,  // Send text and image together
        contextInfo: {
          forwardingScore: 1000,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363420828095666@newsletter',
            newsletterName: "𝐅𝐈𝐗𝐎 𝐗𝐌𝐃",
            serverMessageId: 143,
          },
        }
      });
    } else {
      reply("❌ Could not fetch tech news. Please try again later.");
    }
  } catch (err) {
    console.error("❌ Error fetching tech news:", err);
    reply("❌ An error occurred while fetching the tech news.");
  }
});
