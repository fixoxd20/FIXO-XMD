const { cmd } = require('../command');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

cmd(
  {
    pattern: "obfuscate",
    alias: ["obfs", "obf"],
    react: "🔒",
    desc: "Obfuscate a JavaScript file.",
    category: "utility",
    filename: __filename,
  },
  async (robin, mek, m, { from, quoted, args, sender, reply }) => {
    try {
      let jsCode = "";
      
      if (quoted && quoted.text) {
        jsCode = quoted.text;
      } else if (args.length > 0) {
        jsCode = args.join(" ");
      } else {
        return reply("❌ Please provide JavaScript code to obfuscate, either by replying to a file or writing it inline.");
      }

      const apiUrl = `https://apis.davidcyriltech.my.id/obfuscate?code=${encodeURIComponent(jsCode)}&level=low`;
      
      const response = await axios.get(apiUrl);
      if (!response.data.success) {
        return reply("❌ Failed to obfuscate the code.");
      }

      const obfuscatedCode = response.data.result.obfuscated_code.code;
      const filePath = path.join(__dirname, '../media/obfuscated.js');
      fs.writeFileSync(filePath, obfuscatedCode, 'utf8');

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

      await robin.sendMessage(from, {
        document: fs.readFileSync(filePath),
        mimetype: 'text/javascript',
        fileName: 'obfuscated.js',
        contextInfo: newsletterContext,
      }, { quoted: mek });

      fs.unlinkSync(filePath); // Clean up after sending
    } catch (e) {
      console.error(e);
      reply(`❌ Error: ${e.message}`);
    }
  }
);