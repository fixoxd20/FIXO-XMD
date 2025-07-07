const { cmd } = require('../command');
const config = require('../config');
const path = require('path');
const fs = require('fs');

const audioPath = path.join(__dirname, '../media/goku_owner.mp3');

cmd({
    pattern: "owner",
    alias: ["dev", "hans", "byte", "bot"],
    react: "✅",
    desc: "Get owner number",
    category: "main",
    filename: __filename
},
async (conn, mek, m, { from }) => {
    try {
        const ownerNumber = config.OWNER_NUM;
        const ownerName = config.OWNER_NAME;

        // Use CRLF line breaks for vCard formatting
        const vcard = `BEGIN:VCARD
VERSION:3.0
FN:237696900612
N:HANS;TECH;;;
ORG:Hans Tech
TITLE:Founder & Developer
TEL;TYPE=CELL,VOICE;waid=${ownerNumber.replace('+', '')}:${ownerNumber}
EMAIL:${ownerEmail}
URL:https://hans-byte-pair.onrender.com
NOTE:This is the official contact card of FIXO XD
END:VCARD
`;
        console.log("[DEBUG] Generated vCard:", vcard);

        // Send the vCard as a contact message
        console.log("[INFO] Sending vCard contact...");
        await conn.sendMessage(from, {
            contacts: {
                displayName: ownerName,
                contacts: [{ vcard }]
            }
        }, { quoted: mek });
        console.log("[INFO] vCard sent successfully.");

        // Send the owner contact message with image
        console.log("[INFO] Sending image message with owner details...");
        await conn.sendMessage(from, {
            image: { url: 'https://files.catbox.moe/et3unf.png' },
            caption: `╭━━〔 *FIXO XMD* 〕━━┈⊷
┃◈╭─────────────·๏
┃◈┃• *Here is the owner details*
┃◈┃• *Name* - FIXO XD
┃◈┃• *Number* 94711767300
┃◈┃• *Version*: ${config.VERSION}
┃◈└───────────┈⊷
╰──────────────┈⊷
> © *FIXO XMD*`,
            contextInfo: {
                mentionedJid: [`${ownerNumber.replace('+', '')}@s.whatsapp.net`],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363292876277898@newsletter',
                    newsletterName: "𝐅𝐈𝐗𝐎 𝐗𝐌𝐃",
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });
        console.log("[INFO] Image message sent successfully.");

        // Check and send the audio file
        console.log("[INFO] Checking for audio file at:", audioPath);
        if (fs.existsSync(audioPath)) {
            console.log("[INFO] Audio file found. Sending audio message...");
            await conn.sendMessage(from, {
                audio: fs.readFileSync(audioPath),
                mimetype: 'audio/mp4',
                ptt: true
            }, { quoted: mek });
            console.log("[INFO] Audio message sent successfully.");
        } else {
            console.warn("[WARN] Audio file not found:", audioPath);
        }

    } catch (error) {
        console.error("[ERROR] An error occurred:", error);
        await conn.sendMessage(from, { text: `An error occurred: ${error.message}` }, { quoted: mek });
    }
});