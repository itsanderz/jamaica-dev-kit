# Jamaica Digital

Digital solutions platform for Jamaica's government and public sector.

## What's Inside

### Toolkit Packages (npm + PyPI)

| Package | Description |
|---------|-------------|
| `jamaica` | **Meta-package** — includes all packages below |
| `jamaica-trn` | TRN (Tax Registration Number) validator and formatter |
| `jamaica-parishes` | Jamaica's 14 parishes — data, coordinates, service centers |
| `jamaica-phone` | Phone number validation for +1-876/+1-658 |
| `jamaica-currency` | JMD formatting, parsing, GCT calculations |
| `jamaica-gov-fees` | Government service fees database (10 agencies) |
| `jamaica-addresses` | Informal Jamaican address parser and normalizer |
| `jamaica-constants` | Country codes, timezone, flag colors, national symbols |
| `jamaica-holidays` | Public holidays, business day calculations |
| `jamaica-cli` | CLI tool for quick lookups from the terminal |

### Apps

| App | Description | Port |
|-----|-------------|------|
| `ai-assistant-api` | FastAPI — RAG chatbot for government services | 8001 |
| `ai-assistant-web` | Next.js — WhatsApp-style chat interface | 3000 |
| `addressing-api` | FastAPI — Plus Codes geocoding for Jamaica | 8002 |
| `addressing-web` | Next.js — Interactive map with address generation | 3001 |
| `docs` | VitePress — Developer documentation site | 5173 |

## Getting Started

### Prerequisites

- Node.js 22+
- Python 3.11+
- pnpm 9+
- uv

### Install

```bash
pnpm install
uv sync
```

### Development

```bash
# Run all apps
pnpm dev

# Run specific app
pnpm --filter ai-assistant-web dev

# Run Python API
cd apps/ai-assistant-api && uvicorn app.main:app --reload --port 8001

# Run tests
pnpm test                    # TypeScript tests
uv run pytest                # Python tests
```

### Docker

```bash
cp .env.example .env
# Edit .env with your ANTHROPIC_API_KEY
docker compose up
```

## Project Structure

```
jamaica-digital/
├── apps/                    # Deployable applications
├── packages/                # Shared internal packages
├── toolkit/                 # Published open-source packages
├── data/                    # Structured JSON data
├── docker-compose.yml
├── turbo.json               # Turborepo config
├── pnpm-workspace.yaml
└── pyproject.toml           # Python workspace config
```

## Tech Stack

- **Frontend:** Next.js 15, React 19, Tailwind CSS, MapLibre GL JS
- **Backend:** FastAPI, LangChain, ChromaDB
- **Build:** Turborepo, pnpm, uv
- **AI:** Claude API (Anthropic)

## License

MIT
