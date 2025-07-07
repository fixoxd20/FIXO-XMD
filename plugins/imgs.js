const { cmd, commands } = require('../command'); // Ensure the path is correct
const fetch = require('node-fetch');
const g_i_s = require('g-i-s');

cmd({
    pattern: "img",
    alias: ["googleimg"],
    react: "🔍",
    desc: "Search for images on Google",
    category: "search",
    use: '.imgsearch <query>',
    filename: __filename
},
async (conn, mek, m, { from, reply, q, sender }) => {
    if (!q || !q.trim()) {
        return await reply("Please provide a search query!");
    }
    
    try {
        g_i_s(q, (error, result) => {
            if (error || !result.length) return reply("No images found!");
            
            // Newsletter context info
            const newsletterContext = {
                mentionedJid: [sender],
                forwardingScore: 1000,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363292876277898@newsletter',
                    newsletterName: "𝐅𝐈𝐗𝐎 𝐗𝐌𝐃",
                    serverMessageId: 143,
                },
            };
            
            // Send the first 5 images
            const imageUrls = result.slice(0, 5).map(img => img.url);
            imageUrls.forEach(async (url) => {
                await conn.sendMessage(from, { image: { url }, contextInfo: newsletterContext }, { quoted: mek });
            });
        });
    } catch (error) {
        console.error(error);
        reply('An error occurred while processing your request. Please try again later.');
    }
});
