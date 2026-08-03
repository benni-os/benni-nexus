import type { FastifyInstance } from 'fastify';
import type { Router } from '../router.js';
import type { ChatRequest } from '../config/types.js';
import { callOllama } from '../backends/ollama.js';
import { callOpenAI } from '../backends/openai.js';
import { callGroq } from '../backends/groq.js';
import { callGemini } from '../backends/gemini.js';

export async function chatCompletionsRoute(
  app: FastifyInstance,
  opts: { router: Router }
) {
  app.post<{ Body: ChatRequest }>('/v1/chat/completions', async (req, reply) => {
    const backend = opts.router.select(req.body);
    let content: string;

    switch (backend.type) {
      case 'ollama':
        content = await callOllama(backend.url!, req.body);
        break;
      case 'openai':
        content = await callOpenAI(backend.apiKey!, req.body);
        break;
      case 'groq':
        content = await callGroq(backend.apiKey!, req.body);
        break;
      case 'gemini':
        content = await callGemini(backend.apiKey!, req.body);
        break;
      default:
        reply.status(400).send({ error: `Unsupported backend type: ${backend.type}` });
        return;
    }

    reply.send({
      id: `nexus-${Date.now()}`,
      object: 'chat.completion',
      created: Math.floor(Date.now() / 1000),
      model: backend.name,
      choices: [{ index: 0, message: { role: 'assistant', content }, finish_reason: 'stop' }],
      usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
    });
  });
}
