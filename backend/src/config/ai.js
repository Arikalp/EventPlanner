/**
 * AI Service Configuration
 * Handles communication with Google Gemini API for event planning assistance
 */

const fetch = require('node-fetch');
const { GOOGLE_AI_API_KEY } = require('./env');

function extractTextFromResponse(obj) {
  if (!obj) return null;

  const results = [];

  function walk(node) {
    if (!node) return;
    if (typeof node === 'string') {
      results.push(node.trim());
      return;
    }
    if (typeof node !== 'object') return;
    // Prefer known structured locations first
    if (Array.isArray(node)) {
      for (const item of node) walk(item);
      return;
    }
    // Check common direct properties
    if (node?.parts && Array.isArray(node.parts)) {
      for (const p of node.parts) {
        if (p?.text) results.push(p.text.trim());
        walk(p);
      }
    }
    if (node?.content && Array.isArray(node.content)) {
      for (const c of node.content) {
        if (typeof c === 'string') results.push(c.trim());
        if (c?.text) results.push(c.text.trim());
        walk(c);
      }
    }
    for (const key of Object.keys(node)) {
      const v = node[key];
      if (typeof v === 'string') results.push(v.trim());
      else if (typeof v === 'object') walk(v);
    }
  }

  try {
    walk(obj);
  } catch (e) {
    // ignore
  }

  // Filter out short tokens and metadata-like values (like model names)
  const filtered = results
    .filter(s => s && s.length > 40 && /\s/.test(s))
    .sort((a, b) => b.length - a.length);

  if (filtered.length) return filtered[0];

  // fallback: longest available string
  const anyLong = results.sort((a, b) => b.length - a.length)[0];
  return anyLong || null;
}

async function runAI(prompt) {
  console.log('=== AI FUNCTION START ===');
  console.log('API Key available:', !!GOOGLE_AI_API_KEY);
  console.log('Prompt (trimmed):', typeof prompt === 'string' ? prompt.slice(0, 200) : prompt);

  if (!GOOGLE_AI_API_KEY) {
    console.error('Google AI API key not found');
    return 'AI service is not configured properly.';
  }

  // Build sensible prompt for Gemini / Generative Language API
  const userPrompt = `You are an AI assistant specialized in event planning. Help users plan events, suggest venues, manage schedules, and provide event-related advice. User query: ${prompt}`;

  // Try a few payload formats (most servers accept JSON and will ignore unknown fields)
  const payloads = [
    // newer simple text prompt (v1beta2 / generateText style)
    {
      prompt: { text: userPrompt },
      temperature: 0.7,
      maxOutputTokens: 1024
    },
    // alternate: messages / contents style
    {
      messages: [{ role: 'user', content: userPrompt }],
      temperature: 0.7,
      maxOutputTokens: 1024
    },
    // older generativeLanguage: contents + generationConfig
    {
      contents: [{ parts: [{ text: userPrompt }] }],
      generationConfig: { temperature: 0.7, topK: 40, topP: 0.95, maxOutputTokens: 1024 }
    }
  ];

  // API variants to try (use key query param by default since .env contains an API key)
  const baseUrls = [
    'https://generativelanguage.googleapis.com/v1beta2/models/gemini-2.0:generateText',
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
    'https://generativelanguage.googleapis.com/v1/models/gemini-2.0:predict'
  ];

  // Attempt requests sequentially until we get a usable response
  for (const baseUrl of baseUrls) {
    const apiUrl = `${baseUrl}?key=${GOOGLE_AI_API_KEY}`;
    for (const body of payloads) {
      let attempt = 0;
      const maxAttempts = 3;
      let backoff = 500; // ms
      while (attempt < maxAttempts) {
        attempt += 1;
        try {
          console.log('Attempting AI request to:', apiUrl, 'attempt', attempt);
          const res = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
          });

          let data = null;
          try {
            data = await res.json();
          } catch (jsonErr) {
            console.error('Failed to parse JSON from AI response:', jsonErr.message);
            data = null;
          }

          console.log('AI Response Status:', res.status);
          console.log('AI Response Body Preview:', data && typeof data === 'object' ? JSON.stringify(data).slice(0, 2000) : data);

          // If rate limited or server error, retry with backoff
          if (res.status === 429 || (res.status >= 500 && res.status < 600)) {
            console.warn(`AI API returned status ${res.status}. Retrying after ${backoff}ms`);
            await new Promise(r => setTimeout(r, backoff));
            backoff *= 2;
            continue; // retry same body/url
          }

          if (!res.ok) {
            console.warn('AI API returned non-OK status for this attempt, skipping to next payload/endpoint');
            break; // try next payload/endpoint
          }

          const extracted = extractTextFromResponse(data);
          if (extracted) {
            console.log('AI Text Response (extracted):', extracted.slice(0, 1000));
            console.log('=== AI FUNCTION END ===');
            return extracted;
          }

          console.warn('No text extracted from AI response, trying next payload/endpoint');
          break;
        } catch (err) {
          console.error('AI request attempt failed:', err && err.message ? err.message : err);
          // exponential backoff then retry
          if (attempt < maxAttempts) {
            console.log(`Retrying after ${backoff}ms...`);
            await new Promise(r => setTimeout(r, backoff));
            backoff *= 2;
            continue;
          }
          break;
        }
      }
    }
  }

  console.log('=== AI FUNCTION END ===');
  return 'AI could not generate a response.';
}

module.exports = { runAI };
