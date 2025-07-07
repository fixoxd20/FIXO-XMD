const axios = require("axios");
const { cmd } = require("../command");

cmd({
  pattern: "tiktokstalk",
  alias: ["tstalk", "ttstalk"],
  react: "📱",
  desc: "Fetch TikTok user profile details.",
  category: "search",
  filename: __filename
}, async (conn, m, store, { from, args, q, reply }) => {
  try {
    if (!q) {
      return reply("❎ Please provide a TikTok username.\n\n*Example:* .tiktokstalk mrbeast");
    }

    const apiUrl = `https://www.tikwm.com/api/user/info?unique_id=${encodeURIComponent(q)}`;
    const { data } = await axios.get(apiUrl);

    if (data.code !== 0 || !data.data?.user) {
      return reply("❌ User not found. Please check the username and try again.");
    }

    const user = data.data.user;
    const stats = data.data.stats;

    const profileInfo = `🎭 *TikTok Profile Stalker* 🎭

👤 *Username:* @${user.uniqueId}
📛 *Nickname:* ${user.nickname}
✅ *Verified:* ${user.verified ? "Yes ✅" : "No ❌"}
📝 *Bio:* ${user.signature || "No bio available."}
📺 *YouTube:* ${user.youtube_channel_title || "N/A"}

📊 *Statistics:*
👥 *Followers:* ${stats.followerCount.toLocaleString()}
👤 *Following:* ${stats.followingCount.toLocaleString()}
❤️ *Likes:* ${stats.heartCount.toLocaleString()}
🎥 *Videos:* ${stats.videoCount.toLocaleString()}

🔒 *Private Account:* ${user.privateAccount ? "Yes 🔒" : "No 🌍"}

🔗 *Profile URL:* https://www.tiktok.com/@${user.uniqueId}
> BY *FIXO XMD*
`;

    // Newsletter context info
    const newsletterContext = {
      mentionedJid: [m.sender],
      forwardingScore: 1000,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363292876277898@newsletter',
        newsletterName: "𝐅𝐈𝐗𝐎 𝐗𝐌𝐃",
        serverMessageId: 143,
      },
    };

    const profileImage = {
      image: { url: user.avatarLarger },
      caption: profileInfo,
    };

    await conn.sendMessage(from, { ...profileImage, contextInfo: newsletterContext }, { quoted: m });

  } catch (error) {
    console.error("❌ Error in TikTok stalk command:", error);
    reply("⚠️ An error occurred while fetching TikTok profile data.");
  }
});


cmd({
    pattern: "ghstalk",
    alias: ["srepo", "gitstalk"],
    desc: "Fetch detailed GitHub profile information.",
    category: "other",
    react: "🐱",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, pushname, reply }) => {
    try {
        // Combine args to get the GitHub username
        const username = args.join(' ');
        if (!username) {
            return reply("👤 Please provide a GitHub username.\nExample: .ghstalk HaroldMth");
        }

        // Build the API URL using the provided username
        const apiUrl = `https://apis.davidcyriltech.my.id/githubStalk?user=${encodeURIComponent(username)}`;
        const response = await axios.get(apiUrl);
        const data = response.data;

        // Check if the API returned valid data
        if (!data || !data.username) {
            return reply("🚫 Unable to fetch the GitHub profile. Please try again later.");
        }

        // Create a formatted message with the GitHub user details
        const profileInfo = `
👤 *GitHub Profile Information* 👤

🔰 *Username:* ${data.username}
📝 *Nickname:* ${data.nickname}
💬 *Bio:* ${data.bio}
🆔 *ID:* ${data.id}
🔗 *Profile URL:* ${data.url}
📌 *Type:* ${data.type}
📍 *Location:* ${data.location}
📚 *Public Repositories:* ${data.public_repositories}
👥 *Followers:* ${data.followers}
🤝 *Following:* ${data.following}
⏰ *Created At:* ${data.created_at}
🔄 *Updated At:* ${data.updated_at}

*POWERED BY FIXO XMD 🤫*
        `;
        // Newsletter context info
 const newsletterContext = {
  mentionedJid: [m.sender],
  forwardingScore: 1000,
  isForwarded: true,
  forwardedNewsletterMessageInfo: {
    newsletterJid: '120363420828095666@newsletter',
    newsletterName: "𝐅𝐈𝐗𝐎 𝐗𝐌𝐃",
    serverMessageId: 143,
  },
};
        // Define the image URL using the profile picture or fallback image from config
        const imageUrl = (data.profile_pic && data.profile_pic !== 'N/A') ? data.profile_pic : config.ALIVE_IMG;

        // Send the GitHub profile details along with the profile picture
        await conn.sendMessage(from, {
            image: { url: imageUrl },
            caption: profileInfo,
            contextInfo: newsletterContext
        }, { quoted: mek });
    } catch (e) {
        console.error("Error fetching GitHub profile:", e);
        reply(`❌ Error: ${e.message}`);
    }
});
