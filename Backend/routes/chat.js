const OpenAI = require('openai');
const express = require('express');
const router = express.Router();

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': 'http://localhost:3000', // Change to your actual site URL later
    'X-Title': 'Smart Culinary Assistant',
  },
});

router.post('/', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const completion = await openai.chat.completions.create({
      model: 'google/gemini-2.0-flash-exp:free', // Free model
      messages: [
        {
          role: 'user',
          content: `You are a cooking assistant. Help with recipes, ingredients, and cooking tips. Keep responses concise and practical. User query: ${message}`
        }
      ],
      max_tokens: 1000,
    });

    const aiResponse = completion.choices[0].message.content;
    res.json({ response: aiResponse });

  } catch (error) {
    console.error('OpenRouter API error:', error);
    res.status(500).json({ error: 'Failed to get AI response' });
  }
});

module.exports = router;