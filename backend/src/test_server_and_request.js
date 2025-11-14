const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const { handleChat } = require('./controllers/chat.controller');

async function startAndTest() {
  const app = express();
  app.use(bodyParser.json());
  app.post('/api/conversations/message', handleChat);

  const server = app.listen(5002, async () => {
    console.log('Test server running on port 5002');

    // Wait a short time for server to be fully ready
    await new Promise(r => setTimeout(r, 500));

    const payload = { message: 'Make an event for a birthday party: 20 guests, indoor, affordable, needs AV' };
    try {
      const res = await fetch('http://localhost:5002/api/conversations/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      console.log('Test request response status:', res.status);
      console.log('Test request response body preview:', JSON.stringify(data).slice(0, 2000));
    } catch (err) {
      console.error('Error making test request:', err.message || err);
    } finally {
      server.close(() => console.log('Test server closed'));
    }
  });
}

startAndTest();
