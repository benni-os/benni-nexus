export interface Backend {
  name: string;
  type: 'ollama' | 'openai' | 'groq' | 'gemini' | 'anthropic' | 'custom';
  url?: string;
  apiKey?: string;
  models?: string[];
  enabled?: boolean;
  latencyP50?: number;
  qualityScore?: number;
}

export interface NexusConfig {
  port?: number;
  logLevel?: 'trace' | 'debug' | 'info' | 'warn' | 'error';
  strategy?: 'cheap-first' | 'fast-first' | 'quality-first' | 'round-robin' | 'failover';
  backends: Backend[];
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  model?: string;
  messages: ChatMessage[];
  stream?: boolean;
  temperature?: number;
  max_tokens?: number;
}
