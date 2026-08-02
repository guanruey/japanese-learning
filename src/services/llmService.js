import { supabase } from '../supabase';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

async function getAuthHeaders() {
  const { data: { session } } = await supabase.auth.getSession();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${session?.access_token || ''}`
  };
}

export async function validateApiKey(provider, key) {
  if (!key || !key.trim()) return false;
  return key.length > 10;
}

export async function generateTutorResponse(messageHistory, systemPrompt) {
  const jsonInstruction = `\n\nCRITICAL: You MUST respond ONLY with a valid JSON object in this exact format, with no markdown tags (\`\`\`) and no preamble:
{
  "reply": "Your conversational response in Japanese",
  "new_vocab": [
    {"word": "日文漢字或假名", "reading": "平假名讀音", "meaning": "繁體中文解釋"}
  ]
}
Extract 1-3 useful vocabulary words from the user's input (especially if they made a mistake) or from your reply. If no useful vocab, return [].`;

  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        messages: messageHistory.map(m => ({
          sender: m.role === 'assistant' ? 'ai' : 'user',
          text: m.content
        })),
        systemPrompt: systemPrompt + jsonInstruction
      })
    });

    if (!response.ok) throw new Error(`Server Error: ${response.status}`);
    const data = await response.json();
    const resultText = data.choices[0].message.content;
    return parseJsonResponse(resultText);
  } catch (error) {
    console.error(`LLM generation failed:`, error);
    return { 
      reply: "すみません、今ちょっと通信の調子が悪いみたいです。（網路連線似乎有點問題，請稍後再試）",
      new_vocab: [] 
    };
  }
}

export async function generateCustomScenario(targetLang) {
  const systemPrompt = `You are a creative language learning scenario designer. Generate a new, highly practical, interesting, or slightly imaginative roleplay scenario for language learners. Target language code: ${targetLang} (use it for the main language text, but 'en' for English translations).

CRITICAL: You MUST respond ONLY with a valid JSON object in this exact format, with no markdown tags (\`\`\`) and no preamble:
{
  "id": "gen_scenario_" + (a random alphanumeric string),
  "title": { "ja": "Title in target language (e.g. Japanese)", "en": "Title in English" },
  "level": "A2-B1",
  "mission": {
    "ja": "【ミッションスタート！🎯】 Mission description in target language! (e.g., You got lost in an alien planet...)",
    "en": "[MISSION START! 🎯] Mission description in English!"
  },
  "vocabulary": [
    { "word": "Word in target lang", "translation": "English translation", "reading": "Reading/Pronunciation (if applicable, else same as word)" }
  ],
  "phrases": [
    { "phrase": "Useful phrase in target lang", "translation": "English translation" }
  ]
}
Include exactly 5 vocabulary items and 3 useful phrases.`;

  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        messages: [{ sender: 'user', text: 'Generate a new scenario.' }],
        systemPrompt: systemPrompt
      })
    });
    if (!response.ok) throw new Error(`Server Error: ${response.status}`);
    const data = await response.json();
    const resultText = data.choices[0].message.content;
    return parseJsonResponse(resultText);
  } catch (err) {
    console.error("Failed to generate scenario", err);
    return null;
  }
}

function parseJsonResponse(text) {
  try {
    // Strip potential markdown JSON formatting
    const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (parseError) {
    console.error("Failed to parse JSON from AI:", text);
    return { reply: text, new_vocab: [] };
  }
}
