const { commands } = require("../command");

commands.push({
  // plugin name
  pattern: "auto_status_read",
  
  // plugin එකට command alias එකක් නැති නිසා alias: [] යන්න පුළුවන් හෝ ඉවත් කළාත් පුළුවන්
  alias: [],

  // මෙය event-driven plugin එකක් නිසා "on" property එක "all" හෝ "body" වගේ දෙයක් කරන්න පුළුවන්
  on: "all",

  // reaction එක දක්වන්නද නැද්ද තීරණය කරන්න.
  react: "👀", 

  // main function
  function: async (client, message, m, extra) => {
    // extra අර main loop එකෙන් pass කරන object එක
    // { from, quoted, body, isCmd, command, args, q, isGroup, sender, ... config }
    // වගේ තොරතුරු අන්තර්ගතයි.
    
    // ඇත්තටම auto read status කරන්න check කරන්න ඕනද?
    // 1) message.key.remoteJid === "status@broadcast"
    // 2) config.AUTO_READ_STATUS === "true"

    const { config } = extra; // ඔබගේ config object එක මෙහිදී capture කරගන්න පුළුවන්.

    if (
      message.key &&
      message.key.remoteJid === "status@broadcast" &&
      config.AUTO_READ_STATUS === "true"
    ) {
      try {
        await client.readMessage([message.key]);
        console.log("Status auto-read success!");
      } catch (err) {
        console.error("Failed to auto-read status:", err);
      }
    }
  }
});
