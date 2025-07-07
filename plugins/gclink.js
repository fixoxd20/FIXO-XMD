const { cmd } = require("../command");

cmd({
    pattern: "gclink",
    alias: ["grouplink"],
    react: "🔗",
    desc: "Get group invite link",
    category: "group",
    filename: __filename
}, async (conn, mek, m, { from, isGroup, isBotAdmins, reply }) => {
    try {
        if (!isGroup) return reply("❌ Group only command");
        if (!isBotAdmins) return reply("❌ Bot needs admin");

        const code = await conn.groupInviteCode(from);
        reply(`https://chat.whatsapp.com/${code}`);
    } catch (e) {
        console.error(e);
        reply("❌ Error getting group link");
    }
});