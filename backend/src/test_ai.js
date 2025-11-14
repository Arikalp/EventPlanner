const { runAI } = require('./config/ai');

(async () => {
  try {
    const prompt = 'Suggest a small indoor birthday venue in San Francisco for 20 guests with affordable budget and AV equipment.';
    const reply = await runAI(prompt);
    console.log('\n--- FINAL AI REPLY ---\n', reply);
  } catch (err) {
    console.error('Test script error:', err);
  }
})();
