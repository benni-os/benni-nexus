import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { z } from 'zod';
import type { NexusConfig } from './types.js';

const DEFAULTS: Partial<NexusConfig> = {
  port: 4000,
  logLevel: 'info',
  strategy: 'cheap-first',
};

const BackendSchema = z.object({
  name: z.string(),
  type: z.enum(['ollama', 'openai', 'groq', 'gemini', 'anthropic', 'custom']),
  url: z.string().url().optional(),
  apiKey: z.string().optional(),
  models: z.array(z.string()).optional(),
  enabled: z.boolean().optional(),
  latencyP50: z.number().optional(),
  qualityScore: z.number().optional(),
});

const NexusConfigSchema = z.object({
  port: z.number().min(1).max(65535).optional(),
  logLevel: z.enum(['trace', 'debug', 'info', 'warn', 'error']).optional(),
  strategy: z
    .enum(['cheap-first', 'fast-first', 'quality-first', 'round-robin', 'failover'])
    .optional(),
  backends: z.array(BackendSchema).min(1, 'At least one backend is required'),
});

/** Thrown when nexus.config.json fails schema validation. */
export class ConfigValidationError extends Error {
  constructor(public readonly issues: string[]) {
    super(`Invalid nexus.config.json:\n${issues.join('\n')}`);
    this.name = 'ConfigValidationError';
  }
}

function formatPath(path: Array<string | number>): string {
  if (path.length === 0) return '(root)';
  return path.reduce<string>(
    (acc, seg) => (typeof seg === 'number' ? `${acc}[${seg}]` : acc ? `${acc}.${seg}` : String(seg)),
    '',
  );
}

/**
 * Validates a parsed config object against the schema and applies defaults.
 * Throws {@link ConfigValidationError} with one line per problem on failure.
 */
export function validateConfig(raw: unknown): NexusConfig {
  const result = NexusConfigSchema.safeParse(raw);
  if (!result.success) {
    const issues = result.error.issues.map(
      (issue) => `  ${formatPath(issue.path)}: ${issue.message}`,
    );
    throw new ConfigValidationError(issues);
  }
  return { ...DEFAULTS, ...result.data };
}

function fail(lines: string[]): never {
  console.error('\u274c benni-nexus config error:');
  for (const line of lines) {
    console.error(line);
  }
  console.error('');
  console.error('Fix nexus.config.json and restart.');
  process.exit(1);
}

export async function loadConfig(): Promise<NexusConfig> {
  const configPath = resolve(process.cwd(), 'nexus.config.json');
  if (!existsSync(configPath)) {
    return { ...DEFAULTS, backends: [] } as NexusConfig;
  }
  const raw = readFileSync(configPath, 'utf-8');

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    fail([`  nexus.config.json is not valid JSON: ${err instanceof Error ? err.message : String(err)}`]);
  }

  try {
    return validateConfig(parsed);
  } catch (err) {
    if (err instanceof ConfigValidationError) {
      fail(err.issues);
    }
    throw err;
  }
}
