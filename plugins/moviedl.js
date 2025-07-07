const { cmd } = require('../command');
const fetch = require('node-fetch');

cmd({
    pattern: "film",
    alias: ["moviedl"],
    react: "🎬",
    desc: "🎥 𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱 𝗠𝗼𝘃𝗶𝗲𝘀",
    category: "📁 𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱",
    filename: __filename
},
async (conn, mek, m, { from, quoted, q, reply, sender }) => {
    try {
        if (!q) return reply("❌ *𝙋𝙡𝙚𝙖𝙨𝙚 𝙥𝙧𝙤𝙫𝙞𝙙𝙚 𝙖 𝙈𝙊𝙑𝙄𝙀 𝙉𝘼𝙈𝙀!* ❌");

        const res = await fetch(`https://suhas-bro-apii.vercel.app/movie?query=${encodeURIComponent(q)}`);
        const data = await res.json();
        
        if (!data.status === 'success' || !data.data || !data.data.length) {
            return reply("❌ *𝙁𝙖𝙞𝙡𝙚𝙙 𝙩𝙤 𝙛𝙚𝙩𝙘𝙝 𝙢𝙤𝙫𝙞𝙚 𝙞𝙣𝙛𝙤.* ❌");
        }

        const movie = data.data[0];
        
        const movieDetails = {
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
╭═══〘 *🎬 𝗠𝗢𝗩𝗜𝗘 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗* 〙═══⊷❍
┃ 🎬 *𝙈𝙤𝙫𝙞𝙚 𝙏𝙞𝙩𝙡𝙚:*  *『 ${movie.movieName} 』*
┃ 🎥 *𝙔𝙚𝙖𝙧:* *『 ${movie.year} 』*
┃ ⭐ *𝙄𝙈𝘿𝙗 𝙍𝙖𝙩𝙞𝙣𝙜:* *『 ${movie.imdbRating} 』*
┃ 📥 *𝘿𝙤𝙬𝙣𝙡𝙤𝙖𝙙 𝙎𝙩𝙖𝙧𝙩𝙚𝙙...*
╰──━──━──━──━──━──━──━──━──━─╯

*🔰 𝗣𝗼𝘄𝗲𝗿𝗲𝗱 𝗯𝘆 𝗙𝗜𝗫𝗢 𝗫𝗠𝗗* ⚡`;

        // Send the movie thumbnail and info
        await conn.sendMessage(
            from, 
            { 
                image: { url: movie.thumbnail }, 
                caption: desc,
                contextInfo: movieDetails
            }, 
            { quoted: mek }
        );

        // Send the download link
        await conn.sendMessage(
            from, 
            { 
                text: `🎬 *𝗠𝗢𝗩𝗜𝗘 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗*\n\n🎥 *Movie Name:* *『 ${movie.movieName} 』*\n🎬 *Download Link:* ${movie.link}\n\n*🔰 Powered by FIXO XMD* ⚡`, 
                contextInfo: movieDetails
            }, 
            { quoted: mek }
        );
        
    } catch (e) {
        console.error(e);
        reply("❌ *𝘼𝙣 𝙚𝙧𝙧𝙤𝙧 𝙤𝙘𝙘𝙪𝙧𝙧𝙚𝙙 𝙬𝙝𝙞𝙡𝙚 𝙛𝙚𝙩𝙘𝙝𝙞𝙣𝙜 𝙩𝙝𝙚 𝙢𝙤𝙫𝙞𝙚.* ❌");
    }
});
