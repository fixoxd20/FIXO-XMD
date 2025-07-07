const { cmd } = require("../command");
const config = require("../config");

cmd({
    pattern: "tagall",
    react: "🏷️",
    desc: "Tag all group members",
    category: "group",
    filename: __filename,
    use: ".tagall [message]"
}, async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, isBotAdmins, isAdmins, groupMetadata, participants, reply }) => {
    try {
        const _0x273817 = {
            'mentionedJid': participants.map(p => p.id),
            'forwardingScore': 999,
            'isForwarded': true,
            'forwardedNewsletterMessageInfo': {
                'newsletterJid': '120363292876277898@newsletter',
                'newsletterName': "𝐅𝐈𝐗𝐎 𝐗𝐌𝐃",
                'serverMessageId': 143
            }
        };

        if (!isGroup) return reply("📛 *THIS COMMAND CAN ONLY BE USED IN GROUPS*");
        if (!isBotAdmins) return reply("📛 *BOT MUST BE AN ADMIN TO USE THIS COMMAND*");
        if (!isAdmins) return reply("📛 *YOU MUST BE AN ADMIN TO USE THIS COMMAND*");

        let message = `╭━━━⊱ *『 𓆩⚡ ᴀᴛᴛᴇɴᴛɪᴏɴ ⚡𓆪 』* ⊰━━━╮\n\n`;
        message += `🔮 *Ｍｅｓｓａｇｅ:* 〘 ${q || '𝙽𝚘 𝚖𝚎𝚜𝚜𝚊𝚐𝚎 𝚙𝚛𝚘𝚟𝚒𝚍𝚎𝚍'} 〙\n`;
        message += `🧩 *Ｒｅｑｕｅｓｔｅｄ 𝐁𝐲:* @${sender.split('@')[0]}\n\n`;
        message += `👥 *Ｍｅｍｂｅｒｓ:* \n`;
        message += participants.map(p => `✪ @${p.id.split('@')[0]}`).join('\n');
        message += `\n\n╰━━━━━━━━━━━━━━━⊱𓃠`;

        await conn.sendMessage(
            from,
            {
                text: message,
                mentions: participants.map(p => p.id),
                contextInfo: _0x273817
            },
            { quoted: mek }
        );

    } catch (error) {
        console.error("TagAll Error:", error);
        reply("❌ An error occurred while processing the command.");
    }
});
