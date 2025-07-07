
//=============================================
const { cmd, commands } = require('../command');
const { fetchJson } = require('../lib/functions');
const domain = `https://mr-manul-ofc-apis.vercel.app`;

//=============================================
cmd({
    pattern: "rtiktok",
    alias: ["randomtiktok","randomtik","rtik"],
    desc: 'Download tiktok random Video',
    use: '.rtik Title',
    react: "🎬",
    category: 'download',
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!q) return reply('Please provide a title.');
        const response = await fetchJson(`${domain}/random-tiktok?apikey=Manul-Official-Key-3467&query=${q}`);
        const manul = response.data
        const title = manul.title
        const cover = manul.cover
        const no_watermark = manul.no_watermark
        const watermark = manul.watermark
        const music = manul.music
        let desc = `
*🎬 FIXO XMD TIKTOK 🎬*

*𝗧𝗶𝘁𝗹𝗲 -:* _~${title}~_

*◄❪ Reply This Message With Nambars ❫►*

1. 𝗪𝗶𝘁𝗵 𝗪𝗮𝘁𝗲𝗿 𝗠𝗮𝗿𝗸 ✅
2. 𝗡𝗼 𝗪𝗮𝘁𝗲𝗿 𝗠𝗮𝗿𝗸 ❎
3. 𝗔𝗨𝗗𝗜𝗢 🎧

> *BY FIXO XMD ✘*
`;

        const vv = await conn.sendMessage(from, { image: { url: cover }, caption: desc }, { quoted: mek });

        conn.ev.on('messages.upsert', async (msgUpdate) => {
            const msg = msgUpdate.messages[0];
            if (!msg.message || !msg.message.extendedTextMessage) return;

            const selectedOption = msg.message.extendedTextMessage.text.trim();

            if (msg.message.extendedTextMessage.contextInfo && msg.message.extendedTextMessage.contextInfo.stanzaId === vv.key.id) {
                switch (selectedOption) {
                    case '1':
                    await conn.sendMessage(from,{video:{url: watermark },mimetype:"video/mp4",caption :"> BY FIXO XMD"},{quoted:mek})
                        break;
                        
                    case '2':
                    await conn.sendMessage(from,{video:{url: no_watermark },mimetype:"video/mp4",caption :"> BY FIXO XMD"},{quoted:mek})
                        break;
       
                    case '3':               
//============Send Audio======================
await conn.sendMessage(from,{audio:{url: music },mimetype:"audio/mpeg",caption :"> BY FIXO XMD"},{quoted:mek})
                        break;
 
                    default:
                        reply("Invalid option. Please select a valid option 💗");
                }

            }
        });

    } catch (e) {
        console.error(e);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } })
        reply('An error occurred while processing your request.');
    }
});

