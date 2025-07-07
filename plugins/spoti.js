const { cmd } = require('../command');
const fetch = require('node-fetch');

cmd({
    pattern: "spotify",
    alias: ["spotdl", "music"],
    react: "🎵",
    desc: "🎶 𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱 𝗦𝗽𝗼𝘁𝗶𝗳𝘆 𝗧𝗿𝗮𝗰𝗸",
    category: "📁 𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱",
    filename: __filename
},
async (conn, mek, m, { from, quoted, q, reply, sender }) => {
    try {
        if (!q) return reply("❌ *𝙋𝙡𝙚𝙖𝙨𝙚 𝙥𝙧𝙤𝙫𝙞𝙙𝙚 𝙖 𝙑𝘼𝙇𝙄𝘿 𝙎𝙥𝙤𝙩𝙞𝙛𝙮 𝙏𝙧𝙖𝙘𝙠 𝙐𝙍𝙇!* ❌");

        const res = await fetch(`https://apis.davidcyriltech.my.id/spotifydl?url=${encodeURIComponent(q)}`);
        const data = await res.json();
        
        if (!data.success) return reply("❌ *𝙁𝙖𝙞𝙡𝙚𝙙 𝙩𝙤 𝙛𝙚𝙩𝙘𝙝 𝙎𝙥𝙤𝙩𝙞𝙛𝙮 𝙩𝙧𝙖𝙘𝙠.* ❌");

        // Check the API response structure
        console.log(JSON.stringify(data, null, 2)); // Log the response for debugging

        const newsletterContext = {
            mentionedJid: [sender],
            forwardingScore: 1000,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363420828095666@newsletter',
                newsletterName: "𝐅𝐈𝐗𝐎 𝐗𝐌𝐃",
                serverMessageId: 143,
            },
        };

        let desc = `
╭═══〘 *🎵 𝗦𝗽𝗼𝘁𝗶𝗳𝘆 𝗧𝗿𝗮𝗰𝗸 𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱* 〙═══⊷❍
┃ 🎶 *𝙏𝙞𝙩𝙡𝙚:*  *『 ${data.title} 』*
┃ 🎤 *𝘼𝙧𝙩𝙞𝙨𝙩:* *『 ${data.artist || data.channel} 』*
┃ ⏳ *𝘿𝙪𝙧𝙖𝙩𝙞𝙤𝙣:* *『 ${data.duration} 』*
┃ 📥 *𝘿𝙤𝙬𝙣𝙡𝙤𝙖𝙙 𝙨𝙩𝙖𝙧𝙩𝙚𝙙...*
╰──━──━──━──━──━──━──━──━──━─╯

*🔰 𝗣𝗼𝘄𝗲𝗿𝗲𝗱 𝗯𝘆 𝗙𝗜𝗫𝗢 𝗫𝗠𝗗* ⚡`;

        await conn.sendMessage(
            from, 
            { 
                image: { url: data.thumbnail }, 
                caption: desc,
                contextInfo: newsletterContext
            }, 
            { quoted: mek }
        );
        
        await conn.sendMessage(
            from, 
            { 
                audio: { url: data.DownloadLink || data.downloadUrl }, 
                mimetype: "audio/mpeg", 
                fileName: `『 ${data.title} 』.mp3`, 
                caption: "✅ *𝗠𝘂𝘀𝗶𝗰 𝗨𝗽𝗹𝗼𝗮𝗱𝗲𝗱 𝗦𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆!* ✅\n🔰 *𝗣𝗼𝘄𝗲𝗿𝗲𝗱 𝗯𝘆 𝗙𝗜𝗫𝗢 𝗫𝗠𝗗* ⚡",
                contextInfo: newsletterContext
            }, 
            { quoted: mek }
        );
        
    } catch (e) {
        console.error(e);
        reply("❌ *𝘼𝙣 𝙚𝙧𝙧𝙤𝙧 𝙤𝙘𝙘𝙪𝙧𝙧𝙚𝙙 𝙬𝙝𝙞𝙡𝙚 𝙛𝙚𝙩𝙘𝙝𝙞𝙣𝙜 𝙩𝙝𝙚 𝙎𝙥𝙤𝙩𝙞𝙛𝙮 𝙩𝙧𝙖𝙘𝙠.* ❌");
    }
});