import type { ChatRequest } from '../config/types.js';

export async function callOpenAI(apiKey: string, req: ChatRequest): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: req.model ?? 'gpt-4o-mini',
      messages: req.messages,
      temperature: req.temperature ?? 0.7,
      max_tokens: req.max_tokens,
    }),
  });
  if (!response.ok) throw new Error(`OpenAI error: ${response.status}`);
  const data = await response.json() as { choices: Array<{ message: { content: string } }> };
  return data.choices[0].message.content;
}
