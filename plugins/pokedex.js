const fetch = require('node-fetch');
const { cmd, commands } = require('../command');
const config = require('../config');
const path = require('path');

cmd(
  {
    pattern: "pokedex",
    react: "🔍",
    desc: "Get Pokémon information.",
    category: "anime",
    filename: __filename,
  },
  async (
    robin,
    mek,
    m,
    { from, quoted, body, isCmd, command, args, q, isGroup, sender, reply }
  ) => {
    try {
      // Check if a Pokémon name is provided
      const pokemonName = args.join(' ');
      if (!pokemonName) throw 'Please provide a Pokémon name to search for.';

      // Fetch Pokémon data
      const url = `https://some-random-api.com/pokemon/pokedex?pokemon=${encodeURIComponent(pokemonName)}`;
      const response = await fetch(url);
      const json = await response.json();

      if (!response.ok) {
        throw `An error occurred: ${json.error}`;,
      }

      // Format the Pokémon data into a message
      const message = `
*Name:* ${json.name}
*ID:* ${json.id}
*Type:* ${json.type}
*Abilities:* ${json.abilities}
*Height:* ${json.height}
*Weight:* ${json.weight}
*Description:* ${json.description}
      `;

      // Send the response to the user
      const newsletterContext = {
        mentionedJid: [sender],
        forwardingScore: 1000,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363420828095666@newsletter',
          newsletterName: "𝐅𝐈𝐗𝐎 𝐗𝐌𝐃",
          serverMessageId: 143,
        },
      };

      // Send the Pokémon data message to the user with forwarding info
      await robin.sendMessage(
        from,
        {
          text: message,
          contextInfo: newsletterContext,
        },
        { quoted: mek }
      );

    } catch (e) {
      console.error(e);
      reply(`❌ Error: ${e.message}`);
    }
  }
);
