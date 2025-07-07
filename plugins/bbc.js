const axios = require('axios');
const { cmd } = require('../command');

cmd({
  pattern: 'bbcnews',
  alias: ['bbc'],
  desc: 'Get the latest BBC news.',
  react: '📰',
  use: '.bbcnews',
  category: 'News',
  filename: __filename
}, async (conn, mek, m, { from, sender, reply }) => {
  try {
    const res = await axios.get('https://suhas-bro-api.vercel.app/news/bbc');
    const newsData = res.data;

    if (!newsData || newsData.length === 0) {
      return reply("❌ No news available at the moment.");
    }

    const article = newsData[0]; // Get the first news article

    // Newsletter context info
    const _0x273817 = {
      'mentionedJid': [sender],
      'forwardingScore': 0x3e7,
      'isForwarded': true,
      'forwardedNewsletterMessageInfo': {
        'newsletterJid': '120363420828095666@newsletter',
        'newsletterName': "𝐅𝐈𝐗𝐎 𝐗𝐌𝐃",
        'serverMessageId': 0x8f
      }
    };

    let newsReply = `📰 *Latest BBC News*\n\n`;
    newsReply += `📅 *Date:* ${article.date}\n`;
    newsReply += `📝 *Title:* ${article.title}\n`;
    newsReply += `🗒️ *Summary:* ${article.summary}\n`;
    newsReply += `🔗 *Link:* ${article.link}\n\n`;
    newsReply += `*© POWERED BY FIXO XMD ✘*`;

    // Send with newsletter context but no actual redirect
    await conn.sendMessage(
      from,
      {
        text: newsReply,
        contextInfo: _0x273817
      },
      { quoted: mek }
    );

  } catch (error) {
    console.error("Error fetching news:", error.message);
    reply("❌ An error occurred while fetching the latest news.");
  }
});