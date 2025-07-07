const { cmd, commands } = require('../command')
const { fetchJson } = require('../lib/functions')

cmd({
    pattern: "shorten",
    desc: "Shorten a URL",
    category: "main",
    react: "🔗",
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
        // Get the URL from args
        let url = args.join(" ");
        
        // Check if the URL is provided
        if (!url || url.trim() === "") {
            return reply("Please provide a URL to shorten.");
        }

        // Call the URL shortening API
        let res = await fetchJson(`https://apis.davidcyriltech.my.id/tinyurl?url=${encodeURIComponent(url)}`);
        
        // Check if the API response is successful
        if (res && res.success) {
            // Send the shortened URL
            return reply(`Original URL: ${res.original_url}\nShortened URL: ${res.shortened_url}\n*By FIXO XMD 🤫* `);
        } else {
            return reply("Failed to shorten the URL. Please try again later.");
        }
    } catch (e) {
        console.error(e);
        return reply(`Error: ${e.message || e}`);
    }
});