/**
 * AI Service Configuration
 * Handles communication with Google Gemini API for event planning assistance
 */

const fetch = require('node-fetch');
const { GOOGLE_AI_API_KEY } = require('./env');

async function runAI(prompt) {
  try {
    console.log('=== AI FUNCTION START ===');
    console.log('API Key available:', !!GOOGLE_AI_API_KEY);
    console.log('Prompt:', prompt);
    
    if (!GOOGLE_AI_API_KEY) {
      console.error('Google AI API key not found');
      return 'AI service is not configured properly.';
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GOOGLE_AI_API_KEY}`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are an AI assistant specialized in event planning. Help users plan events, suggest venues, manage schedules, and provide event-related advice. User query: ${prompt}`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024
        }
      })
    });

    const data = await response.json();
    console.log('AI Response Status:', response.status);
    console.log('AI Response Data:', data);
    
    if (!response.ok) {
      console.error('AI API Error:', data);
      return 'Unable to process your request at the moment.';
    }

    if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      const aiText = data.candidates[0].content.parts[0].text;
      console.log('AI Text Response:', aiText);
      console.log('=== AI FUNCTION END ===');
      return aiText;
    }

    console.log('Unexpected AI response format:', data);
    console.log('=== AI FUNCTION END ===');
    return 'AI could not generate a response.';
    
  } catch (error) {
    console.error('AI Service Error:', error.message);
    console.log('=== AI FUNCTION END ===');
    return 'AI service is currently unavailable.';
  }
}

module.exports = { runAI };
