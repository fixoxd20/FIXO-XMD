const { cmd } = require('../command');
const path = require('path');

cmd(
  {
    pattern: "contacts",
    react: "📇",
    desc: "Send Hans Tech contact cards.",
    category: "main",
    filename: __filename,
  },
  async (
    robin,
    mek,
    m,
    { from, quoted, reply }
  ) => {
    try {
      await robin.sendPresenceUpdate('composing', from);

      const list = [
        {
          displayName: 'Hans Tech',
          vcard: `BEGIN:VCARD
VERSION:3.0
N:Hans Tech
FN:Hans Tech
item1.TEL;waid=1234567890:1234567890
item1.X-ABLabel:Contact Me
item2.EMAIL;type=INTERNET:mibeharold2@gmail.com
item2.X-ABLabel:Email
item3.URL:https://github.com/HaroldMth
item3.X-ABLabel:GitHub
item4.ADR:;;Ivory Coast;;;;
item4.X-ABLabel:Location
END:VCARD`
        },
        {
          displayName: 'Dev Partner',
          vcard: `BEGIN:VCARD
VERSION:3.0
N:Dev Partner
FN:Dev Partner
item1.TEL;waid=9876543210:9876543210
item1.X-ABLabel:Click to Chat
item2.EMAIL;type=INTERNET:partner@example.com
item2.X-ABLabel:Email
item3.URL:https://github.com/PartnerDev
item3.X-ABLabel:GitHub
item4.ADR:;;France;;;;
item4.X-ABLabel:Location
END:VCARD`
        }
      ];

      await robin.sendMessage(
        from,
        {
          contacts: {
            displayName: `${list.length} Contacts`,
            contacts: list
          }
        },
        { quoted: mek }
      );

    } catch (e) {
      console.error(e);
      reply(`❌ Error: ${e.message}`);
    }
  }
);
