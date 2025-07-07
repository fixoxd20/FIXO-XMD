const { cmd, commands } = require('../command');
const { Sticker, StickerTypes } = require('wa-sticker-formatter');
const { downloadMediaMessage } = require('../lib/msg.js');

// Import the configuration from config.js
const config = require('../config.js');

// Use the imported configuration values
const STICKER_PACKNAME = config.STICKER_PACKNAME;
const STICKER_AUTHOR = config.STICKER_AUTHOR;

cmd({
  pattern: 'sticker',
  alias: ['s', 'stick'],
  react: '🥱',
  desc: 'Convert an image to a sticker',
  category: 'utility',
  filename: __filename
}, async (bot, message, from, { quoted, body, isCmd, sender, reply }) => {
  try {
    if (!quoted || !(quoted.imageMessage || quoted.videoMessage)) {
      return reply('Please reply to an image or video to convert it to a sticker.');
    }
    const media = await downloadMediaMessage(quoted, 'image');
    if (!media) return reply('Failed to download the media. Try again!');
    
    const sticker = new Sticker(media, {
      pack: STICKER_PACKNAME,  // Use the imported config value for the pack name
      author: STICKER_AUTHOR,  // Use the imported config value for the author
      type: StickerTypes.FULL,
      quality: 50
    });
    
    const stickerBuffer = await sticker.toBuffer();
    await bot.sendMessage(from, { sticker: stickerBuffer }, { quoted: message });
  } catch (error) {
    console.error(error);
    reply('Error: ' + (error.message || error));
  }
});
