const { cmd } = require("../command");
const config = require("../config");

const reportedMessages = {}; // persist across calls

cmd({
    pattern: "report",
    alias: ["ask", "bug", "request"],
    desc: "Report a bug or request a feature",
    category: "utility",
    filename: __filename
}, async (conn, mek, m, {
    from, body, command, args, senderNumber, reply
}) => {
    try {
        if (!args.length) {
            return reply(`Example: ${config.PREFIX}report Play command is not working`);
        }

        const devNumber = "237696900612"; // Bot owner's number
        const messageId = m.key.id;

        if (reportedMessages[messageId]) {
            return reply("This report has already been forwarded to the owner. Please wait for a response.");
        }
        reportedMessages[messageId] = true;

        const reportText = `*| REQUEST/BUG |*\n\n*User*: @${m.sender.split("@")[0]}\n*Request/Bug*: ${args.join(" ")}`;
        const confirmationText = `Hi ${m.pushName}, your request has been forwarded to the owner. Please wait...`;

        await conn.sendMessage(`${devNumber}@s.whatsapp.net`, {
            text: reportText,
            mentions: [m.sender]
        });

        reply(confirmationText);
    } catch (error) {
        console.error(error);
        reply("An error occurred while processing your report.");
    }
});
