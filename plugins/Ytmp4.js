const { cmd } = require('../command');
const yts = require('yt-search');
const fetch = require('node-fetch');
const path = require('path');

// Configure newsletter context
const newsletterContext = {
    mentionedJid: [], // Can add specific JIDs if needed
    forwardingScore: 1000,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: '120363292876277898@newsletter',
        newsletterName: "𝐅𝐈𝐗𝐎 𝐗𝐌𝐃",
        serverMessageId: 143,
    }
};

// Utility: Send error reply helper
function sendError(reply, message) {
    return reply(`*❌ ${message}*`);
}

// VIDEO COMMAND - accepts a prompt (title or URL)
cmd({
    pattern: "video",
    alias: ['ytdl', 'youtube'],
    react: "🎥",
    desc: "Download video from YouTube by prompt or URL",
    category: "download",
    filename: __filename
}, async (conn, mek, m, { from, q, reply, sender }) => {
    const retryLimit = 3;
    let attempt = 0;

    const fetchVideo = async () => {
        try {
            if (!q) return sendError(reply, "Please provide a video title or YouTube URL");

            let videoUrl = q;

            // If input is not a direct YouTube URL, search for video
            if (!q.includes('youtu')) {
                const search = await yts(q);
                const video = search.videos[0];
                if (!video) return sendError(reply, "No results found");
                videoUrl = video.url;
            }

            const messageContext = {
                ...newsletterContext,
                mentionedJid: [sender]
            };

            // Fetch video info from new API
            const apiUrl = `https://api.giftedtech.web.id/api/download/ytdl?apikey=gifted&url=${encodeURIComponent(videoUrl)}`;
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (!data.success || !data.result) {
                return sendError(reply, "Failed to get video download info");
            }

            const { title, thumbnail, video_url, audi_quality, video_quality } = data.result;

            const infoMsg = `
╭════════════⊷❍
│
│ *🎥 Video Downloader*
│──────────────────────
│ 📌 Title: ${title}
│ 🎞️ Quality: ${video_quality}
│ 🎧 Audio Quality: ${audi_quality}
╰──────────●●►
*📥 Downloaded via FIXO XMD*`.trim();

            await conn.sendMessage(from, {
                image: { url: thumbnail },
                caption: infoMsg,
                contextInfo: messageContext
            }, { quoted: mek });

            // Send video
            await conn.sendMessage(from, {
                video: { url: video_url },
                mimetype: 'video/mp4',
                caption: "*🎥 FIXO XMD*",
                contextInfo: messageContext
            }, { quoted: mek });

            // Send as document
            await conn.sendMessage(from, {
                document: { url: video_url },
                mimetype: 'video/mp4',
                fileName: `${title}.mp4`,
                caption: "*📁 FIXO XMD*",
                contextInfo: messageContext
            }, { quoted: mek });

        } catch (error) {
            console.error('Video Error:', error);
            attempt++;
            if (attempt < retryLimit) {
                console.log(`Retrying... Attempt ${attempt + 1}`);
                await fetchVideo();
            } else {
                return sendError(reply, error.message);
            }
        }
    };

    await fetchVideo();
});


// YTMP4 COMMAND - only accepts direct YouTube URL, downloads video (same API, but must be URL)
cmd({
    pattern: "ytmp4",
    alias: ['youtube', 'ytvid'],
    react: "🎧",
    desc: "Download video from YouTube URL",
    category: "download",
    filename: __filename
}, async (conn, mek, m, { from, q, reply, sender }) => {
    if (!q || !q.includes("youtube.com/watch") && !q.includes("youtu.be")) {
        return sendError(reply, "Please provide a valid YouTube video URL");
    }

    try {
        const apiUrl = `https://api.giftedtech.web.id/api/download/ytdl?apikey=gifted&url=${encodeURIComponent(q)}`;
        const response = await fetch(apiUrl);
        const json = await response.json();

        if (!json.success || !json.result) {
            return sendError(reply, "Failed to retrieve video info");
        }

        const { title, thumbnail, video_url, audi_quality, video_quality } = json.result;

        const messageContext = {
            ...newsletterContext,
            mentionedJid: [sender]
        };

        const infoMsg = `
╭════════════⊷❍
│
│ *🎥 YT Video Downloader*
│──────────────────────
│ 📌 Title: ${title}
│ 🎞️ Quality: ${video_quality}
│ 🎧 Audio Quality: ${audi_quality}
╰──────────●●►
*📥 Powered by FIXO XMD*`.trim();

        await conn.sendMessage(from, {
            image: { url: thumbnail },
            caption: infoMsg,
            contextInfo: messageContext
        }, { quoted: mek });

        // Send video
        await conn.sendMessage(from, {
            video: { url: video_url },
            mimetype: 'video/mp4',
            caption: "*🎥 FIXO XMD*",
            contextInfo: messageContext
        }, { quoted: mek });

        // Send as document
        await conn.sendMessage(from, {
            document: { url: video_url },
            mimetype: 'video/mp4',
            fileName: `${title}.mp4`,
            caption: "*📁 FIXO XMD*",
            contextInfo: messageContext
        }, { quoted: mek });

    } catch (err) {
        console.error("YTMP4 Error:", err);
        return sendError(reply, err.message);
    }
});
