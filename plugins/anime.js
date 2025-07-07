const { cmd } = require("../command");
const { search, getep, dl } = require("darksadasyt-anime");
const axios = require("axios");

cmd(
  {
    pattern: "anime",
    react: "🎭",
    desc: "Search Anime and Get Episode Links",
    category: "anime",
    filename: __filename,
  },
  async (
    robin,
    mek,
    m,
    { from, quoted, body, isCmd, command, args, q, isGroup, sender, reply }
  ) => {
    try {
      // Validate query
      if (!q) return reply("*Please provide an anime name.* 🎭");

      // Newsletter context information
      const newsletterContext = {
        mentionedJid: [sender],
        forwardingScore: 1000,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363292876277898@newsletter",
          newsletterName: "𝐅𝐈𝐗𝐎 𝐗𝐌𝐃",
          serverMessageId: 143,
        },
      };

      // Search for the anime
      const results = await search(q);
      if (!results || results.length === 0) {
        return reply("No anime found with that name!");
      }

      let animeList = "🎬 *FIXO XMD Anime Search Results* 🎬\n\nUse .andl <link> to download episode\n\n";
      results.forEach((anime, index) => {
        animeList += `${index + 1}. ${anime.title} - Link: ${anime.link}\n`;
      });

      // Send search results message
      await robin.sendMessage(
        from,
        {
          text: animeList,
          contextInfo: newsletterContext,
        },
        { quoted: mek }
      );

      // Use the first result for episode fetching
      const animeLink = results[0].link;
      const baseUrl = new URL(animeLink).origin;

      // Get episodes for the chosen anime
      const episodeData = await getep(animeLink);
      if (!episodeData || !episodeData.result || !episodeData.results) {
        return reply("Could not retrieve episode data.");
      }
      let episodeList = `🎬 *Episodes for:* ${episodeData.result.title} 🎬\n\n`;
      episodeData.results.forEach((episode) => {
        const fullEpisodeUrl = new URL(episode.url, baseUrl).href;
        episodeList += `📺 Episode ${episode.episode} - 🔗 ${fullEpisodeUrl}\n`;
      });

      // Send episode list message
      await robin.sendMessage(
        from,
        {
          text: episodeList,
          contextInfo: newsletterContext,
        },
        { quoted: mek }
      );
    } catch (e) {
      console.error(e);
      reply(`❌ Error: ${e.message}`);
    }
  }
);
