const axios = require("axios");
const { cmd } = require("../command");

cmd({
  pattern: "lyrics",
  react: "🎵",
  desc: "Search song lyrics",
  category: "music",
  filename: __filename
}, 
async (conn, mek, m, { from, args }) => {
  try {
    if (!args.length) {
      return await conn.sendMessage(from, {
        text: "📌 Usage: *!lyrics [song name]*\nExample: !lyrics Another Love",
      }, { quoted: mek });
    }

    const query = args.join(" ");
    const apiUrl = `https://api.giftedtech.web.id/api/search/lyrics?apikey=gifted&query=${encodeURIComponent(query)}`;
    const { data } = await axios.get(apiUrl);

    if (!data.success || !data.result) {
      return await conn.sendMessage(from, {
        text: `❌ No lyrics found for "${query}".`
      }, { quoted: mek });
    }

    const { title, artist, lyrics, image, link } = data.result;
    const messageText = `🎵 *${title}* by *${artist}*\n\n${lyrics}\n\n🔗 ${link}`;

    const message = {
      image: { url: image },
      caption: messageText,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        mentionedJid: [m.sender],
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363420828095666@newsletter',
          newsletterName: "𝐅𝐈𝐗𝐎 𝐗𝐌𝐃",
          serverMessageId: 144
        }
      }
    };

    await conn.sendMessage(from, message, { quoted: mek });

  } catch (error) {
    console.error("❌ Lyrics command error:", error.message);
    await conn.sendMessage(from, {
      text: `❌ Error fetching lyrics: ${error.message}`
    }, { quoted: mek });
  }
});
