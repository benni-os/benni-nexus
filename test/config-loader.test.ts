import { describe, expect, it } from 'vitest';
import { ConfigValidationError, validateConfig } from '../src/config/loader.js';

describe('validateConfig', () => {
  it('accepts a valid config and applies defaults', () => {
    const config = validateConfig({
      backends: [{ name: 'local', type: 'ollama', url: 'http://localhost:11434' }],
    });

    expect(config.port).toBe(4000);
    expect(config.logLevel).toBe('info');
    expect(config.strategy).toBe('cheap-first');
    expect(config.backends).toHaveLength(1);
    expect(config.backends[0].name).toBe('local');
  });

  it('keeps explicit values over defaults', () => {
    const config = validateConfig({
      port: 8080,
      strategy: 'failover',
      backends: [{ name: 'groq', type: 'groq', apiKey: 'key' }],
    });

    expect(config.port).toBe(8080);
    expect(config.strategy).toBe('failover');
  });

  it('rejects a config with no backends key', () => {
    expect(() => validateConfig({ port: 4000 })).toThrow(ConfigValidationError);

    try {
      validateConfig({ port: 4000 });
    } catch (err) {
      expect(err).toBeInstanceOf(ConfigValidationError);
      expect((err as ConfigValidationError).issues.join('\n')).toContain('backends');
    }
  });

  it('rejects an empty backends array with a helpful message', () => {
    try {
      validateConfig({ backends: [] });
      expect.unreachable('should have thrown');
    } catch (err) {
      expect(err).toBeInstanceOf(ConfigValidationError);
      expect((err as ConfigValidationError).issues.join('\n')).toContain(
        'At least one backend is required',
      );
    }
  });

  it('rejects an unknown strategy', () => {
    try {
      validateConfig({
        strategy: 'random',
        backends: [{ name: 'local', type: 'ollama' }],
      });
      expect.unreachable('should have thrown');
    } catch (err) {
      expect(err).toBeInstanceOf(ConfigValidationError);
      expect((err as ConfigValidationError).issues.join('\n')).toContain('strategy');
    }
  });

  it('rejects a bad port type', () => {
    try {
      validateConfig({
        port: 'not-a-port',
        backends: [{ name: 'local', type: 'ollama' }],
      });
      expect.unreachable('should have thrown');
    } catch (err) {
      expect(err).toBeInstanceOf(ConfigValidationError);
      expect((err as ConfigValidationError).issues.join('\n')).toContain('port');
    }
  });

  it('rejects an unknown backend type and points at the exact field', () => {
    try {
      validateConfig({
        backends: [{ name: 'oops', type: 'openai-v2' }],
      });
      expect.unreachable('should have thrown');
    } catch (err) {
      expect(err).toBeInstanceOf(ConfigValidationError);
      expect((err as ConfigValidationError).issues.join('\n')).toContain('backends[0].type');
    }
  });
});
