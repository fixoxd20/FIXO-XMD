const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { cmd } = require("../command");

cmd({
  pattern: "remini",
  desc: "Enhance image quality using AI.",
  category: "utility",
  react: "🪄",
  use: ".remini (reply to image or send URL)",
  filename: __filename
}, async (conn, mek, m, { from, quoted, reply, sender, args }) => {
  try {
    let imageUrl;

    if (args[0] && args[0].startsWith("http")) {
      // User provided a direct image URL
      imageUrl = args[0];
    } else {
      // User replied to an image
      const msg = quoted ? quoted : mek;
      const mime = (msg.msg || msg).mimetype || "";
      if (!mime.startsWith("image")) return reply("🖼 Please reply to an image or provide an image URL.");

      const buffer = await msg.download();
      const tempPath = path.join(os.tmpdir(), "remini_upload.jpg");
      fs.writeFileSync(tempPath, buffer);

      const form = new FormData();
      form.append("image", fs.createReadStream(tempPath));

      const upload = await axios.post("https://api.imgbb.com/1/upload?key=f342084918d24b0c0e18bd4bf8c8594e", form, {
        headers: form.getHeaders()
      });

      fs.unlinkSync(tempPath); // Cleanup

      if (!upload.data?.data?.url) throw "❌ Failed to upload image to imgbb.";
      imageUrl = upload.data.data.url;
    }

    // Enhance image with Remini API
    const response = await axios.get(`https://api.giftedtech.web.id/api/tools/remini?apikey=gifted&url=${encodeURIComponent(imageUrl)}`);
    const result = response.data;

    if (!result.success || !result.result?.image_url) throw "❌ Enhancement failed.";

    // Send enhanced image
    await conn.sendMessage(from, {
      image: { url: result.result.image_url },
      caption: `✨ *Enhanced Successfully!*`,
      contextInfo: {
        mentionedJid: [sender],
        forwardingScore: 1000,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363292876277898@newsletter",
          newsletterName: "𝐅𝐈𝐗𝐎 𝐗𝐌𝐃",
          serverMessageId: 144
        }
      }
    }, { quoted: mek });

  } catch (err) {
    console.error("Remini Error:", err);
    reply(`❌ Error: ${err.message || err}`);
  }
});
