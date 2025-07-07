const { cmd } = require('../command');
const config = require("../config");
const warnings = {};


// Anti-Bad Words System
cmd({
  'on': "body"
}, async (conn, m, store, {
  from,
  body,
  isGroup,
  isAdmins,
  isBotAdmins,
  reply,
  sender
}) => {
  try {
    const badWords = ["wtf", "mia", "xxx", "fuck", 'sex', "huththa", "pakaya", 'ponnaya', "hutto"];

    if (!isGroup || isAdmins || !isBotAdmins) {
      return;
    }

    const messageText = body.toLowerCase();
    const containsBadWord = badWords.some(word => messageText.includes(word));

    if (containsBadWord && config.ANTI_BAD_WORD === 'true') {
      await conn.sendMessage(from, { 'delete': m.key }, { 'quoted': m });
      await conn.sendMessage(from, { 'text': "🚫 ⚠️ BAD WORDS NOT ALLOWED ⚠️ 🚫" }, { 'quoted': m });
    }
  } catch (error) {
    console.error(error);
    reply("An error occurred while processing the message.");
  }
});

// Anti-Link System
const linkPatterns = [
  /https?:\/\/\S+/gi // Yeh kisi bhi "http" ya "https" se start hone wale link ko pakdega
];


// Store anti-link status per group
global.antiLinkEnabled = global.antiLinkEnabled || {};

cmd({
  on: "anti_link"
}, async (conn, m, store, {
  from,
  isGroup,
  isAdmins,
  reply
}) => {
  if (!isGroup || !isAdmins) return reply("❌ Only group admins can toggle Anti-Link.");

  global.antiLinkEnabled[from] = !global.antiLinkEnabled[from];
  const status = global.antiLinkEnabled[from] ? "✅ ENABLED" : "❌ DISABLED";
  reply(`🛡️ *Anti-Link Protection is now:* ${status}`);
});

// Message listener for anti-link enforcement
cmd({
  on: "body"
}, async (conn, m, store, {
  from,
  body,
  sender,
  isGroup,
  isAdmins,
  isBotAdmins,
  reply
}) => {
  try {
    if (!global.warnings) global.warnings = {};

    const isAntiLinkOn = global.antiLinkEnabled?.[from];
    if (!isGroup || !isBotAdmins || isAdmins || !isAntiLinkOn) return;

    const linkPatterns = [
      /https?:\/\/(?:chat\.whatsapp\.com|wa\.me)\/\S+/gi,
      /https?:\/\/(?:api\.whatsapp\.com|wa\.me)\/\S+/gi,
      /wa\.me\/\S+/gi,
      /https?:\/\/(?:t\.me|telegram\.me)\/\S+/gi,
      /https?:\/\/(?:www\.)?\.com\/\S+/gi,
      /https?:\/\/(?:www\.)?twitter\.com\/\S+/gi,
      /https?:\/\/(?:www\.)?linkedin\.com\/\S+/gi,
      /https?:\/\/(?:whatsapp\.com|channel\.me)\/\S+/gi,
      /https?:\/\/(?:www\.)?reddit\.com\/\S+/gi,
      /https?:\/\/(?:www\.)?discord\.com\/\S+/gi,
      /https?:\/\/(?:www\.)?twitch\.tv\/\S+/gi,
      /https?:\/\/(?:www\.)?vimeo\.com\/\S+/gi,
      /https?:\/\/(?:www\.)?dailymotion\.com\/\S+/gi,
      /https?:\/\/(?:www\.)?medium\.com\/\S+/gi
    ];

    const containsLink = linkPatterns.some(pattern => pattern.test(body));
    if (!containsLink) return;

    console.log(`Link detected from ${sender}: ${body}`);

    try {
      await conn.sendMessage(from, { delete: m.key });
      console.log(`Message deleted: ${m.key.id}`);
    } catch (err) {
      console.error("Failed to delete message:", err);
    }

    global.warnings[sender] = (global.warnings[sender] || 0) + 1;
    const warningCount = global.warnings[sender];

    if (warningCount < 4) {
      await conn.sendMessage(from, {
        text: `‎*⚠️LINKS ARE NOT ALLOWED⚠️*\n` +
              `*╭────⬡ WARNING ⬡────*\n` +
              `*├▢ USER :* @${sender.split('@')[0]}\n` +
              `*├▢ COUNT : ${warningCount}*\n` +
              `*├▢ REASON : LINK SENDING*\n` +
              `*├▢ WARN LIMIT : 3*\n` +
              `*╰────────────────*`,
        mentions: [sender]
      });
    } else {
      await conn.sendMessage(from, {
        text: `@${sender.split('@')[0]} *HAS BEEN REMOVED - WARN LIMIT EXCEEDED!*`,
        mentions: [sender]
      });
      await conn.groupParticipantsUpdate(from, [sender], "remove");
      delete global.warnings[sender];
    }
  } catch (err) {
    console.error("Anti-link error:", err);
    reply("❌ An error occurred while processing anti-link.");
  }
});
