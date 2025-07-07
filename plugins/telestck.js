const { cmd } = require('../command');
const axios = require('axios');
const { stickerTelegram } = require('@bochilteam/scraper');

cmd({
    pattern: "telesticker",
    alias: ["telestick"],
    react: "🔥",
    desc: "Get Telegram stickers from URL or search stickers",
    category: "tools",
    filename: __filename,
    limit: true
}, async (conn, mek, m, { args, from, sender }) => {
    try {
        // If input is a Telegram sticker URL
        if (args[0] && args[0].match(/(https:\/\/t.me\/addstickers\/)/gi)) {
            console.log("[INFO] Telegram sticker URL detected.");
            let res = await Telesticker(args[0]);
            await conn.sendMessage(from, { text: `Sending ${res.length} stickers...` }, { quoted: mek });
            if (m.isGroup && res.length > 30) {
                await conn.sendMessage(from, { text: 'Number of stickers more than 30, bot will send them in private chat.' }, { quoted: mek });
                for (let i = 0; i < res.length; i++) {
                    await conn.sendMessage(sender, { sticker: { url: res[i].url } });
                }
            } else {
                for (let i = 0; i < res.length; i++) {
                    await conn.sendMessage(from, { sticker: { url: res[i].url } });
                }
            }
        }
        // Otherwise, treat input as a search query in the format "query | page"
        else if (args && args.join(' ')) {
            const input = args.join(' ');
            let [query, page] = input.split('|').map(v => v.trim());
            console.log(`[INFO] Searching stickers for query: ${query} | ${page || 'default page'}`);
            let res = await stickerTelegram(query, page);
            if (!res.length) throw new Error(`Query "${input}" not found`);
            const resultMessage = res.map(v => `*${v.title}*\n_${v.link}_`).join('\n\n');
            await conn.sendMessage(from, { text: resultMessage }, { quoted: mek });
        }
        else {
            throw new Error('Input Query / Telesticker URL is required.');
        }
    } catch (error) {
        console.error("[ERROR] telesticker command:", error);
        await conn.sendMessage(from, { text: `Error: ${error.message}` }, { quoted: mek });
    }
});

async function Telesticker(url) {
    return new Promise(async (resolve, reject) => {
        try {
            if (!url.match(/(https:\/\/t.me\/addstickers\/)/gi)) {
                throw new Error('Enter a valid Telegram sticker URL.');
            }
            const packName = url.replace('https://t.me/addstickers/', '');
            console.log(`[INFO] Fetching sticker pack: ${packName}`);
            const data = await axios.get(`https://api.telegram.org/bot891038791:AAHWB1dQd-vi0IbH2NjKYUk-hqQ8rQuzPD4/getStickerSet?name=${encodeURIComponent(packName)}`, {
                headers: { 'User-Agent': 'GoogleBot' }
            });
            const stickers = data.data.result.stickers;
            const hasil = [];
            for (let i = 0; i < stickers.length; i++) {
                const fileId = stickers[i].thumb.file_id;
                const data2 = await axios.get(`https://api.telegram.org/bot891038791:AAHWB1dQd-vi0IbH2NjKYUk-hqQ8rQuzPD4/getFile?file_id=${fileId}`);
                const result = {
                    status: 200,
                    author: 'Xfarr05',
                    url: `https://api.telegram.org/file/bot891038791:AAHWB1dQd-vi0IbH2NjKYUk-hqQ8rQuzPD4/${data2.data.result.file_path}`
                };
                hasil.push(result);
            }
            console.log(`[SUCCESS] Fetched ${hasil.length} stickers from pack ${packName}.`);
            resolve(hasil);
        } catch (err) {
            console.error("[ERROR] Telesticker function:", err);
            reject(err);
        }
    });
}
