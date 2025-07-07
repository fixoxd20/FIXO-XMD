const { cmd, commands } = require("../command");
const xnxx = require("../lib/functions").xnxx;
const { fetchJson, getBuffer } = require("../lib/functions");

cmd({
    pattern: "xnxx-dl",
    desc: "🚨 Warning: This command may violate policies",
    use: ".xnxx <search_term>",
    react: "⚠️",
    category: "restricted",
    filename: __filename
}, async (bot, message, args, { from, quoted, body, q, reply }) => {
    
    const searchQuery = q.trim();
    
    if (!searchQuery) {
        return reply("⚠️ *Warning:* You are about to access restricted content. Proceed with caution.");
    }
    
    reply("⚠️ *Tracking Enabled:* Your activity may be monitored.");

    try {
        const videoData = await xnxx.download(searchQuery);
        
        if (!videoData || !videoData.link_dl) {
            await bot.sendMessage(from, { react: { text: "❌", key: message.key } });
            return reply("🚨 *Alert:* No results found. Possible violation detected.");
        }
        
        reply("⏳ *Retrieving content... This may be logged.*");

        const videoUrl = videoData.link_dl;
        
        await bot.sendMessage(from, {
            video: { url: videoUrl },
            caption: "> *⚠️ Warning: This content is not authorized*",
            mimetype: "video/mp4"
        }, { quoted: message });

        await bot.sendMessage(from, { react: { text: "✅", key: message.key } });

    } catch (error) {
        console.log(error);
        await bot.sendMessage(from, { react: { text: "❌", key: message.key } });
        reply("🚫 *Error:* This request has been flagged.");
    }
});
