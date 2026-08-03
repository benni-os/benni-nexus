# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- Zod schema validation for `nexus.config.json` on startup — invalid configs now fail fast with a clear, field-by-field error message and exit code 1 instead of cryptic runtime errors (#9)

## [0.1.0] — 2026-08-02

### Added
- OpenAI-compatible `/v1/chat/completions` endpoint (Fastify v5)
- Multi-backend routing: Ollama, OpenAI, Groq, Gemini
- Routing strategies: `cheap-first`, `fast-first`, `quality-first`, `round-robin`, `failover`
- Explicit model routing via `models[]` config
- CLI: `nexus init`, `nexus start`
- `GET /health` endpoint
- TypeScript strict mode, Vitest test suite
- GitHub Actions CI — Node.js 20 + 22, format, lint, typecheck, build, auto-publish to npm
- Dependabot for npm and GitHub Actions
- Issue templates, PR template, ROADMAP, CONTRIBUTING, LICENSE
