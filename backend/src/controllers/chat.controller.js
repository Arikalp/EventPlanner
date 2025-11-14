const { runAI } = require("../config/ai");
const Conversation = require("../models/Conversation");

async function handleChat(req, res) {
  try {
    console.log('=== CHAT REQUEST START ===');
    console.log('Request body:', req.body);
    const { message, conversationId } = req.body;

    if (!message) {
      console.log('ERROR: No message provided');
      return res.status(400).json({ error: "Message is required" });
    }

    console.log('Calling AI with message:', message);
    const reply = await runAI(message);
    console.log('AI reply received:', reply);
    console.log('AI reply type:', typeof reply);
    console.log('AI reply length:', reply ? reply.length : 'null/undefined');

    let conv;

    if (!conversationId) {
      conv = await Conversation.create({
        messages: [{ sender: "user", text: message }, { sender: "ai", text: reply }]
      });
    } else {
      conv = await Conversation.findById(conversationId);
      conv.messages.push({ sender: "user", text: message });
      conv.messages.push({ sender: "ai", text: reply });
      await conv.save();
    }

    const response = {
      conversationId: conv._id,
      reply,
      venues: []
    };
    
    console.log('Sending response:', response);
    console.log('=== CHAT REQUEST END ===');
    
    res.json(response);

  } catch (err) {
    console.error("CHAT ERROR:", err);
    res.status(500).json({ error: "AI error" });
  }
}

module.exports = { handleChat };
