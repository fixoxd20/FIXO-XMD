const { cmd } = require('../command');
const { downloadMediaMessage } = require('../lib/msg.js');
const config = require ('../config')
cmd({
  pattern: 'vv',
  alias: ['viewonce'],
  react: '↩️',
  desc: 'Gets an image/video from viewonce files',
  category: 'utility',
  filename: __filename
}, async (robin, mek, m, { from, quoted, reply, sender }) => {
  try {
    // Validate inputs
    if (!quoted) {
      return reply('❌ Please reply to a message containing media');
    }

    if (!quoted.imageMessage && !quoted.videoMessage) {
      return reply('❌ Only image and video replies are supported');
    }

    // Download media
    const media = await downloadMediaMessage(quoted, 'buffer');
    if (!media) {
      return reply('❌ Failed to download the media. Please try again!');
    }

    // Newsletter context configuration
    const newsletterContext = {
      mentionedJid: [sender],
      forwardingScore: 1000,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: config.NEWSLETTER_JID || '120363292876277898@newsletter',
        newsletterName: config.NEWSLETTER_NAME || "𝐇𝐀𝐍𝐒 𝐁𝐘𝐓𝐄 𝐌𝐃",
        serverMessageId: Math.floor(Math.random() * 1000),
      }
    };

    // Determine media type and resend with newsletter context
    const mediaType = quoted.imageMessage ? 'image' : 'video';
    await robin.sendMessage(
      from,
      {
        [mediaType]: media,
        mimetype: quoted.mimetype,
        contextInfo: newsletterContext
      },
      { quoted: mek }
    );

    // Add reaction to confirm success
    await robin.sendMessage(from, { react: { text: '✅', key: mek.key } });

  } catch (error) {
    console.error('Media resend error:', error);
    reply(`❌ Error: ${error.message}`);
    
    // Send error to owner if configured
    if (config.ERROR_CHAT) {
      await robin.sendMessage(
        config.ERROR_CHAT, 
        { text: `Error in vv command:\nFrom: ${from}\nError: ${error.stack}` }
      );
    }
  }
});