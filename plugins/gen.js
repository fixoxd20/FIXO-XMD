const { cmd } = require('../command');
const axios = require('axios');

// Define the FluxAI image generation command
cmd(
  {
    pattern: 'gen',
    alias: ['imagine'],
    react: '💧',
    desc: 'Generate AI images using FluxAI API.',
    category: 'ai',
    use: '.gen <Your Question>',
    filename: __filename,
  },
  async (bot, message, chatData, { reply, args }) => {
    try {
      // Get the user's prompt
      const prompt = args.join(' ');
      if (!prompt) {
        return reply('❗️ Please provide a prompt.');
      }

      // Construct the API request URL
      const apiUrl = `https://apis.davidcyriltech.my.id/flux?prompt=${encodeURIComponent(prompt)}`;

      // React with 🎨 to indicate processing
      await bot.sendMessage(chatData.key.remoteJid, {
        react: { text: '🎨', key: chatData.key },
      });

      // Fetch the AI-generated image
      const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });

      // Send the generated image
      await bot.sendMessage(chatData.key.remoteJid, {
        image: Buffer.from(response.data),
        caption: `🖼 Generated Image for: *${prompt}*\n\n> BY FIXO XMD`,
      });
    } catch (error) {
      console.error('Error:', error);
      reply('❌ Error generating image.');
    }
  }
);
