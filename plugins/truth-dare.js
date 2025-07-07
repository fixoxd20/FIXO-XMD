const axios = require("axios");
const { cmd } = require("../command");

// Function to pick a random group user (excluding the message sender)
const pickRandomUser = async (conn, m) => {
  if (!m.isGroup) return m.sender;
  const participants = (await conn.groupMetadata(m.chat)).participants
    .map(p => p.id)
    .filter(id => id !== m.sender);
  if (!participants.length) return m.sender;
  return participants[Math.floor(Math.random() * participants.length)];
};

// Extract mentioned user or pick random
const getTargetUser = async (conn, m) => {
  if (m.mentionedJid?.length) return m.mentionedJid[0];
  return await pickRandomUser(conn, m);
};

// TRUTH Command
cmd({
  pattern: "truth",
  desc: "Reveal a divine truth 🧠",
  category: "Games",
  react: "📖",
  filename: __filename
}, async (conn, mek, m, { quoted }) => {
  try {
    const { data } = await axios.get("https://apis.davidcyriltech.my.id/truth");
    const target = await getTargetUser(conn, m);

    if (data?.success) {
      const text = `🕊️ *TRUTH TIME* 🕊️

@${target.split("@")[0]}, the heavens have a question for you... 🌤️

📜 *Truth:* ${data.question}

🙏 _Let your answer be pure..._`;

      await conn.sendMessage(m.chat, {
        text,
        mentions: [target]
      }, { quoted: mek });
    } else {
      await conn.sendMessage(m.chat, { text: "⚠️ Failed to fetch a truth question." }, { quoted: mek });
    }
  } catch (e) {
    console.error(e);
    await conn.sendMessage(m.chat, { text: "⚠️ An error occurred while fetching truth." }, { quoted: mek });
  }
});

// DARE Command
cmd({
  pattern: "dare",
  desc: "Assign a divine dare 🔥",
  category: "Games",
  react: "🎯",
  filename: __filename
}, async (conn, mek, m, { quoted }) => {
  try {
    const { data } = await axios.get("https://apis.davidcyriltech.my.id/dare");
    const target = await getTargetUser(conn, m);

    if (data?.success) {
      const text = `🔥 *DARE TIME* 🔥

@${target.split("@")[0]}, your test of courage has arrived... ⚔️

🎲 *Dare:* ${data.question}

🕊️ _Do not flee from divine duty..._`;

      await conn.sendMessage(m.chat, {
        text,
        mentions: [target]
      }, { quoted: mek });
    } else {
      await conn.sendMessage(m.chat, { text: "⚠️ Failed to fetch a dare." }, { quoted: mek });
    }
  } catch (e) {
    console.error(e);
    await conn.sendMessage(m.chat, { text: "⚠️ An error occurred while fetching dare." }, { quoted: mek });
  }
});
