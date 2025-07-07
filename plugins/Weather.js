const axios = require('axios');
const { cmd } = require('../command');

cmd({
    pattern: "weather",
    desc: "🌤 Get weather information for a location",
    react: "🌤",
    category: "other",
    filename: __filename
},
async (conn, mek, m, { from, q, reply, sender }) => {
    try {
        if (!q) return reply("❗ *Give me a City😩👍* . Usage: .weather [city name]");
        
        const apiKey = '2d61a72574c11c4f36173b627f8cb177';
        const city = q;
        const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
        
        // Add loading reaction
        await conn.sendMessage(from, { react: { text: '⏳', key: mek.key } });

        const response = await axios.get(url);
        const data = response.data;

        // Newsletter context
        const newsletterContext = {
            mentionedJid: [sender],
            forwardingScore: 1000,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363420828095666@newsletter',
                newsletterName: "𝐅𝐈𝐗𝐎 𝐗𝐌𝐃",
                serverMessageId: Math.floor(Math.random() * 1000),
            }
        };

        // Weather information text
        const weatherInfo = `
🌍 *Location:* ${data.name}, ${data.sys.country}
🌡️ *Temperature:* ${data.main.temp}°C (Feels like ${data.main.feels_like}°C)
📊 *Range:* ${data.main.temp_min}°C ~ ${data.main.temp_max}°C
💦 *Humidity:* ${data.main.humidity}%
☁️ *Conditions:* ${data.weather[0].main} (${data.weather[0].description})
💨 *Wind:* ${data.wind.speed} m/s
🔽 *Pressure:* ${data.main.pressure} hPa

*Powered by FIXO XMD*
`;

        // Send image with weather information
        await conn.sendMessage(
            from,
            {
                image: { url: "https://files.catbox.moe/et3unf.png" },
                caption: weatherInfo,
                contextInfo: newsletterContext
            },
            { quoted: mek }
        );

        // Send success reaction
        await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });

    } catch (e) {
        console.log(e);
        // Error reaction
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        
        if (e.response && e.response.status === 404) {
            return reply("*🚫 City not found.*");
        }
        return reply("⚠️ *Sorry, Error 😓*");
    }
});