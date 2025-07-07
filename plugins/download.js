const { cmd } = require("../command");
const axios = require("axios");
const fs = require("fs");

cmd(
  {
    pattern: "download",
    react: "📥",
    desc: "Download an anime episode",
    category: "anime",
    filename: __filename,
  },
  async (robin, mek, m, { from, q, reply, sender }) => {
    try {
      if (!q) return reply("*📢 Provide an episode link to download!*");

      let baseUrl = "https://animeheaven.me/";
      let fullUrl = baseUrl + q; // Convert to full URL

      reply("⏳ Fetching video URL, please wait...");

      // Newsletter context info
      const _0x273817 = {
        'mentionedJid': [sender],
        'forwardingScore': 0x3e7,
        'isForwarded': true,
        'forwardedNewsletterMessageInfo': {
          'newsletterJid': '120363292876277898@newsletter',
          'newsletterName': "𝐅𝐈𝐗𝐎 𝐗𝐌𝐃",
          'serverMessageId': 0x8f
        }
      };

      // **STEP 1: GET TRUE VIDEO URL**
      let response = await axios.get(fullUrl, { maxRedirects: 5 });

      // Extract direct video URL
      let videoMatch = response.data.match(/https:\/\/.*?\/video\.mp4\?[^"]+/);
      if (!videoMatch) return reply("❌ Failed to get video URL!");

      let videoUrl = videoMatch[0];
      let fileName = `anime_${Date.now()}.mp4`;

      reply("⏳ Downloading episode, please wait...");

      // **STEP 2: DOWNLOAD VIDEO**
      const videoResponse = await axios({
        url: videoUrl,
        method: "GET",
        responseType: "stream",
      });

      const writer = fs.createWriteStream(fileName);
      videoResponse.data.pipe(writer);

      writer.on("finish", async () => {
        await robin.sendMessage(
          from,
          {
            video: fs.readFileSync(fileName),
            caption: "🎬 Here is your episode! \n\n⚡ Powered by 𝐅𝐈𝐗𝐎 𝐗𝐌𝐃",
            contextInfo: _0x273817
          },
          { quoted: mek }
        );

        fs.unlinkSync(fileName); // Delete after sending
      });

      writer.on("error", (err) => {
        console.error(err);
        reply("❌ Error downloading the file!");
      });
    } catch (e) {
      console.error(e);
      reply(`❌ Error: ${e.message}`);
    }
  }
);