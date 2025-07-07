const { cmd } = require('../command');
const { fetchJson } = require('../lib/functions');
const axios = require('axios');
const config = require('../config');

cmd({
    pattern: "jokes",
    desc: "Fetch a random joke",
    category: "fun",
    react: "😂",
    filename: __filename
}, async (conn, mek, m, { reply, sender, from }) => {
    try {
        let res = await fetchJson("https://official-joke-api.appspot.com/random_joke");
        let imageUrl = "https://files.catbox.moe/et3unf.png";

        if (res && res.setup && res.punchline) {
            const jokeMessage = `${res.setup}\n\n👉 ${res.punchline}`;
            
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

            await conn.sendMessage(from, {
                image: { url: imageUrl },
                caption: jokeMessage,
                contextInfo: newsletterContext,
            }, { quoted: mek });
        } else {
            return reply("Couldn't fetch a joke at the moment. Try again later!");
        }
    } catch (e) {
        console.error(e);
        return reply(`Error: ${e.message || e}`);
    }
});

cmd({
    pattern: "quote",
    desc: "Get a random motivational quote.",
    category: "other",
    react: "💡",
    filename: __filename
}, async (conn, mek, m, { from, reply, sender }) => {
    try {
        const response = await axios.get('https://apis.davidcyriltech.my.id/random/quotes');
        const data = response.data;
        let imageUrl = "https://files.catbox.moe/et3unf.png";

        if (!data.success) {
            return reply("❌ Failed to fetch a quote. Please try again.");
        }

        const quoteMessage = `💬 *Quote of the Day* 💬\n\n_\"${data.response.quote}\"_\n\n- *${data.response.author}*`;
        
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

        await conn.sendMessage(from, {
            image: { url: imageUrl },
            caption: quoteMessage,
            contextInfo: newsletterContext,
        }, { quoted: mek });
    } catch (error) {
        console.error("Error fetching quote:", error);
        reply(`❌ Error: ${error.message}`);
    }
});

cmd({
    pattern: "pickupline",
    desc: "Get a random pick-up line.",
    category: "other",
    react: "💡",
    filename: __filename
}, async (conn, mek, m, { from, reply, sender }) => {
    try {
        const response = await axios.get('https://apis.davidcyriltech.my.id/pickupline');
        const data = response.data;
        let imageUrl = "https://files.catbox.moe/et3unf.png";

        if (!data.success) {
            return reply("❌ Failed to fetch a pick-up line. Please try again.");
        }

        // Use correct property name
        const quoteMessage = `💬 *PICKUPLINE of the Day* 💬\n\n_\"${data.pickupline}\"_\n\n`;
        
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

        await conn.sendMessage(from, {
            image: { url: imageUrl },
            caption: quoteMessage,
            contextInfo: newsletterContext,
        }, { quoted: mek });
    } catch (error) {
        console.error("Error fetching pick-up line:", error);
        reply(`❌ Error: ${error.message}`);
    }
});


cmd({
    pattern: "advice",
    desc: "Get a random advice.",
    category: "other",
    react: "💡",
    filename: __filename
}, async (conn, mek, m, { from, reply, sender }) => {
    try {
        const response = await axios.get('https://api.giftedtech.web.id/api/fun/advice?apikey=gifted');
        const data = response.data;

        let imageUrl = "https://files.catbox.moe/et3unf.png";

        if (!data.success) {
            return reply("❌ Failed to fetch advice. Please try again.");
        }

        const quoteMessage = `💬 *Advice of the Day* 💬\n\n_\"${data.result}\"_\n\n`;

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

        await conn.sendMessage(from, {
            image: { url: imageUrl },
            caption: quoteMessage,
            contextInfo: newsletterContext,
        }, { quoted: mek });

    } catch (error) {
        console.error("Error fetching advice:", error);
        reply(`❌ Error: ${error.message}`);
    }
});

cmd({
    pattern: "goodnight",
    desc: "Send a random good night message.",
    category: "other",
    react: "🌙",
    filename: __filename
}, async (conn, mek, m, { from, reply, sender }) => {
    try {
        const response = await axios.get('https://api.giftedtech.web.id/api/fun/goodnight?apikey=gifted');
        const data = response.data;

        let imageUrl = "https://files.catbox.moe/et3unf.png";

        if (!data.success) {
            return reply("❌ Failed to fetch good night wishes. Please try again.");
        }

        const quoteMessage = `🌌 *Good Night Wishes* 🌌\n\n_\"${data.result}\"_\n\n`;

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

        await conn.sendMessage(from, {
            image: { url: imageUrl },
            caption: quoteMessage,
            contextInfo: newsletterContext,
        }, { quoted: mek });

    } catch (error) {
        console.error("Error fetching good night message:", error);
        reply(`❌ Error: ${error.message}`);
    }
});

cmd({
    pattern: "motivation",
    desc: "Get a motivational quote.",
    category: "other",
    react: "🔥",
    filename: __filename
}, async (conn, mek, m, { from, reply, sender }) => {
    try {
        const response = await axios.get('https://api.giftedtech.web.id/api/fun/motivation?apikey=gifted');
        const data = response.data;

        let imageUrl = "https://files.catbox.moe/et3unf.png";

        if (!data.success) {
            return reply("❌ Failed to fetch motivation quote. Please try again.");
        }

        const quoteMessage = `💪 *Motivational Quote* 💪\n\n_\"${data.result}\"_\n\n`;

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

        await conn.sendMessage(from, {
            image: { url: imageUrl },
            caption: quoteMessage,
            contextInfo: newsletterContext,
        }, { quoted: mek });

    } catch (error) {
        console.error("Error fetching motivational quote:", error);
        reply(`❌ Error: ${error.message}`);
    }
});

cmd({
    pattern: "heartbreak",
    desc: "Get a heartbreaking quote.",
    category: "other",
    react: "💔",
    filename: __filename
}, async (conn, mek, m, { from, reply, sender }) => {
    try {
        const response = await axios.get('https://api.giftedtech.web.id/api/fun/heartbreak?apikey=gifted');
        const data = response.data;

        let imageUrl = "https://files.catbox.moe/et3unf.png";

        if (!data.success) {
            return reply("❌ Failed to fetch heartbreak quote. Please try again.");
        }

        const quoteMessage = `💔 *Heartbreak Quote* 💔\n\n_\"${data.result}\"_\n\n`;

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

        await conn.sendMessage(from, {
            image: { url: imageUrl },
            caption: quoteMessage,
            contextInfo: newsletterContext,
        }, { quoted: mek });

    } catch (error) {
        console.error("Error fetching heartbreak quote:", error);
        reply(`❌ Error: ${error.message}`);
    }
});


