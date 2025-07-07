const { cmd } = require('../command'); // Ensure the path is correct
const fetch = require('node-fetch');
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const os = require("os");
const path = require("path");


cmd({
  pattern: "readqr",
  desc: "Read QR code from an image.",
  category: "utility",
  react: "🔍",
  use: ".readqr (reply to QR image or provide URL)",
  filename: __filename
}, async (conn, mek, m, { from, quoted, reply, args, sender }) => {
  try {
    let imageUrl;

    if (args[0] && args[0].startsWith("http")) {
      // Direct image URL
      imageUrl = args[0];
    } else {
      // Replied image
      const msg = quoted ? quoted : mek;
      const mime = (msg.msg || msg).mimetype || "";
      if (!mime.startsWith("image")) return reply("📷 Please reply to a QR code image or provide an image URL.");

      const buffer = await msg.download();
      const tempPath = path.join(os.tmpdir(), "qr_scan.jpg");
      fs.writeFileSync(tempPath, buffer);

      const form = new FormData();
      form.append("image", fs.createReadStream(tempPath));

      const upload = await axios.post("https://api.imgbb.com/1/upload?key=f342084918d24b0c0e18bd4bf8c8594e", form, {
        headers: form.getHeaders()
      });

      fs.unlinkSync(tempPath);

      if (!upload.data?.data?.url) throw "❌ Failed to upload image.";
      imageUrl = upload.data.data.url;
    }

    // Read QR using API
    const api = `https://api.giftedtech.web.id/api/tools/readqr?apikey=gifted&url=${encodeURIComponent(imageUrl)}`;
    const result = await axios.get(api);

    if (!result.data?.success || !result.data?.result?.qrcode_data) throw "❌ Failed to read QR code.";

    await conn.sendMessage(from, {
      text: `✅ *QR Code Content:*\n\n🧾 ${result.data.result.qrcode_data}`,
      contextInfo: {
        mentionedJid: [sender],
        forwardingScore: 1000,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363420828095666@newsletter",
          newsletterName: "𝐅𝐈𝐗𝐎 𝐗𝐌𝐃",
          serverMessageId: 145
        }
      }
    }, { quoted: mek });

  } catch (err) {
    console.error("ReadQR Error:", err);
    reply(`❌ Error: ${err.message || err}`);
  }
});

cmd({
    pattern: "qr",
    alias: ["qrcode"],
    react: "📲",
    desc: "Generate a QR code from text",
    category: "tools",
    use: '.qr <text>',
    filename: __filename
},
async (conn, mek, m, { from, reply, q, sender }) => {
    if (!q || !q.trim()) {
        return await reply("Please provide text to generate a QR code!");
    }
    
    try {
        const apiUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(q)}&size=500x500`;

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
        
        await conn.sendMessage(from, { 
            image: { url: apiUrl }, 
            caption: `✅ QR Code Generated for: ${q}`, 
            contextInfo: newsletterContext 
        }, { quoted: mek });
        
    } catch (error) {
        console.error(error);
        reply('❌ Error generating QR code. Try again later.');
    }
});
