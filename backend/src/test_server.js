const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { handleChat } = require('./controllers/chat.controller');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/api/conversations/message', handleChat);

const port = 5001;
app.listen(port, () => {
  console.log(`Test server running on http://localhost:${port}`);
  console.log('Send POST to /api/conversations/message with { message }');
});
