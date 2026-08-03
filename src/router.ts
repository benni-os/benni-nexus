import type { NexusConfig, Backend, ChatRequest } from './config/types.js';

export interface Router {
  select(req: ChatRequest): Backend;
}

export function createRouter(config: NexusConfig): Router {
  const backends = config.backends.filter(b => b.enabled !== false);

  const strategies: Record<string, (req: ChatRequest) => Backend> = {
    'cheap-first': () => backends[0],
    'round-robin': (() => {
      let i = 0;
      return () => backends[i++ % backends.length];
    })(),
    'fast-first': () => backends.sort((a, b) => (a.latencyP50 ?? 999) - (b.latencyP50 ?? 999))[0],
    'quality-first': () => backends.sort((a, b) => (b.qualityScore ?? 0) - (a.qualityScore ?? 0))[0],
    'failover': () => backends[0],
  };

  const strategy = strategies[config.strategy ?? 'cheap-first'];

  return {
    select(req: ChatRequest): Backend {
      if (req.model && req.model !== 'auto') {
        const explicit = backends.find(b => b.models?.includes(req.model!));
        if (explicit) return explicit;
      }
      return strategy(req);
    },
  };
}
