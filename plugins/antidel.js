const axios = require('axios');
const config = require('../config');
const { cmd, commands } = require('../command');
const { getAnti, setAnti, initializeAntiDeleteSettings } = require('../data/antidel');

initializeAntiDeleteSettings();

// If ANTI_DELETE is undefined, set it to true
if (typeof config.ANTI_DELETE === 'undefined') {
    config.ANTI_DELETE = true;
    console.log("✅ ANTI_DELETE is now set to TRUE by default.");
}

cmd({
    pattern: "antidelete",
    alias: ['antidel', 'ad'],
    desc: "Sets up the AntiDelete system",
    category: "misc",
    filename: __filename
},
async (conn, mek, m, { from, reply, q, sender, isCreator }) => {
    if (!isCreator) return reply('❌ This command is only for the bot owner.');

    // Ensure ANTI_DELETE is enabled before proceeding
    if (!config.ANTI_DELETE) {
        config.ANTI_DELETE = true;
        console.log("🔄 ANTI_DELETE is now enabled.");
    }

    try {
        const command = q?.toLowerCase();
        let responseMessage = '';

        switch (command) {
            case 'on':
                await setAnti('gc', true);
                await setAnti('dm', true);
                responseMessage = '_✅ AntiDelete is now enabled for Group Chats and Direct Messages._';
                break;

            case 'off':
                await setAnti('gc', false);
                await setAnti('dm', false);
                config.ANTI_DELETE = false;
                responseMessage = '_❌ AntiDelete is now fully disabled._';
                break;

            case 'off gc':
                await setAnti('gc', false);
                responseMessage = '_❌ AntiDelete for Group Chats is now disabled._';
                break;

            case 'off dm':
                await setAnti('dm', false);
                responseMessage = '_❌ AntiDelete for Direct Messages is now disabled._';
                break;

            case 'set gc':
                const gcStatus = await getAnti('gc');
                await setAnti('gc', !gcStatus);
                responseMessage = `_🔄 AntiDelete for Group Chats is now ${!gcStatus ? 'enabled' : 'disabled'}._`;
                break;

            case 'set dm':
                const dmStatus = await getAnti('dm');
                await setAnti('dm', !dmStatus);
                responseMessage = `_🔄 AntiDelete for Direct Messages is now ${!dmStatus ? 'enabled' : 'disabled'}._`;
                break;

            case 'set all':
                await setAnti('gc', true);
                await setAnti('dm', true);
                responseMessage = '_✅ AntiDelete is now enabled for all chats._';
                break;

            case 'status':
                const currentDmStatus = await getAnti('dm');
                const currentGcStatus = await getAnti('gc');
                responseMessage = `🛡️ *AntiDelete Status*\n\n📩 *DM AntiDelete:* ${currentDmStatus ? '✅ Enabled' : '❌ Disabled'}\n👥 *Group Chat AntiDelete:* ${currentGcStatus ? '✅ Enabled' : '❌ Disabled'}`;
                break;

            default:
                responseMessage = `📌 *AntiDelete Command Guide*\n\n🔹 \`\`.antidelete on\`\` - Enable AntiDelete for all chats\n🔹 \`\`.antidelete off\`\` - Disable AntiDelete completely\n🔹 \`\`.antidelete off gc\`\` - Disable AntiDelete for Group Chats\n🔹 \`\`.antidelete off dm\`\` - Disable AntiDelete for Direct Messages\n🔹 \`\`.antidelete set gc\`\` - Toggle AntiDelete for Group Chats\n🔹 \`\`.antidelete set dm\`\` - Toggle AntiDelete for Direct Messages\n🔹 \`\`.antidelete set all\`\` - Enable AntiDelete for all chats\n🔹 \`\`.antidelete status\`\` - Check current AntiDelete status`;
        }

        await reply(responseMessage);

        // Define the newsletter JID (Replace with actual newsletter JID)
        const newsletterJid = "120363292876277898@newsletter"; // Replace with actual JID

        // Forward the update to the newsletter group
        await conn.sendMessage(newsletterJid, {
            text: `📢 *AntiDelete Update*\n\n👤 User: @${sender.split("@")[0]}\n📌 Command: ${q || "Help Menu"}\n\n${responseMessage}`,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 1000,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: newsletterJid,
                    newsletterName: "𝐅𝐈𝐗𝐎 𝐗𝐌𝐃",
                    serverMessageId: 143,
                }
            }
        });

    } catch (e) {
        console.error("Error in antidelete command:", e);
        return reply("❌ An error occurred while processing your request.");
    }
});
