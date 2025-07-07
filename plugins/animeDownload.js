const { cmd } = require("../command");
const { dl } = require('darksadasyt-anime');  // Import the anime download function

cmd(
  {
    pattern: "animeDownload",
    alias: "andl",
    react: "🎥",
    desc: "Get Direct Download Link for Anime Episode",
    category: "download",
    filename: __filename,
  },
  async (
    robin,
    mek,
    m,
    { from, quoted, body, isCmd, command, args, q, isGroup, sender, reply }
  ) => {
    try {
      if (!q) return reply("❌ Please provide a valid anime episode URL.");

      // Fetch the download link details using the provided episode URL
      const results = await dl(q);

      // Check if results contain the direct download link
      const directLink = results[2];  // This is the direct download URL

      if (!directLink) {
        return reply("❌ Could not find a direct download link.");
      }

      // Send the direct download link to the user
      await robin.sendMessage(
        from,
        { text: `🎬 Here's the direct download link for the episode: ${directLink}` },
        { quoted: mek }
      );

      reply("🎥 The direct download link is ready. Enjoy your anime!");
    } catch (e) {
      console.error(e);
      reply(`❌ Error: ${e.message}`);
    }
  }
);
