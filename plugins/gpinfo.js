const { cmd } = require("../command");

cmd({
  pattern: "groupinfo",
  alias: ["grpinfo", "gpinfo"],
  react: "🏘",
  desc: "Fetch group details including name, owner, creation date, and member stats.",
  category: "group",
  use: ".groupinfo",
  filename: __filename,
}, async (robin, mek, m, { from, reply, isGroup }) => {
  try {
    if (!isGroup) return reply("❌ This command is only for groups.");

    function convertTimestamp(timestamp) {
      const d = new Date(timestamp * 1000);
      const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      return {
        date: d.getDate(),
        month: new Intl.DateTimeFormat("en-US", { month: "long" }).format(d),
        year: d.getFullYear(),
        day: daysOfWeek[d.getUTCDay()],
        time: `${d.getUTCHours()}:${d.getUTCMinutes()}:${d.getUTCSeconds()}`,
      };
    }

    let groupInfo = await robin.groupMetadata(from);
    let ts = convertTimestamp(groupInfo.creation);

    let groupPic;
    try {
      groupPic = await robin.profilePictureUrl(from, "image");
    } catch {
      groupPic = "https://telegra.ph/file/9521e9ee2fdbd0d6f4f1c.jpg"; // Default image
    }

    let ownerJid = groupInfo.owner ? `@${groupInfo.owner.split("@")[0]}` : "No Creator";
    let totalMembers = groupInfo.size;
    let admins = groupInfo.participants.filter((p) => p.admin !== null).length;
    let members = totalMembers - admins;

    const contextInfo = {
      mentionedJid: [groupInfo.owner],
      forwardingScore: 1000,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: "120363420828095666@newsletter",
        newsletterName: "𝐅𝐈𝐗𝐎 𝐗𝐌𝐃",
        serverMessageId: 159,
      },
    };

    const groupMessage = {
      image: { url: groupPic },
      caption: `🏷 *Group Name:* ${groupInfo.subject}\n🆔 *ID:* ${groupInfo.id}\n👑 *Owner:* ${ownerJid}\n📅 *Created:* ${ts.day}, ${ts.date} ${ts.month} ${ts.year}, ${ts.time}\n👥 *Participants:* ${totalMembers}\n🙍 *Members:* ${members}\n🛡 *Admins:* ${admins}\n✉ *Who can message:* ${groupInfo.announce ? "Admins" : "Everyone"}\n⚙ *Who can edit info:* ${groupInfo.restrict ? "Admins" : "Everyone"}\n➕ *Who can add members:* ${groupInfo.memberAddMode ? "Everyone" : "Admins"}`,
      contextInfo,
    };

    await robin.sendMessage(from, groupMessage, { quoted: mek });

  } catch (error) {
    console.error("Error fetching group info:", error);
    reply(`❌ Error: ${error.message}`);
  }
});
