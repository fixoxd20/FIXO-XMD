const { cmd, commands } = require('../command');

cmd({
    pattern: "opentime",
    desc: "Open the group after a specified duration",
    category: "admin",
    react: "🕒",
    filename: __filename
  }, async (conn, mek, m, { reply, args, botname }) => {
    try {
      // Check if both the time value and unit are provided
      if (!args || args.length < 2) {
        return reply('Please provide both a time value and a time unit. Example: 10 minute');
      }
  
      // Parse the first argument as a number
      const timeValue = parseFloat(args[0]);
      if (isNaN(timeValue)) {
        return reply('Time value must be a valid number. Example: 10 minute');
      }
  
      let timer;
      // Determine the time duration based on the provided unit
      if (args[1].toLowerCase() === 'second' || args[1].toLowerCase() === 'seconds') {
        timer = timeValue * 1000;
      } else if (args[1].toLowerCase() === 'minute' || args[1].toLowerCase() === 'minutes') {
        timer = timeValue * 60000;
      } else if (args[1].toLowerCase() === 'hour' || args[1].toLowerCase() === 'hours') {
        timer = timeValue * 3600000;
      } else if (args[1].toLowerCase() === 'day' || args[1].toLowerCase() === 'days') {
        timer = timeValue * 86400000;
      } else {
        return reply('Please select a valid time unit: second, minute, hour, or day. Example: 10 minute');
      }
  
      // Notify the user that the open timer has started
      reply(`⏳ Open time of ${timeValue} ${args[1]} starting from now...`);
  
      // Set a timeout to open the group after the specified time
      setTimeout(async () => {
        const openMessage = `*⏰ Open Time 🗿*\nGroup was opened by ${botname}. Now all members can send messages.`;
        await conn.groupSettingUpdate(m.chat, 'not_announcement'); // Change group setting to open mode
        reply(openMessage);
      }, timer);
  
      // React with a checkmark to confirm the operation
      await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
  
    } catch (e) {
      console.error(e);
      reply('❌ An error occurred while processing your request.');
    }
  });
  
  
  cmd({
    pattern: "closetime",
    desc: "Close the group for a specified duration",
    category: "admin",
    react: "⏳",
    filename: __filename
  }, async (conn, mek, m, { reply, args, botname, text }) => {
    try {
      // Ensure both time value and unit are provided
      if (!args || args.length < 2) {
        return reply('Please provide the time duration and unit (e.g., 10 minute, 5 second, etc.).');
      }
  
      // Convert the first argument to a number and validate it
      const timeValue = parseFloat(args[0]);
      if (isNaN(timeValue)) {
        return reply('Time value must be a valid number. Example: 10 minute');
      }
  
      let timer;
      // Determine the time in milliseconds based on the provided unit
      switch (args[1].toLowerCase()) {
        case 'second':
        case 'seconds':
          timer = timeValue * 1000;
          break;
        case 'minute':
        case 'minutes':
          timer = timeValue * 60000;
          break;
        case 'hour':
        case 'hours':
          timer = timeValue * 3600000;
          break;
        case 'day':
        case 'days':
          timer = timeValue * 86400000;
          break;
        default:
          return reply('Please select a valid time unit: second, minute, hour, or day. Example: 10 minute');
      }
  
      // Notify that the timer has started
      reply(`⏳ Close time of "${text}" starting from now...`);
  
      // Set the timeout for closing the group
      setTimeout(async () => {
        const closeMessage = `*⏰ Close Time 🗿*\nThe group has been successfully closed by ${botname}.`;
        await conn.groupSettingUpdate(m.chat, 'announcement'); // Change to announcement mode
        reply(closeMessage);
      }, timer);
  
      // React with a checkmark to confirm the operation
      await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
  
    } catch (error) {
      console.error(error);
      reply('❌ An error occurred while processing your request.');
    }
  });
  