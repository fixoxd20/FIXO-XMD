const { cmd } = require("../command");
const { downloadMediaMessage } = require("@whiskeysockets/baileys");
const Jimp = require('jimp');

cmd({
    pattern: "fullpp",
    react: "🖼️",
    desc: "Set bot's profile picture",
    category: "owner",
    filename: __filename,
    use: ".fullpp (reply to image)"
}, async (conn, mek, m, { from, quoted, reply, isOwner }) => {
    try {
        if (!isOwner) return reply("❌ Owner only command");
        if (!quoted?.message?.imageMessage) return reply("❌ Please reply to an image");

        const media = await downloadMediaMessage(quoted, 'buffer', {});
        if (!media) return reply("❌ Failed to download image");

        const image = await Jimp.read(media);
        const size = Math.max(image.bitmap.width, image.bitmap.height);
        
        if (image.bitmap.width !== image.bitmap.height) {
            const squareImage = new Jimp(size, size, 0x000000FF);
            squareImage.composite(image, (size - image.bitmap.width) / 2, (size - image.bitmap.height) / 2);
            image.clone(squareImage);
        }

        image.resize(config.USER_PP_SIZE, config.USER_PP_SIZE);
        await conn.updateProfilePicture(conn.user.id, await image.getBufferAsync(Jimp.MIME_JPEG));
        
        reply("✅ Profile picture updated!");
    } catch (e) {
        console.error(e);
        reply("❌ Error: " + e.message);
    }
});