const { cmd, commands } = require('../command');
const config = require('../config');
const axios = require('axios');
const path = require('path');

cmd(
  {
    pattern: "hentai",
    react: "🤦‍♂️",
    desc: "Get a hentai video link and make the user feel uncomfortable about it.",
    category: "media",
    filename: __filename,
  },
  async (
    robin,
    mek,
    m,
    { from, quoted, body, isCmd, command, args, q, isGroup, sender, reply }
  ) => {
    try {
      // Fetch the video link using the API
      const response = await axios.get('https://apis.davidcyriltech.my.id/hentai');
      
      if (response.data.success) {
        const video = response.data.video;

        // Message to make the user feel uncomfortable about watching the content
        const uncomfortableMessage = `
          You really want to watch this? 🤨
          It's not really the kind of thing you should be spending time on. 
          Please reconsider your choices. 😔
          
          Video Title: ${video.title}
          Category: ${video.category}
          Views: ${video.views_count}

          Here's the link (if you must): ${video.link}
        `;

        // Newsletter context info
        const newsletterContext = {
          mentionedJid: [sender],
          forwardingScore: 1000,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363420828095666@newsletter',
            newsletterName: "𝐅𝐈𝐗𝐎 𝐗𝐌𝐃",
            serverMessageId: 143,
          },
        };

        // Send an "alive" image with the uncomfortable message and newsletter context
        await robin.sendMessage(
          from,
          {
            image: { url: config.ALIVE_IMG },
            caption: uncomfortableMessage,
            contextInfo: newsletterContext,
          },
          { quoted: mek }
        );

      } else {
        reply('❌ Error: Could not retrieve the video data.');
      }
    } catch (e) {
      console.error(e);
      reply(`❌ Error: ${e.message}`);
    }
  }
);
