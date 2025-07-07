module.exports = {
  name: "epdownload",
  alias: ["epdl"],
  category: "nsfw",
  desc: "Download video from Eporner",
  use: "<url>",
  
  async execute(m, { text }) {
    if (!text) return m.reply("Use: *epdownload <url>*");

    let apiUrl = `https://nsfw-api-pinkvenom.vercel.app/api/eporner/download?url=${encodeURIComponent(text)}`;

    try {
      let { data } = await axios.get(apiUrl);

      if (!data || !data.download_link) return m.reply("❌ Cannot get download link!");

      let message = `*🎥 EPORNER DOWNLOAD*\n\n`;
      message += `🔗 *Download Link:* ${data.download_link}\n\n`;
      message += `⚡ Click the link to download.`;

      await m.reply(message);
    } catch (error) {
      console.error(error);
      m.reply("❌ Error fetching download link!");
    }
  }
};
