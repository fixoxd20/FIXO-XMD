const axios = require("axios");
const { cmd } = require("../command");
const config = require("../config");

cmd({
    pattern: "surahlist",
    alias: [],
    desc: "📖 Get the blessed list of Surahs from the Holy Qur'an 🌙",
    category: "Islamic",
    react: "🕌",
    filename: __filename
},
async (conn, mek, m, { reply }) => {
    try {
        const surahListText = 
`✨ *بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ* ✨  
*In the name of Allah, the Most Gracious, the Most Merciful* 🕋

🤲 *O seeker of truth!*  
Behold the *Divine Chapters* sent down from the Heavens 🌌 to guide our hearts and uplift our souls 💖

Here are some of the *noble Surahs* from the Glorious Qur'an 📖:

1️⃣ *Al-Fatiha* – The Opening 🌅  
2️⃣ *Al-Baqarah* – The Cow 🐄  
3️⃣ *Aal-e-Imran* – The Family of Imran 👨‍👩‍👦‍👦  
4️⃣ *An-Nisa* – The Women 🧕  
5️⃣ *Al-Ma’idah* – The Table Spread 🍽️  
… and so on till the final jewel 💎 – *Surah An-Nas* (114).

🕯️ Each Surah is a *light*, a *healing*, a *miracle* from our Lord 💫

👉 *Type* \`${config.PREFIX}quran <number>\` *to receive its divine beauty* 🌹`;
        return reply(surahListText);
    } catch (error) {
        console.error("Surahlist Error:", error);
        reply("⚠️ *SubhanAllah!* Something went wrong while fetching the list. Please try again shortly. 🛐");
    }
});

cmd({
    pattern: "quran",
    alias: ["surah"],
    desc: "📖 Read from the blessed Qur'an and listen to its beauty 🕋",
    category: "Islamic",
    react: "📿",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) {
            return reply(`🕊️ *Assalamu Alaikum wa Rahmatullahi wa Barakatuh!* 🌸  
To witness the *miracles of the Qur’an*, type \`!surahlist\` to view the list or \`!quran <number>\` to read a Surah 💖`);
        }

        const surahNumber = parseInt(q);
        if (isNaN(surahNumber) || surahNumber < 1 || surahNumber > 114) {
            return reply("📛 *Ya Allah!* Please provide a Surah number between 1 and 114 only. 🤍");
        }

        const apiUrl = `https://quran-endpoint.vercel.app/quran/${surahNumber}`;
        const response = await axios.get(apiUrl, { timeout: 30000 });
        const data = response.data;

        if (data.status === 200 && data.data) {
            const { number, ayahCount, asma, type, tafsir, recitation } = data.data;

            let messageText = `🕋 *Surah ${number} – ${asma.en.long}* 🕋\n\n`;
            messageText += `📖 *Arabic Name:* ${asma.ar.long}\n`;
            messageText += `🧡 *Meaning:* ${asma.en.translation}\n`;
            messageText += `🔢 *Verses (Ayat):* ${ayahCount} 🕯️\n`;
            messageText += `📍 *Revealed in:* ${type.en} (${type.ar})\n\n`;
            messageText += `🎧 *Recitation:* ${recitation?.full || "Link not available"}\n\n`;
            messageText += `📜 *Tafsir (Indonesian):*\n${tafsir.id || "Unavailable"}\n\n`;
            messageText += `✨ _“This is the Book about which there is no doubt, a guidance for those conscious of Allah.”_ (Qur’an 2:2) ✨\n\n`;
            messageText += `🕊️ *May Allah illuminate your heart through His words* 🤍`;
            return reply(messageText);
        } else {
            return reply("⚠️ *SubhanAllah!* The Surah could not be fetched. Try again later, InshaAllah.");
        }
    } catch (error) {
        console.error("Quran Error:", error);
        reply("❌ *Ya Rabb!* There was an error. Please try again with sabr (patience).");
    }
});
