const { cmd, commands } = require("../command");
const { fetchJson } = require("../lib/functions");
const { translate } = require("@vitalets/google-translate-api");

// Newsletter context information
const newsletterContext = {
  mentionedJid: [],
  forwardingScore: 1000,
  isForwarded: true,
  forwardedNewsletterMessageInfo: {
    newsletterJid: "120363420828095666@newsletter",
    newsletterName: "𝐅𝐈𝐗𝐎 𝐗𝐌𝐃",
    serverMessageId: 143,
  },
};

cmd({
  pattern: "wikipedia",
  alias: ["wiki"],
  react: "📖",
  desc: "Fetch Wikipedia information and translate to English.",
  category: "information",
  filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
  try {
    if (!q) {
      return await conn.sendMessage(
        from,
        { text: "Please provide a search query for Wikipedia.", contextInfo: newsletterContext },
        { quoted: mek }
      );
    }

    await conn.sendMessage(
      from,
      { text: "🔍 Searching Wikipedia...", contextInfo: newsletterContext },
      { quoted: mek }
    );

    // Step 1: Search Wikipedia for the page title
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&srsearch=${encodeURIComponent(q)}`;
    const searchResult = await fetchJson(searchUrl);

    const page = searchResult?.query?.search?.[0];
    if (!page) {
      return await conn.sendMessage(
        from,
        { text: "❌ No results found for your query.", contextInfo: newsletterContext },
        { quoted: mek }
      );
    }

    const pageTitle = page.title;

    // Step 2: Get the page summary
    const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(pageTitle)}`;
    const summary = await fetchJson(summaryUrl);

    const extract = summary.extract || "No summary available.";
    const thumb = summary.thumbnail?.source || "https://upload.wikimedia.org/wikipedia/en/archive/6/63/20100815113656%21Wikipedia-logo.png";

    const translated = await translate(extract, { to: "en" });

    let message = `📖 *Wikipedia Result*

📝 *Query:* ${q}
🔤 *Title:* ${pageTitle}

${translated.text}

🌐 *Link:* https://en.wikipedia.org/wiki/${encodeURIComponent(pageTitle)}

BY FIXO XMD`;

    await conn.sendMessage(
      from,
      {
        image: { url: thumb },
        caption: message,
        contextInfo: newsletterContext,
      },
      { quoted: mek }
    );

  } catch (error) {
    console.error(error);
    await conn.sendMessage(
      from,
      { text: `❎ An error occurred: ${error.message}`, contextInfo: newsletterContext },
      { quoted: mek }
    );
  }
});
