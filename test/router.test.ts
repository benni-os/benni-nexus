import { describe, it, expect } from 'vitest';
import { createRouter } from '../src/router.js';
import type { NexusConfig } from '../src/config/types.js';

const baseConfig: NexusConfig = {
  strategy: 'cheap-first',
  backends: [
    { name: 'ollama', type: 'ollama', url: 'http://localhost:11434', models: ['llama3.1:8b'] },
    { name: 'groq', type: 'groq', apiKey: 'test-key' },
  ],
};

describe('Router', () => {
  it('selects first backend with cheap-first strategy', () => {
    const router = createRouter(baseConfig);
    const selected = router.select({ messages: [{ role: 'user', content: 'hi' }] });
    expect(selected.name).toBe('ollama');
  });

  it('selects explicit backend when model is specified', () => {
    const router = createRouter(baseConfig);
    const selected = router.select({ model: 'llama3.1:8b', messages: [{ role: 'user', content: 'hi' }] });
    expect(selected.name).toBe('ollama');
  });

  it('falls back to strategy when model not found', () => {
    const router = createRouter(baseConfig);
    const selected = router.select({ model: 'unknown-model', messages: [{ role: 'user', content: 'hi' }] });
    expect(selected.name).toBe('ollama');
  });
});
