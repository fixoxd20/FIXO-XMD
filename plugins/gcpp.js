const { cmd } = require("../command");
const { downloadMediaMessage } = require("@whiskeysockets/baileys");
const Jimp = require('jimp');

cmd({
    pattern: "gcpp",
    alias: ['grouppp'],
    react: "🖼️",
    desc: "Set group profile picture",
    category: "group",
    filename: __filename,
    use: ".gcpp (reply to image)"
}, async (conn, mek, m, { from, quoted, isGroup, isAdmins, reply }) => {
    try {
        if (!isGroup) return reply("❌ This command can only be used in groups");
        if (!isAdmins) return reply("❌ You must be admin to use this command");
        if (!quoted?.message?.imageMessage) return reply("❌ Please reply to an image");

        const media = await downloadMediaMessage(quoted, 'buffer', {});
        if (!media) return reply("❌ Failed to download image");

        const image = await Jimp.read(media);
        const size = Math.max(image.bitmap.width, image.bitmap.height);
        const squareImage = new Jimp(size, size, 0x000000FF);
        
        squareImage.composite(image, (size - image.bitmap.width) / 2, (size - image.bitmap.height) / 2);
        squareImage.resize(config.GROUP_PP_SIZE, config.GROUP_PP_SIZE);
        
        await conn.updateProfilePicture(from, await squareImage.getBufferAsync(Jimp.MIME_JPEG));
        reply("✅ Group profile picture updated!");
    } catch (e) {
        console.error(e);
        reply("❌ Error: " + e.message);
    }
});