const { cmd } = require('../command');
const config = require('../config');
const prefix = config.PREFIX;
const { exec } = require("child_process");
const fs = require('fs');
const { sleep } = require('../lib/functions');

const isRealOwner = (sender) => {
    return sender === config.OWNER_NUM || sender === '237696900612';
};

//--------------------- SET PREFIX ---------------------
cmd({
    pattern: "setprefix",
    alias: ["prefix"],
    desc: "Change bot prefix.",
    category: "settings",
    filename: __filename
}, async (conn, mek, m, { args, sender, reply }) => {
    if (!isRealOwner(sender)) return reply("*📛 Only the owner can use this command!*");
    if (!args[0]) return reply("❌ Please provide a new prefix.");

    const newPrefix = args[0];
    config.PREFIX = newPrefix;

    const configPath = './config.js';
    const updatedConfig = `module.exports = {\n  PREFIX: '${newPrefix}',\n  MODE: '${config.MODE}',\n  AUTO_TYPING: '${config.AUTO_TYPING}',\n  ALWAYS_ONLINE: '${config.ALWAYS_ONLINE}',\n  AUTO_RECORDING: '${config.AUTO_RECORDING}',\n  AUTO_STATUS_SEEN: '${config.AUTO_STATUS_SEEN}',\n  AUTO_STATUS_REACT: '${config.AUTO_STATUS_REACT}',\n  OWNER_NUM: '${config.OWNER_NUM}'\n};`;

    fs.writeFileSync(configPath, updatedConfig, 'utf-8');

    reply(`*Prefix changed to:* ${newPrefix}`);
    reply("*_DATABASE UPDATE FIXO XMD RESTARTING NOW...🚀_*");
    await sleep(1500);
    exec("pm2 restart all", (err, stdout, stderr) => {
        if (err) return reply(`❌ Error restarting bot: ${stderr}`);
        reply("*_FIXO XMD STARTED NOW...🚀_*");
    });
});

//--------------------- SET MODE ---------------------
cmd({
    pattern: "mode",
    desc: "Set bot mode to private or public.",
    category: "settings",
    filename: __filename
}, async (conn, mek, m, { args, sender, reply }) => {
    if (!isRealOwner(sender)) return reply("*📛 Only the owner can use this command!*");
    if (!args[0]) return reply(`📌 Current mode: *${config.MODE}*\n\nUsage: .mode private OR .mode public`);

    const modeArg = args[0].toLowerCase();
    if (modeArg === "private" || modeArg === "public") {
        config.MODE = modeArg;
        reply(`*_BOT MODE IS NOW SET TO ${modeArg.toUpperCase()} ✅_*`);
        reply("*_DATABASE UPDATE FIXO XMD RESTARTING NOW...🚀_*");
        await sleep(1500);
        exec("pm2 restart all");
    } else {
        reply("❌ Invalid mode. Please use `.mode private` or `.mode public`.");
    }
});

//--------------------- AUTO_TYPING ---------------------
cmd({
    pattern: "auto_typing",
    alias: ["autotyping"],
    desc: "Enable or disable fake typing.",
    category: "settings",
    filename: __filename
}, async (conn, mek, m, { args, sender, reply }) => {
    if (!isRealOwner(sender)) return reply("*📛 Only the owner can use this command!*");
    const status = args[0]?.toLowerCase();
    if (status === "on") {
        config.AUTO_TYPING = "true";
        reply("*_FAKETYPING IS NOW ENABLED._* ☑️");
    } else if (status === "off") {
        config.AUTO_TYPING = "false";
        reply("*_FAKETYPING FEATURE IS NOW DISABLED._* ❌");
    } else {
        reply(`🫟 Example: ${prefix}auto_typing on/off`);
    }
});

//--------------------- ALWAYS ONLINE ---------------------
cmd({
    pattern: "always_online",
    alias: ["alwaysonline"],
    desc: "Enable or disable always online mode.",
    category: "settings",
    filename: __filename
}, async (conn, mek, m, { args, sender, reply }) => {
    if (!isRealOwner(sender)) return reply("*📛 Only the owner can use this command!*");
    const status = args[0]?.toLowerCase();
    if (status === "on") {
        config.ALWAYS_ONLINE = "true";
        reply("*_ALWAYSONLINE IS NOW ENABLED._* ☑️");
    } else if (status === "off") {
        config.ALWAYS_ONLINE = "false";
        reply("*_ALWAYSONLINE FEATURE IS NOW DISABLED._* ❌");
    } else {
        reply(`🫟 Example: ${prefix}always_online on/off`);
    }
});

//--------------------- AUTO RECORDING ---------------------
cmd({
    pattern: "auto_recording",
    alias: ["autorecording"],
    desc: "Enable or disable fake recording.",
    category: "settings",
    filename: __filename
}, async (conn, mek, m, { args, sender, reply }) => {
    if (!isRealOwner(sender)) return reply("*📛 Only the owner can use this command!*");
    const status = args[0]?.toLowerCase();
    if (status === "on") {
        config.AUTO_RECORDING = "true";
        reply("*_FAKERECORDING IS NOW ENABLED._* ☑️");
    } else if (status === "off") {
        config.AUTO_RECORDING = "false";
        reply("*_FAKERECORDING FEATURE IS NOW DISABLED._* ❌");
    } else {
        reply(`🫟 Example: ${prefix}auto_recording on/off`);
    }
});

//--------------------- STATUS VIEW ---------------------
cmd({
    pattern: "status_view",
    alias: ["auto_status_seen"],
    desc: "Enable or disable auto-viewing statuses.",
    category: "settings",
    filename: __filename
}, async (conn, mek, m, { args, sender, reply }) => {
    if (!isRealOwner(sender)) return reply("*📛 Only the owner can use this command!*");
    const status = args[0]?.toLowerCase();
    if (status === "on") {
        config.AUTO_STATUS_SEEN = "true";
        reply("*_AUTOREADSTATUS IS NOW ENABLED._* ☑️");
    } else if (status === "off") {
        config.AUTO_STATUS_SEEN = "false";
        reply("*_AUTOREADSTATUS IS NOW DISABLED._* ❌");
    } else {
        reply(`🫟 Example: ${prefix}status_view on/off`);
    }
});

//--------------------- STATUS REACT ---------------------

