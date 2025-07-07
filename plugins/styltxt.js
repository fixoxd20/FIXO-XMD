const { cmd, commands } = require('../command');
const pkg = require('api-qasim');
const { styletext } = pkg;

// Newsletter context information
const newsletterContext = {
  mentionedJid: [],
  forwardingScore: 1000,
  isForwarded: true,
  forwardedNewsletterMessageInfo: {
    newsletterJid: '120363420828095666@newsletter', // Example newsletter JID
    newsletterName: "𝐅𝐈𝐗𝐎 𝐗𝐌𝐃",
    serverMessageId: 143,
  },
};

// Register the command
cmd(
  {
    pattern: "styletext",
    alias: ['styltxt', 'font'],
    react: "✍️",
    desc: "Generate a styled version of your text.",
    category: "utility",
    filename: __filename,
  },
  async (
    conn,
    mek,
    m,
    { from, quoted, body, isCmd, command, args, q, isGroup, sender, reply }
  ) => {
    try {
      // Get the text input
      const text = args.join(" ") || "Hello, Hans Tech!";
      if (!text) {
        return conn.sendMessage(
          from,
          { text: `Please provide a text. Example: *${m.prefix + command} Hello*`, contextInfo: newsletterContext },
          { quoted: mek }
        );
      }

      // Apply the styletext function
      const styledResult = await styletext(text);

      if (Array.isArray(styledResult)) {
        let styledMessage = `📌 *Choose a styled version of the text by replying with the number:*\n\n`;

        // Build the styled text list
        styledResult.forEach((item, index) => {
          const styledText = item.result || item;
          styledMessage += `*${index + 1}.* ${styledText}\n`;
        });

        // Send the options message with newsletter context (forwarded)
        const sentMsg = await conn.sendMessage(
          from,
          { text: styledMessage, contextInfo: newsletterContext },
          { quoted: mek }
        );

        // Store session data
        conn.styletext = conn.styletext || {};
        conn.styletext[sender] = {
          result: styledResult,
          key: sentMsg.key,
          timeout: setTimeout(() => {
            delete conn.styletext[sender];
          }, 150 * 1000),
        };

        // Listen for user replies
        conn.ev.on('messages.upsert', async (msgUpdate) => {
          const msg = msgUpdate.messages[0];
          if (!msg.message || !msg.message.extendedTextMessage) return;

          const selectedOption = msg.message.extendedTextMessage.text.trim();

          if (msg.message.extendedTextMessage.contextInfo && msg.message.extendedTextMessage.contextInfo.stanzaId === sentMsg.key.id) {
            const choice = Number(selectedOption);
            if (choice >= 1 && choice <= styledResult.length) {
              const selectedStyledText = styledResult[choice - 1].result || styledResult[choice - 1];

              // Send the selected style with newsletter forwarding (everything is forwarded)
              await conn.sendMessage(
                from,
                { text: selectedStyledText, contextInfo: newsletterContext },
                { quoted: mek }
              );

              clearTimeout(conn.styletext[sender].timeout);
              delete conn.styletext[sender];
            } else {
              // Send an invalid option message with newsletter forwarding
              await conn.sendMessage(
                from,
                { text: `❌ Invalid selection. Please choose a number between 1 and ${styledResult.length}.`, contextInfo: newsletterContext },
                { quoted: mek }
              );
            }
          }
        });

      } else {
        // Send no styled text found message with newsletter forwarding
        await conn.sendMessage(
          from,
          { text: `No styled text found for the input provided.`, contextInfo: newsletterContext },
          { quoted: mek }
        );
      }
    } catch (e) {
      console.error("Error in styletext command:", e);
      await conn.sendMessage(
        from,
        { text: `❎ Error occurred: ${e.message || e}`, contextInfo: newsletterContext },
        { quoted: mek }
      );
    }
  }
);
