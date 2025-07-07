const { cmd, commands } = require("../command");
const axios = require("axios");
const path = require("path");

cmd({
    pattern: "upload",
    react: '📤',
    desc: "Upload file from URL.",
    category: "upload",
    filename: __filename
},
async (robin, mek, m, {
    from,
    quoted,
    body,
    isCmd,
    command,
    args,
    q,
    isGroup,
    sender,
    reply
}) => {
    try {
        // Validate that a URL has been provided
        if (!q) return reply("*Please provide a direct download link to upload.* 📤");

        // Extract the download URL and attempt to get the file name from URL parameters or path
        const downloadUrl = q;
        const urlObj = new URL(downloadUrl);
        let fileName = urlObj.searchParams.get("file");
        if (!fileName) {
            fileName = downloadUrl.split("/").pop();
        }

        // Determine the file extension and set the appropriate MIME type
        const fileExtension = path.extname(fileName).slice(1).toLowerCase();
        let mimeType = "application/octet-stream"; // default MIME type

        if (["mp4", "avi", "mov", "mkv"].includes(fileExtension)) {
            mimeType = "video/mp4";
        } else if (fileExtension === "apk") {
            mimeType = "application/vnd.android.package-archive";
        } else if (["jpg", "jpeg", "png"].includes(fileExtension)) {
            mimeType = `image/${fileExtension}`;
        } else if (fileExtension === "pdf") {
            mimeType = "application/pdf";
        } else if (["mp3", "wav"].includes(fileExtension)) {
            mimeType = "audio/mpeg";
        }

        // Update presence to show that the bot is processing the file download
        await robin.sendPresenceUpdate('recording', from);
        await reply("*📥 Downloading the file...*");

        // Download the file as an arraybuffer using axios
        const response = await axios.get(downloadUrl, { responseType: "arraybuffer" });

        // Send the downloaded file to the user as a document
        await robin.sendMessage(
            from,
            {
                document: {
                    url: downloadUrl // Depending on your framework, you might attach the file data directly from response.data
                },
                mimetype: mimeType,
                fileName: fileName,
                caption: `Here is your ${fileName}`
            },
            { quoted: mek }
        );

        // Notify the user of a successful upload
        return reply(`Your file "${fileName}" has been uploaded successfully! 📤`);
    } catch (error) {
        console.error(error);
        return reply("❌ An error occurred while processing your request.");
    }
});
