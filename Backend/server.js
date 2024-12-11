const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Dummy summarization function
const summarizeText = (text) => {
  return `Summary: ${text.slice(0, 50)}...`; // Shortens the text to 50 characters
};

// Dummy elaboration function
const elaborateText = (text) => {
  return `${text} This additional elaboration provides more context and detail to help understand the topic better.`;
};

// API endpoint to simulate AI-powered actions
app.post('/process-text', (req, res) => {
  const { text, action } = req.body;

  if (!text || !action) {
    return res.status(400).json({ error: 'Text and action are required.' });
  }

  let result;
  if (action === 'shorten') {
    result = summarizeText(text);
  } else if (action === 'lengthen') {
    result = elaborateText(text);
  } else {
    return res.status(400).json({ error: 'Invalid action.' });
  }

  res.json({ result });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
