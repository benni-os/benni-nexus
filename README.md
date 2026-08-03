<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0D0D0D,50:302b63,100:7000FF&height=200&section=header&text=benni-nexus&fontSize=72&fontColor=ffffff&fontAlignY=38&desc=LLM%20Gateway%20for%20the%20Benni%20OS%20Ecosystem%20%E2%80%94%20Route.%20Balance.%20Observe.&descAlignY=58&descSize=16&animation=fadeIn" width="100%"/>

<br/>

<img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=700&size=20&duration=3000&pause=800&color=7000FF&center=true&vCenter=true&multiline=true&repeat=true&width=800&height=80&lines=One+Endpoint.+All+Your+LLMs.+Zero+Hardcoding.;cheap-first+%E2%80%A2+fast-first+%E2%80%A2+quality-first+%E2%80%A2+failover;OpenAI-Compatible+%E2%80%94+Drop-In+for+Any+SDK" alt="Typing SVG" />

<br/><br/>

[![npm](https://img.shields.io/npm/v/benni-nexus?style=for-the-badge&logo=npm&logoColor=white&color=7000FF)](https://www.npmjs.com/package/benni-nexus)
[![CI](https://img.shields.io/github/actions/workflow/status/benni-os/benni-nexus/ci.yml?branch=main&style=for-the-badge&logo=githubactions&logoColor=white&label=CI)](https://github.com/benni-os/benni-nexus/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-00B0FF?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Fastify](https://img.shields.io/badge/Fastify-v5-FF007A?style=for-the-badge&logo=fastify&logoColor=white)](https://fastify.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-00C853?style=for-the-badge&logo=opensourceinitiative&logoColor=white)](LICENSE)
[![Part of Benni OS](https://img.shields.io/badge/Part%20of-Benni%20OS-0D0D0D?style=for-the-badge&logo=githubactions&logoColor=white)](https://github.com/benni-os)

<br/>

> **"One endpoint. All your LLMs. Zero hardcoding."**

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" width="100%"/>

</div>

<br/>

## ⭐ What Is benni-nexus?

**benni-nexus** is the intelligent LLM gateway of the **[Benni OS](https://github.com/benni-os)** ecosystem — a single OpenAI-compatible endpoint that routes, balances, and observes all your LLM backends automatically.

Every production AI stack ends up hardcoding different backends: local Ollama for dev, Groq for speed, OpenAI for quality. `benni-nexus` puts a single intelligent router in front of all of them.

```
Your App / Any SDK (OpenAI, LangChain, LlamaIndex, Vercel AI...)
         ↓ POST /v1/chat/completions (OpenAI-compatible)
    ┌─────────────────────────┐
    │      benni-nexus           │
    │   ┌────────────┐          │
    │   │   Router    │          │
    │   └─────┬─────┘          │
    └──────────│────────────┘
         ┬─────────┬────────┬
    Ollama   Groq    OpenAI   Gemini
   (local)  (fast)  (quality) (multi)
```

<br/>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/dark.png" width="100%"/>

## ⚡ Core Doctrine

> These are not settings. These are architecture laws.

| ☔ Principle | 🔧 Implementation |
|---|---|
| **Single Endpoint** | One `POST /v1/chat/completions` — every backend behind it, no app rewrites |
| **Strategy-Driven Routing** | `cheap-first` · `fast-first` · `quality-first` · `round-robin` · `failover` |
| **OpenAI-Compatible** | Drop-in for any SDK — LangChain, LlamaIndex, Vercel AI, AutoGen, CrewAI |
| **Local-First Option** | Ollama as first-class backend — zero cloud required for dev |
| **Observable by Default** | Prometheus metrics + per-backend health checks (v0.2 roadmap) |
| **Zero Lock-In** | Add or remove backends via config — no code changes, no redeployment |

<br/>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/dark.png" width="100%"/>

## 🚀 Quick Start

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

const res = await client.chat.completions.create({
  model: 'auto', // benni-nexus picks the best backend
  messages: [{ role: 'user', content: 'Explain MCP in one paragraph.' }],
});
```

<br/>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/dark.png" width="100%"/>

## 🎯 Routing Strategies

| Strategy | Description | Best For |
|---|---|---|
| `cheap-first` | Local models first, cloud as fallback | Dev environments, cost-sensitive workloads |
| `fast-first` | Routes to lowest measured P50 latency | Real-time apps, chat UIs |
| `quality-first` | Routes to highest quality-scored backend | Production pipelines, summarization |
| `round-robin` | Even distribution across all backends | Load testing, equal-quality backends |
| `failover` | Primary with automatic fallback chain | High-availability production |

<br/>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/dark.png" width="100%"/>

## ⚙️ Configuration

```json
{
  "port": 4000,
  "strategy": "cheap-first",
  "backends": [
    { "name": "ollama", "type": "ollama", "url": "http://localhost:11434", "models": ["llama3.1:8b", "mistral:7b"] },
    { "name": "groq",   "type": "groq",   "apiKey": "$GROQ_API_KEY" },
    { "name": "openai", "type": "openai", "apiKey": "$OPENAI_API_KEY" },
    { "name": "gemini", "type": "gemini", "apiKey": "$GEMINI_API_KEY" }
  ]
}
```

<br/>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/dark.png" width="100%"/>

## 🔌 Supported Backends

| Backend | Type | Notes |
|---|---|---|
| **Ollama** | `ollama` | Local models — Llama, Mistral, Gemma, Phi, Qwen... |
| **Groq** | `groq` | Ultra-fast inference on Llama, Mixtral |
| **OpenAI** | `openai` | GPT-4o, GPT-4o-mini, o1... |
| **Google Gemini** | `gemini` | Gemini 2.0 Flash, Pro |
| **Anthropic** *(v0.3)* | `anthropic` | Claude 3.5, Claude 4... |
| **Custom** *(v0.3)* | `custom` | Any OpenAI-compatible endpoint |

<br/>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/dark.png" width="100%"/>

## 📊 Observability *(v0.2 roadmap)*

```
GET /metrics

nexus_requests_total{backend="ollama",status="success"} 1420
nexus_requests_total{backend="groq",status="success"} 380
nexus_latency_p50_ms{backend="ollama"} 142
nexus_latency_p50_ms{backend="groq"} 38
```

Prometheus metrics + per-backend health checks + live dashboard — coming in v0.2.

<br/>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/dark.png" width="100%"/>

## 🛠️ Development

```bash
git clone https://github.com/benni-os/benni-nexus
cd benni-nexus
npm install
npm run dev       # ts-node live reload
npm test          # vitest
npm run typecheck # tsc --noEmit
```

<br/>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/dark.png" width="100%"/>

## 🤝 Contributing

All contributions welcome. Check [good first issues](https://github.com/benni-os/benni-nexus/labels/good%20first%20issue) for beginner-friendly tasks.
See [CONTRIBUTING.md](CONTRIBUTING.md) for full guidelines.

<br/>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/dark.png" width="100%"/>

## 🌐 Benni OS Ecosystem

| Product | Repo | Role | Status |
|---|---|---|---|
| 🧠 **Benni Master OS** | [benni-os/Benni-Master-OS](https://github.com/benni-os/Benni-Master-OS) | General Brain — sovereign orchestrator | 🟢 Live |
| ⚡ **Benni Gravity** | [benni-os/Benni-gravity-0](https://github.com/benni-os/Benni-gravity-0) | Local operator runtime | 🟢 Ativo |
| 🔌 **Operator Gateway** | [benni-os/benni-operator-gateway](https://github.com/benni-os/benni-operator-gateway) | Open-source MCP HTTP gateway | 🟢 MIT |
| 🐍 **mcp-forge** | [benni-os/mcp-forge](https://github.com/benni-os/mcp-forge) | FastAPI-style Python MCP framework | 🟢 PyPI |
| ⚡ **benni-nexus** | [benni-os/benni-nexus](https://github.com/benni-os/benni-nexus) | LLM gateway — you are here | 🟢 npm |
| 🛠️ **Benni Control Plane** | MCP on Railway | NEXUS v5 — persistent memory layer | 🟢 Railway |
| 🤖 **JARVAS-2** | [benni-os/jarvas-2](https://github.com/benni-os/jarvas-2) | Autonomous dispatch + Wave 6 billing | 🔥 Hot |
| 🛍️ **Modo Operador** | [benni-os/modo-operador](https://github.com/benni-os/modo-operador) | Produto BR — R$97 | 🟢 Live |

<br/>

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:7000FF,50:302b63,100:0D0D0D&height=120&section=footer" width="100%"/>

<div align="center">

**benni-nexus** — *Open-Source LLM Gateway by [Benni OS](https://github.com/benni-os)*

`SINGLE_ENDPOINT` • `STRATEGY_ROUTING` • `OPENAI_COMPATIBLE` • `LOCAL_FIRST` • `MIT_LICENSE`

Built by [Benni Alencar](https://github.com/nsfwbunny)

</div>
