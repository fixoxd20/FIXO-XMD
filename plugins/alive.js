const { cmd } = require('../command');

cmd(
  {
    pattern: "calendar",
    alias: "cal",
    desc: "Show calendar of current or given month & year (GMT).",
    react: "🗓️",
    category: "utilities",
    filename: __filename,
  },
  async (
    robin,
    mek,
    m,
    { from, q, sender, reply }
  ) => {
    try {
      // Parse args from .calendar 6 2025
      let [month, year] = q.trim().split(" ").map(Number);
      const now = new Date();

      // Defaults to GMT date
      if (!month || isNaN(month) || month < 1 || month > 12)
        month = now.getUTCMonth() + 1;
      if (!year || isNaN(year) || year < 1000)
        year = now.getUTCFullYear();

      const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
      const firstDay = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
      const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

      let output = `🗓️ *Calendar for ${month}/${year} (GMT)*\n\`\`\`\n`;
      output += days.join(" ") + "\n";

      let week = "   ".repeat(firstDay);
      for (let day = 1; day <= daysInMonth; day++) {
        week += day.toString().padStart(2, ' ') + " ";
        if ((firstDay + day) % 7 === 0 || day === daysInMonth) {
          output += week + "\n";
          week = "";
        }
      }
      output += "```";

      // Newsletter context
      const newsletterContext = {
        mentionedJid: [sender],
        forwardingScore: 1000,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363420828095666@newsletter',
          newsletterName: "𝐅𝐈𝐗𝐎 𝐗𝐌𝐃",
          serverMessageId: 147,
        },
      };

      // Send calendar
      await robin.sendMessage(from, {
        text: output,
        contextInfo: newsletterContext,
      }, { quoted: mek });

    } catch (e) {
      console.error("Calendar command error:", e);
      reply("❌ Error generating calendar. " + e.message);
    }
  }
);
