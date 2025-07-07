const { cmd } = require('../command');
const PDFDocument = require('pdfkit');
const { Buffer } = require('buffer');

cmd({
    pattern: "topdf",
    alias: "pdf",
    desc: "Convert provided text to a PDF file.",
    react: "📄",
    category: "utilities",
    filename: __filename
},
async (conn, mek, m, { from, q, sender, reply }) => {
    try {
        if (!q) return reply("Please provide the text you want to convert to PDF. *Eg* `.topdf Pakistan ZindaBad 🇵🇰`");

        // Create a new PDF document
        const doc = new PDFDocument();
        let buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', async () => {
            const pdfData = Buffer.concat(buffers);

            // Newsletter context info
            const newsletterContext = {
                mentionedJid: [sender],
                forwardingScore: 1000,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363292876277898@newsletter',
                    newsletterName: "𝐅𝐈𝐗𝐎 𝐗𝐌𝐃",
                    serverMessageId: 143,
                },
            };

            // Send the PDF file with newsletter context
            await conn.sendMessage(from, {
                document: pdfData,
                mimetype: 'application/pdf',
                fileName: 'FIXO-XMD.pdf',
                caption: `
*📄 PDF created successfully!*

> © FIXO XMD`
            }, { quoted: mek, contextInfo: newsletterContext });
        });

        // Add text to the PDF
        doc.text(q);

        // Finalize the PDF and end the stream
        doc.end();

    } catch (e) {
        console.error(e);
        reply(`Error: ${e.message}`);
    }
});
