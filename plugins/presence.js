const fs = require('fs');
const path = require('path');
const config = require('../config')
const {cmd , commands} = require('../command')



// Composing (Auto Typing)

cmd({
    on: "body"
},    
async (conn, mek, m, { from, body, isOwner }) => {
    if (config.AUTO_TYPING === 'true') {
        await conn.sendPresenceUpdate('composing', from); // send typing 
    }
});

// Public Mod

cmd({
  on: "body"
}, async (conn, mek, m, { from, isOwner }) => {
  try {
    if (config.ALWAYS_ONLINE === 'true') {
      // Public Mode + Always Online: Always show as online
      await conn.sendPresenceUpdate("available", from);
    } else if (config.PUBLIC_MODE === 'true') {
      // Public Mode + Dynamic: Respect owner's presence
      if (isOwner) {
        // If owner is online, show available
        await conn.sendPresenceUpdate("available", from);
      } else {
        // If owner is offline, show unavailable
        await conn.sendPresenceUpdate("unavailable", from);
      }
    }
  } catch (e) {
    console.log(e);
  }
});
              