const { runAI } = require("../config/ai");
const Conversation = require("../models/Conversation");

async function handleChat(req, res) {
  try {
    console.log('=== CHAT REQUEST START ===');
    console.log('Request body:', req.body);
    const { message, conversationId } = req.body;

    if (!message) {
      console.log('ERROR: No message provided');
      return res.status(400).json({ error: 'Message is required' });
    }

    console.log('Calling AI with message:', message);
    const reply = await runAI(message);
    console.log('AI reply received:', reply);
    console.log('AI reply type:', typeof reply);
    console.log('AI reply length:', reply ? reply.length : 'null/undefined');

    // Try to persist conversation but don't fail the request if DB is unavailable
    let convId = null;
    try {
      // Lazy-check for mongoose connection
      const mongoose = require('mongoose');
      const isConnected = mongoose.connection && mongoose.connection.readyState === 1;

      if (isConnected) {
        let conv;
        if (!conversationId) {
          conv = await Conversation.create({
            messages: [{ sender: 'user', text: message }, { sender: 'ai', text: reply }]
          });
        } else {
          conv = await Conversation.findById(conversationId);
          if (conv) {
            conv.messages.push({ sender: 'user', text: message });
            conv.messages.push({ sender: 'ai', text: reply });
            await conv.save();
          }
        }

        if (conv && conv._id) convId = conv._id;
      } else {
        console.warn('Database not connected — skipping conversation persistence');
      }
    } catch (dbErr) {
      console.warn('Error while saving conversation (ignored):', dbErr.message || dbErr);
    }

    const response = {
      conversationId: convId,
      reply,
      venues: []
    };

    console.log('Sending response:', { conversationId: convId, replyPreview: typeof reply === 'string' ? reply.slice(0,120) : reply });
    console.log('=== CHAT REQUEST END ===');

    res.json(response);

  } catch (err) {
    console.error('CHAT ERROR:', err);
    res.status(500).json({ error: 'AI error' });
  }
}

module.exports = { handleChat };
