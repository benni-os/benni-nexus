import type { ChatRequest } from '../config/types.js';

export async function callOllama(url: string, req: ChatRequest): Promise<string> {
  const response = await fetch(`${url}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: req.model ?? 'llama3.1:8b',
      messages: req.messages,
      stream: false,
      options: { temperature: req.temperature ?? 0.7 },
    }),
  });
  if (!response.ok) throw new Error(`Ollama error: ${response.status}`);
  const data = await response.json() as { message: { content: string } };
  return data.message.content;
}
