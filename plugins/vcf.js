const fs = require('fs');

const { cmd } = require('../command');

cmd({
  pattern: "groupcontacts",
  alias: "vcf",
  desc: "Get the group contacts in VCF format and forward it to a newsletter",
  category: "tools",
  react: "📇",
  filename: __filename
}, async (conn, mek, m, { reply, sender }) => {
  if (!m.isGroup) {
    return reply("This command is only available for groups.");
  }

  try {
    // Fetch group metadata
    let gcdata = await conn.groupMetadata(m.chat);

    // Initialize VCard string
    let vcard = '';

    // Loop through the participants to create vCards for each
    for (let a of gcdata.participants) {
      // Use participant's display name or their phone number if no display name is set
      let username = a.notify || `⚔️🗡️${a.id.split("@")[0]}`;

      // Construct the VCard format for each participant
      vcard += `BEGIN:VCARD\nVERSION:3.0\nFN:${username}\nTEL;type=CELL;type=VOICE;waid=${a.id.split("@")[0]}:+${a.id.split("@")[0]}\nEND:VCARD\n`;
    }

    // Define temporary file path for VCF
    let cont = './contacts.vcf';

    // Inform the user that contacts are being compiled
    await reply(`⏳ Compiling ${gcdata.participants.length} contacts into a VCF file...`);

    // Write VCard data to file
    await fs.writeFileSync(cont, vcard.trim());

    // Send the compiled VCF file to the group with newsletter forwarding information
    await conn.sendMessage(m.chat, {
      document: fs.readFileSync(cont),
      mimetype: 'text/vcard',
      fileName: 'Group_Contacts.vcf',
      caption: `VCF for *${gcdata.subject}* containing ${gcdata.participants.length} contacts.`,
      contextInfo: {
        forwardingScore: 1000,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363292876277898@newsletter',  // Replace with actual newsletter JID
          newsletterName: "𝐅𝐈𝐗𝐎 𝐗𝐌𝐃", // Replace with your newsletter name
          serverMessageId: 143,  // Replace with actual server message ID if applicable
        },
      }
    });

    // Clean up by deleting the VCF file after sending it
    fs.unlinkSync(cont);
  } catch (err) {
    console.error('❌ Error while processing group contacts:', err);
    reply("❌ An error occurred while processing the group contacts.");
  }
});
