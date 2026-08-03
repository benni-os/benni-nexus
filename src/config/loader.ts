import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import type { NexusConfig } from './types.js';

const DEFAULTS: Partial<NexusConfig> = {
  port: 4000,
  logLevel: 'info',
  strategy: 'cheap-first',
};

export async function loadConfig(): Promise<NexusConfig> {
  const configPath = resolve(process.cwd(), 'nexus.config.json');
  if (!existsSync(configPath)) {
    return { ...DEFAULTS, backends: [] } as NexusConfig;
  }
  const raw = readFileSync(configPath, 'utf-8');
  const parsed = JSON.parse(raw) as NexusConfig;
  return { ...DEFAULTS, ...parsed };
}
