const { cmd } = require("../command");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const os = require("os");
const path = require("path");

cmd({
  pattern: "rmbg",
  alias: ["removebg", "bgless"],
  react: "🎨",
  desc: "Remove background from an image",
  category: "utility",
  use: ".rmbg",
  filename: __filename,
}, async (conn, mek, m, { from, reply, q, sender }) => {
  try {
    const quotedMsg = mek.quoted ? mek.quoted : mek;
    const mimeType = (quotedMsg.msg || quotedMsg).mimetype || "";

    if (!mimeType || !mimeType.startsWith("image")) {
      return await reply("🌻 Please reply to an image.");
    }

    // Download the image
    const imageBuffer = await quotedMsg.download();
    const tempImagePath = path.join(os.tmpdir(), "temp_image");
    fs.writeFileSync(tempImagePath, imageBuffer);

    // Upload to imgbb to get a temporary URL
    const form = new FormData();
    form.append("image", fs.createReadStream(tempImagePath));
    const imgbbResponse = await axios.post("https://api.imgbb.com/1/upload?key=f342084918d24b0c0e18bd4bf8c8594e", form, {
      headers: { ...form.getHeaders() },
    });

    if (!imgbbResponse.data || !imgbbResponse.data.data || !imgbbResponse.data.data.url) {
      throw "❌ Failed to upload the file.";
    }

    const imageUrl = imgbbResponse.data.data.url;
    
    // Remove background using the API
    const removeBgUrl = `https://apis.davidcyriltech.my.id/removebg?url=${encodeURIComponent(imageUrl)}`;
    
    // Send backgroundless image to user
    const newsletterContext = {
      mentionedJid: [sender],
      forwardingScore: 1000,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: "120363420828095666@newsletter",
        newsletterName: "𝐅𝐈𝐗𝐎 𝐗𝐌𝐃",
        serverMessageId: 143,
      },
    };
    
    await conn.sendMessage(from, {
      image: { url: removeBgUrl },
      caption: "*Background Removed Successfully 🎨*",
      contextInfo: newsletterContext,
    }, { quoted: mek });
    
    // Clean up temporary file
    fs.unlinkSync(tempImagePath);
  } catch (error) {
    console.error(error);
    reply("An error occurred while processing your request. Please try again later.");
  }
});