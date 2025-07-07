const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "aivoice",
    alias: ["vai", "voicex", "voiceai"],
    desc: "Text to speech with different AI voices",
    category: "main",
    react: "🪃",
    filename: __filename
},
async (conn, mek, m, { 
    from, 
    quoted, 
    body, 
    isCmd, 
    command, 
    args, 
    q, 
    isGroup, 
    sender, 
    senderNumber, 
    botNumber2, 
    botNumber, 
    pushname, 
    isMe, 
    isOwner, 
    groupMetadata, 
    groupName, 
    participants, 
    groupAdmins, 
    isBotAdmins, 
    isAdmins, 
    reply 
}) => {
    try {
        // Validate that text was provided
        if (!args[0]) {
            return reply("Please provide text after the command.\nExample: .aivoice hello");
        }
        
        // Combine all arguments into the full input text
        const inputText = args.join(' ');

        // React to the command to indicate processing
        await conn.sendMessage(from, {  
            react: { text: '⏳', key: m.key }  
        });

        // Define the available voice models
        const voiceModels = [
            { number: "1", name: "Hatsune Miku", model: "miku" },
            { number: "2", name: "Nahida (Exclusive)", model: "nahida" },
            { number: "3", name: "Nami", model: "nami" },
            { number: "4", name: "Ana (Female)", model: "ana" },
            { number: "5", name: "Optimus Prime", model: "optimus_prime" },
            { number: "6", name: "Goku", model: "goku" },
            { number: "7", name: "Taylor Swift", model: "taylor_swift" },
            { number: "8", name: "Elon Musk", model: "elon_musk" },
            { number: "9", name: "Mickey Mouse", model: "mickey_mouse" },
            { number: "10", name: "Kendrick Lamar", model: "kendrick_lamar" },
            { number: "11", name: "Angela Adkinsh", model: "angela_adkinsh" },
            { number: "12", name: "Eminem", model: "eminem" }
        ];

        // Build the menu text for available voice models
        let menuText = "╭━━━〔 *AI VOICE MODELS* 〕━━━⊷\n";
        voiceModels.forEach(model => {
            menuText += `┃▸ ${model.number}. ${model.name}\n`;
        });
        menuText += "╰━━━⪼\n\n";
        menuText += `📌 *Reply with the number to select a voice model for:*\n"${inputText}"`;

        // Send the menu message (with an image, if desired)
        const sentMsg = await conn.sendMessage(from, {  
            image: { url: "https://i.ibb.co/6Rxhg321/Chat-GPT-Image-Mar-30-2025-03-39-42-AM.png" },
            caption: menuText
        }, { quoted: m });

        const messageID = sentMsg.key.id;
        let handlerActive = true;

        // Set a timeout to stop listening after 2 minutes
        const handlerTimeout = setTimeout(() => {
            handlerActive = false;
            conn.ev.off("messages.upsert", messageHandler);
            reply("⌛ Voice selection timed out. Please try the command again.");
        }, 120000);

        // Message handler to process user's reply for voice model selection
        const messageHandler = async (msgData) => {  
            if (!handlerActive) return;
            
            const receivedMsg = msgData.messages[0];  
            if (!receivedMsg || !receivedMsg.message) return;  

            // Try to extract text from different possible message types
            const receivedText = receivedMsg.message.conversation || 
                                  receivedMsg.message.extendedTextMessage?.text || 
                                  receivedMsg.message.buttonsResponseMessage?.selectedButtonId;  
            const senderID = receivedMsg.key.remoteJid;  
            // Check that the reply is to our sent menu message via stanzaId comparison
            const isReplyToBot = receivedMsg.message.extendedTextMessage?.contextInfo?.stanzaId === messageID;  

            if (isReplyToBot && senderID === from) {  
                clearTimeout(handlerTimeout);
                conn.ev.off("messages.upsert", messageHandler);
                handlerActive = false;

                // Acknowledge the reply with a reaction
                await conn.sendMessage(senderID, {  
                    react: { text: '⬇️', key: receivedMsg.key }  
                });  

                // Get the selected number and find the corresponding voice model
                const selectedNumber = receivedText.trim();
                const selectedModel = voiceModels.find(model => model.number === selectedNumber);

                if (!selectedModel) {
                    return reply("❌ Invalid option! Please reply with a number from the menu.");
                }

                try {
                    // Inform the user that audio generation is in progress
                    await conn.sendMessage(from, {  
                        text: `🔊 Generating audio with ${selectedModel.name} voice...`  
                    }, { quoted: receivedMsg });

                    // Build the URL for the API call
                    const apiUrl = `https://api.agatz.xyz/api/voiceover?text=${encodeURIComponent(inputText)}&model=${selectedModel.model}`;
                    const response = await axios.get(apiUrl, {
                        timeout: 30000 // 30 seconds timeout for the API call
                    });
                    
                    const data = response.data;

                    // Check if the API returned a successful status and a valid URL
                    if (data.status === 200 && data.data?.oss_url) {
                        await conn.sendMessage(from, {  
                            audio: { url: data.data.oss_url },  
                            mimetype: "audio/mpeg"
                        }, { quoted: receivedMsg });
                    } else {
                        reply("❌ Error generating audio. Please try again.");
                    }
                } catch (error) {
                    console.error("API Error:", error);
                    reply("❌ Error processing your request. Please try again.");
                }
            }  
        };

        // Listen for upserted messages to catch the user's reply
        conn.ev.on("messages.upsert", messageHandler);

    } catch (error) {
        console.error("Command Error:", error);
        reply("❌ An error occurred. Please try again.");
    }
});
