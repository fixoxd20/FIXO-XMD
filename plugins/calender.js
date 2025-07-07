const { cmd } = require('../command');

cmd({
    pattern: "calendar",
    alias: "cal",
    desc: "Show calendar of current or given month & year (GMT).",
    react: "🗓️",
    category: "utilities",
    filename: __filename
},
async (conn, mek, m, { from, q, sender, reply }) => {
    try {
        let [month, year] = q.trim().split(" ").map(x => parseInt(x));
        const now = new Date();

        // Use GMT month/year if not provided or invalid
        if (!month || month < 1 || month > 12) month = now.getUTCMonth() + 1;
        if (!year || year < 1000) year = now.getUTCFullYear();

        const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
        const firstDay = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
        const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

        let output = `🗓️ *Calendar for ${month}/${year} (GMT)*\n\`\`\`\n`;
        output += days.join(" ") + "\n";

        let dayString = "   ".repeat(firstDay);
        for (let date = 1; date <= daysInMonth; date++) {
            dayString += String(date).padStart(2, " ") + " ";
            if ((firstDay + date) % 7 === 0 || date === daysInMonth) {
                output += dayString.trimEnd() + "\n";
                dayString = "";
            }
        }

        output += "```";

        await conn.sendMessage(from, {
            text: output,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 1000,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363292876277898@newsletter',
                    newsletterName: "𝐅𝐈𝐗𝐎 𝐗𝐌𝐃",
                    serverMessageId: 146,
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("Calendar command error:", e);
        reply("❌ Error generating calendar. " + e.message);
    }
});
