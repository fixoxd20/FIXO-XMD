const { cmd } = require("../command");
const axios = require("axios");

// MIME type mapping for common file types
const mimeMap = {
    'zip': 'application/zip',
    'pdf': 'application/pdf',
    'mp3': 'audio/mpeg',
    'mp4': 'video/mp4',
    'jpg': 'image/jpeg',
    'png': 'image/png',
    'txt': 'text/plain',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'xls': 'application/vnd.ms-excel',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'ppt': 'application/vnd.ms-powerpoint',
    'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
};

cmd(
    {
        pattern: "mf",
        alias: ["mfire", "mediafire"],
        react: "📤",
        desc: "Upload files from Mediafire",
        category: "upload",
        filename: __filename,
    },
    async (robin, mek, m, { from, quoted, args, q, reply }) => {
        try {
            if (!q) return reply("*Please provide a Mediafire link* 📤");

            const mediafireUrl = q;
            const apiUrl = `https://apis.davidcyriltech.my.id/mediafire?url=${encodeURIComponent(mediafireUrl)}`;

            reply("🔍 *Fetching Mediafire link...*");

            const { data } = await axios.get(apiUrl);
            console.log("API Response:", data);

            if (!data?.downloadLink) {
                return reply(`❌ *Failed to retrieve file information*\n${JSON.stringify(data, null, 2)}`);
            }

            const fileUrl = data.downloadLink;
            const fileName = data.fileName || "file";
            const sizeString = data.size || "0MB";
            
            // Parse file size (remove non-numeric characters and convert to float)
            const fileSize = parseFloat(sizeString.replace(/[^0-9.]/g, '')) || 0;

            // Check if size exceeds WhatsApp's 50MB limit
            if (fileSize > 50) {
                return reply(
                    `⚠️ *File too large!* (${data.size})\n` +
                    `WhatsApp supports files up to 50MB\n` 
                );
            }

            reply("⬆️ *FIXO XMD uploading file to WhatsApp...*");

            // Get proper MIME type
            const fileExtension = data.mimeType?.toLowerCase() || fileName.split('.').pop();
            const mimeType = mimeMap[fileExtension] || 'application/octet-stream';

            await robin.sendMessage(
                from,
                {
                    document: { url: fileUrl },
                    mimetype: mimeType,
                    fileName: fileName,
                    caption: `📁 *${fileName}*\n📦 Size: ${data.size || 'Unknown'}\n\n> BY FIXO XMD ✘`,
                },
                { quoted: mek }
            );

        } catch (e) {
            console.error("Mediafire Error:", e);
            reply(`❌ Error: ${e.message}\nPlease check the link and try again.`);
        }
    }
);