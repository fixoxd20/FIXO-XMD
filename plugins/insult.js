const { cmd } = require('../command');
const fetch = require('node-fetch');

cmd({
  pattern: "insult",
  alias: ["evilinsult"],
  desc: "Sends a random insult from the Evil Insult API",
  category: "fun",
  react: "😈",
  filename: __filename
},
async (conn, mek, m, { reply, sender, args, q }) => {
  try {
    // Define the Evil Insult API URL.
    let apiUrl = "https://evilinsult.com/generate_insult.php?lang=en&type=json";
    console.log(`[DEBUG] Fetching random insult from: ${apiUrl}`);
    
    // Fetch insult data from the API.
    let res = await fetch(apiUrl);
    let data = await res.json();
    console.log(`[DEBUG] Received insult data:`, data);
    
    // Extract the insult from the API response.
    let insult = data.insult || "No insult received.";
    
    // Build a super stylish message using fancy fonts and special characters.
    let fancyMessage =
`
𝓡𝓪𝓷𝓭𝓸𝓶  𝓘𝓷𝓼𝓾𝓵𝓽


✦ ${insult} ✦

★彡 𝑬𝒗𝒊𝒍 𝑰𝒏𝒔𝒖𝒍𝒕 彡★`;
    
    // Send the fancy message as a reply.
    reply(fancyMessage);
  } catch (e) {
    console.error(e);
    reply(`❌ An error occurred: ${e}`);
  }
});