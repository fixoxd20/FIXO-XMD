const config = require('../config');
const { cmd, commands } = require('../command');
const { fetchJson } = require('../lib/functions');

cmd({
    pattern: "trt",
    desc: "Translate text to a specified language (e.g., .trt en Bonjour or .trt fr Hello).",
    category: "tools",
    react: "🌐",
    filename: __filename
},
async (conn, mek, m, {
    from,
    quoted,
    body,
    isCmd,
    command,
    args,
    q,
    isGroup,
    sender,
    senderNumber,
    botNumber2,
    botNumber,
    pushname,
    isMe,
    isOwner,
    groupMetadata,
    groupName,
    participants,
    groupAdmins,
    isBotAdmins,
    isAdmins,
    reply
}) => {
    try {
        // If no query provided (!q)
        if (!args || args.length < 2) {
            return reply(`
❓ **Usage Instructions for .trt Command**:

To translate text to a specific language, use the following format:
\`.trt <language_code> <text_to_translate>\`

Example: 
\`.trt en Bonjour\` -> translates "Bonjour" to English
\`.trt fr Hello\` -> translates "Hello" to French

**Supported language codes:**
- \`en\`: English
- \`fr\`: French
- \`es\`: Spanish
- \`de\`: German
- \`it\`: Italian
- \`pt\`: Portuguese
- \`ja\`: Japanese
- \`ko\`: Korean
- \`ru\`: Russian
- \`zh\`: Chinese
- \`ar\`: Arabic
- \`hi\`: Hindi
- \`bn\`: Bengali
- \`tr\`: Turkish
- \`pl\`: Polish
- \`nl\`: Dutch
- \`sv\`: Swedish
- \`id\`: Indonesian
- \`th\`: Thai

**Example usage:**
\`.trt en Hello\`  -> translates "Hello" to English.
\`.trt fr Bonjour\` -> translates "Bonjour" to French.

If you enter an unsupported language code, you'll get an error message. Please make sure to use one of the above codes.

`);
        }

        let langCode = args[0]; // The first argument is the language code
        let textToTranslate = args.slice(1).join(" "); // The rest is the text to translate

        // Check if valid language code is provided (you can extend this list)
        const supportedLanguages = ['en', 'fr', 'es', 'de', 'it', 'pt', 'ja', 'ko', 'ru', 'zh', 'ar', 'hi', 'bn', 'tr', 'pl', 'nl', 'sv', 'id', 'th'];

        if (!supportedLanguages.includes(langCode)) {
            return reply(`❌ Error: Unsupported language code. Supported codes are: ${supportedLanguages.join(", ")}\nUsage: .trt <language_code> <text>\nExample: .trt fr Hello -> translates 'Hello' to French.`);
        }

        // Send request to the translation API
        let res = await fetchJson(`https://apis.davidcyriltech.my.id/tools/translate?text=${encodeURIComponent(textToTranslate)}&to=${langCode}`);

        // Newsletter context
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

        // Check if the API returned a valid response
        if (res && res.success) {
            return reply(`
 
✅ **Translation Successful**:

**Translation (${langCode}):**
${res.translated_text}
               
                `);
        } else {
            return reply("❌ Error: The API did not return a valid response. Please try again later.");
        }
    } catch (e) {
        console.error(e);

        // Send error message with newsletter context
        return reply(`❌ Error: ${e.message || e}`);
    }
});
