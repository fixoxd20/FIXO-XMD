const { cmd } = require('../command');
const config = require("../config");
const botname = config.BOT_NAME;
const speed = require("performance-now");

// Helper: Format uptime
function formatUptime(seconds) {
  const pad = (s) => (s < 10 ? '0' + s : s);
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
}

// Helper: delay
function delay(ms) {
  console.log(`⏱️ Delay for ${ms}ms`);
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Animate by sending NEW messages, now receiving ping and uptime as parameters
async function sendAnimation(conn, m, ping, uptime) {
  const frames = [
    `⚡ *Ping:* ${ping.toFixed(4)} m/s\n⏱️ *Uptime:* ${uptime}\n🤖 *Bot:* ${botname}`,
    "*FIXO XMD*",
    "FOLLOW CHANNEL"
  ];
  
  for (let i = 0; i < frames.length; i++) {
    await conn.sendMessage(m.chat, {
      text: frames[i],
      contextInfo: {
        forwardingScore: 1000,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363292876277898@newsletter',
          newsletterName: "𝐅𝐈𝐗𝐎 𝐗𝐌𝐃",
          serverMessageId: 143,
        },
      }
    });
    await delay(500); // delay between frames
  }
}

// Ping Command
cmd({
  pattern: "ping",
  desc: "Shows ping + animated reply",
  category: "tools",
  react: "⚡",
  filename: __filename
}, async (conn, mek, m, { reply, sender }) => {
  try {
    const start = speed();
    const ping = speed() - start;
    const uptime = formatUptime(process.uptime());

    // Step 1: Send ping & uptime message using m.chat
    await conn.sendMessage(m.chat, {
      text: `⚡ *Ping:* ${ping.toFixed(4)} m/s\n⏱️ *Uptime:* ${uptime}\n🤖 *Bot:* ${botname}`,
      contextInfo: {
        mentionedJid: [sender],
        forwardingScore: 1000,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363292876277898@newsletter',
          newsletterName: "𝐅𝐈𝐗𝐎 𝐗𝐌𝐃",
          serverMessageId: 143,
        }
      }
    });

    // Step 2: Then send the animation
    await sendAnimation(conn, m, ping, uptime);

  } catch (err) {
    console.error("❌ Ping Command Error:", err);
    reply("❌ Error: " + err.message);
  }
});
