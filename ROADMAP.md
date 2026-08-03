# Roadmap

## v0.1.x — Foundation (current)

- [x] OpenAI-compatible `/v1/chat/completions`
- [x] Multi-backend: Ollama, OpenAI, Groq, Gemini
- [x] Routing strategies: cheap-first, fast-first, quality-first, round-robin, failover
- [x] CLI: `nexus init`, `nexus start`
- [x] TypeScript strict, Vitest, CI/CD, npm auto-publish
- [ ] Streaming support (`stream: true`)
- [ ] `/v1/models` endpoint
- [ ] Config validation with Zod on startup

## v0.2.0 — Observability

- [ ] Per-backend health checks with auto-disable on failure
- [ ] Prometheus metrics endpoint (`/metrics`)
- [ ] Request latency tracking per backend
- [ ] Web dashboard (read-only) — live traffic + backend status
- [ ] OpenTelemetry tracing

## v0.3.0 — Advanced Routing

- [ ] Task-type classifier — auto-route coding/reasoning/creative to best model
- [ ] Cost tracking per backend with budget limits
- [ ] Rate limiting per API key
- [ ] Multi-tenant support
- [ ] Anthropic backend

## v1.0.0 — Production Grade

- [ ] Stable config API
- [ ] Docker image: `ghcr.io/benni-os/benni-nexus`
- [ ] JARVAS-2 delegation protocol integration
- [ ] Benchmark report vs direct API calls

---

**Want to shape the roadmap?** Open a [Discussion](https://github.com/benni-os/benni-nexus/discussions) or vote on [issues](https://github.com/benni-os/benni-nexus/issues).
