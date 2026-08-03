<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0f0c29,50:302b63,100:24243e&height=200&section=header&text=benni-nexus&fontSize=72&fontColor=ffffff&fontAlignY=38&desc=LLM%20Gateway%20for%20the%20Benni%20OS%20Ecosystem&descAlignY=58&descSize=18" width="100%"/>

[![CI](https://github.com/benni-os/benni-nexus/actions/workflows/ci.yml/badge.svg)](https://github.com/benni-os/benni-nexus/actions)
[![npm version](https://img.shields.io/npm/v/benni-nexus?style=flat-square&color=CB3837&logo=npm)](https://www.npmjs.com/package/benni-nexus)
[![License: MIT](https://img.shields.io/badge/License-MIT-22c55e?style=flat-square)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node](https://img.shields.io/badge/Node.js-%E2%89%A520-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![Fastify](https://img.shields.io/badge/Fastify-v5-000000?style=flat-square&logo=fastify)](https://fastify.dev)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square)](CONTRIBUTING.md)

**Route. Balance. Observe. All your LLMs from a single endpoint.**

[Quick Start](#-quick-start) · [Configuration](#%EF%B8%8F-configuration) · [Routing Strategies](#-routing-strategies) · [Roadmap](ROADMAP.md) · [Contributing](CONTRIBUTING.md)

</div>

---

## ✨ Why benni-nexus?

Every production AI stack ends up solving the same problem: **you have multiple LLM backends and every app hardcodes a different one**. Local Ollama for dev, Groq for speed, OpenAI for quality, Gemini for multimodal. You end up with configuration scattered across a dozen services.

`benni-nexus` is the **single intelligent gateway** that sits in front of all of them. One endpoint, one config file, one place to add a new model.

```
                    ┌────────────────────────┐
                    │                        │
  Your App  ►►►►►►►►►  POST /v1/chat/completions  │
                    │                        │
  Any SDK    ►►►►►►►►  (OpenAI-compatible)     │
  (OpenAI,           │                        │
   LangChain,        │      benni-nexus        │
   LlamaIndex...)    │    ┌────────────┐    │
                    │    │   Router    │    │
                    │    └─────┬─────┘    │
                    └──────────┼───────────┘
                               │
           ┌───────────┼───────────┐
           │          │           │          │
    ▼              ▼             ▼          ▼
 ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐
 │Ollama│  │ Groq │  │OpenAI│  │Gemini│
 │(local)│  │(fast)│  │(qual.)│ │(multi)│
 └──────┘  └──────┘  └──────┘  └──────┘
```

---

## ⚡ Quick Start

```bash
# Install globally
npm install -g benni-nexus

# Generate config
nexus init

# Start the gateway
nexus start
# ⚡ benni-nexus running on http://localhost:4000
```

Now **any** OpenAI-compatible client works out of the box:

```typescript
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'http://localhost:4000/v1',
  apiKey: 'nexus', // any string
});

// benni-nexus picks the best backend automatically
const res = await client.chat.completions.create({
  model: 'auto',
  messages: [{ role: 'user', content: 'Explain MCP in one paragraph.' }],
});

console.log(res.choices[0].message.content);
```

> Works with **LangChain**, **LlamaIndex**, **Vercel AI SDK**, **AutoGen**, **CrewAI** — anything that speaks OpenAI.

---

## ⚙️ Configuration

Run `nexus init` to generate `nexus.config.json`:

```json
{
  "port": 4000,
  "strategy": "cheap-first",
  "backends": [
    {
      "name": "ollama",
      "type": "ollama",
      "url": "http://localhost:11434",
      "models": ["llama3.1:8b", "mistral:7b"]
    },
    {
      "name": "groq",
      "type": "groq",
      "apiKey": "$GROQ_API_KEY"
    },
    {
      "name": "openai",
      "type": "openai",
      "apiKey": "$OPENAI_API_KEY"
    },
    {
      "name": "gemini",
      "type": "gemini",
      "apiKey": "$GEMINI_API_KEY"
    }
  ]
}
```

---

## 🎯 Routing Strategies

| Strategy | Description | Best for |
|---|---|---|
| `cheap-first` | Local models first, cloud as fallback | Dev environments, cost-sensitive workloads |
| `fast-first` | Routes to lowest measured P50 latency | Real-time apps, chat UIs |
| `quality-first` | Routes to highest quality-scored backend | Production pipelines, summarization |
| `round-robin` | Even distribution across all backends | Load testing, equal-quality backends |
| `failover` | Primary with automatic fallback chain | High-availability production |

### Explicit model routing

Pass a specific model name and benni-nexus routes directly to the backend that declares it:

```typescript
// Routes to whichever backend has 'llama3.1:8b' in its models[]
await client.chat.completions.create({
  model: 'llama3.1:8b',
  messages: [...]
});
```

---

## 🔌 Supported Backends

| Backend | Type | Notes |
|---|---|---|
| **Ollama** | `ollama` | Local models — Llama, Mistral, Gemma, Phi, Qwen... |
| **Groq** | `groq` | Ultra-fast inference on Llama, Mixtral |
| **OpenAI** | `openai` | GPT-4o, GPT-4o-mini, o1... |
| **Google Gemini** | `gemini` | Gemini 2.0 Flash, Pro |
| **Anthropic** *(coming in v0.3)* | `anthropic` | Claude 3.5, Claude 4... |
| **Custom** *(coming in v0.3)* | `custom` | Any OpenAI-compatible endpoint |

---

## 🧱 Part of the Benni OS Ecosystem

`benni-nexus` is a core infrastructure component of the **[Benni OS](https://github.com/benni-os)** — an open-source operating system for autonomous AI agents.

| Project | Description | Status |
|---|---|---|
| [**mcp-forge**](https://github.com/benni-os/mcp-forge) | FastAPI-style framework for building MCP servers | ✅ stable |
| [**benni-nexus**](https://github.com/benni-os/benni-nexus) | LLM gateway and intelligent router | ✅ stable |
| **agent-memory** *(coming soon)* | Vector memory system for AI agents | 🛠️ building |
| **vidgen-pipeline** *(coming soon)* | AI video generation pipeline | 🛠️ planned |

---

## 📊 Observability *(v0.2 roadmap)*

Upcoming in v0.2: built-in Prometheus metrics, per-backend health checks, and a live dashboard.

```
GET /metrics

nexus_requests_total{backend="ollama",status="success"} 1420
nexus_requests_total{backend="groq",status="success"} 380
nexus_latency_p50_ms{backend="ollama"} 142
nexus_latency_p50_ms{backend="groq"} 38
```

---

## 🚀 Deploy

```bash
# Docker (coming in v1.0)
docker run -p 4000:4000 \
  -v $(pwd)/nexus.config.json:/app/nexus.config.json \
  ghcr.io/benni-os/benni-nexus

# Railway / Fly.io (coming in v0.3)
nexus deploy --target railway
```

---

## 🛠️ Development

```bash
git clone https://github.com/benni-os/benni-nexus
cd benni-nexus
npm install
npm run dev       # ts-node live reload
npm test          # vitest
npm run typecheck # tsc --noEmit
```

---

## 🤝 Contributing

All contributions welcome. Check [good first issues](https://github.com/benni-os/benni-nexus/labels/good%20first%20issue) for beginner-friendly tasks.

See [CONTRIBUTING.md](CONTRIBUTING.md) for full guidelines.

---

## 📝 License

MIT © [Benni Alencar](https://github.com/benni-os)

---

<div align="center">

<sub>Built with ⚡ as part of the <a href="https://github.com/benni-os">Benni OS</a> open-source ecosystem</sub>

</div>
