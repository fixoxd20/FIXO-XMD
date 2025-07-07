const { cmd, commands } = require('../command'); // Ensure the path is correct
const fetch = require('node-fetch');

cmd({
    pattern: "wllpp",
    alias: ["wallpaper"],
    react: "🖼️",
    desc: "Search for wallpapers using an API",
    category: "search",
    use: '.wllpp <query>',
    filename: __filename
},
async (conn, mek, m, { from, reply, q, sender }) => {
    if (!q || !q.trim()) {
        return await reply("Please provide a search query!");
    }
    
    try {
        const response = await fetch(`https://apis.davidcyriltech.my.id/search/wallpaper?text=${encodeURIComponent(q)}`);
        const data = await response.json();

        if (!data.success || !data.result || data.result.length === 0) {
            return reply("No wallpapers found!");
        }

        // Shuffle and randomly pick 5 wallpapers
        let wallpapers = data.result.sort(() => 0.5 - Math.random()).slice(0, 5);

        // Newsletter context info (adjust as needed)
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

        // Send each selected wallpaper image
        wallpapers.forEach(async (wp) => {
            await conn.sendMessage(from, { 
                image: { url: wp.image },
                caption: wp.title !== "Unknown Title" ? wp.title : q,
                contextInfo: newsletterContext 
            }, { quoted: mek });
        });
    } catch (error) {
        console.error(error);
        reply('An error occurred while processing your request. Please try again later.');
    }
});
