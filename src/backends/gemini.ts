import type { ChatRequest } from '../config/types.js';

export async function callGemini(apiKey: string, req: ChatRequest): Promise<string> {
  const lastUser = [...req.messages].reverse().find(m => m.role === 'user')?.content ?? '';
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: lastUser }] }] }),
    }
  );
  if (!response.ok) throw new Error(`Gemini error: ${response.status}`);
  const data = await response.json() as { candidates: Array<{ content: { parts: Array<{ text: string }> } }> };
  return data.candidates[0].content.parts[0].text;
}
