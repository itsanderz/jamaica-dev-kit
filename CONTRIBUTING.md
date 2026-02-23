# Contributing to Jamaica Developer Kit

Welcome, and thank you for your interest in contributing to the Jamaica Developer Kit! This monorepo contains the open-source toolkit, apps, and examples that make up Jamaica's digital infrastructure. Every contribution -- whether it's a bug fix, a new feature, improved documentation, or a test -- helps build better software for Jamaica.

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before participating. We are committed to providing a welcoming and inclusive environment for everyone.

## Prerequisites

Before you begin, make sure you have the following installed:

| Tool | Version | Purpose |
|------|---------|---------|
| [Node.js](https://nodejs.org/) | 22+ | TypeScript runtime |
| [pnpm](https://pnpm.io/) | 9.x | Node package manager |
| [Python](https://www.python.org/) | 3.11+ | Python runtime |
| [uv](https://docs.astral.sh/uv/) | latest | Python package manager |

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/jamaica-digital/jamaica.git
cd jamaica
```

### 2. Install dependencies

```bash
# Install Node.js dependencies (all workspaces)
pnpm install

# Install Python dependencies
uv sync
```

### 3. Build all packages

```bash
pnpm build
```

### 4. Run tests

```bash
# TypeScript tests (via Turborepo)
pnpm test

# Python tests
uv run pytest
```

### 5. Run linting

```bash
# TypeScript / JavaScript
pnpm lint

# Python
uv run ruff check .
```

## Repository Structure

```
jamaica-digital/
├── toolkit/                    # Published open-source packages (npm + PyPI)
│   ├── jamaica-trn/
│   │   ├── ts/                 # TypeScript package (published to npm)
│   │   ├── python/             # Python package (published to PyPI)
│   │   └── shared-tests/       # Language-agnostic test fixtures
│   ├── jamaica-phone/
│   ├── jamaica-addresses/
│   ├── jamaica-constants/
│   ├── jamaica-currency/
│   ├── jamaica-tax/
│   ├── jamaica-banks/
│   ├── jamaica-gov-fees/
│   ├── jamaica-parishes/
│   ├── jamaica-places/
│   ├── jamaica-constituencies/
│   ├── jamaica-transport/
│   ├── jamaica-schools/
│   ├── jamaica-health/
│   ├── jamaica-emergency/
│   ├── jamaica-holidays/
│   ├── jamaica-zod/
│   ├── jamaica-react/
│   ├── jamaica-express/
│   ├── jamaica-boj/
│   ├── jamaica-open-data/
│   ├── jamaica-cli/
│   └── jamaica/                # Meta-package that re-exports all packages
│
├── apps/                       # Deployable applications
│   ├── docs/                   # VitePress documentation site (port 5173)
│   ├── ai-assistant-api/       # FastAPI RAG chatbot (port 8001)
│   ├── ai-assistant-web/       # Next.js chat interface (port 3000)
│   ├── addressing-api/         # FastAPI Plus Codes geocoding (port 8002)
│   └── addressing-web/         # Next.js interactive map (port 3001)
│
├── examples/                   # Demo applications
│   ├── checkout-demo/
│   ├── gov-services-portal/
│   ├── parish-dashboard/
│   └── payroll-calculator/
│
├── packages/                   # Shared internal configs
│   ├── eslint-config/          # Shared ESLint configuration
│   ├── tsconfig/               # Shared TypeScript configuration
│   └── ui/                     # Shared UI components
│
├── data/                       # Structured JSON data
├── turbo.json                  # Turborepo configuration
├── pnpm-workspace.yaml         # pnpm workspace configuration
└── pyproject.toml              # Python workspace configuration
```

### Key concepts

- **`toolkit/*/ts`** directories are TypeScript packages published to npm. They are included in the pnpm workspace.
- **`toolkit/*/python`** directories are Python packages published to PyPI. They are managed by uv.
- **`toolkit/*/shared-tests`** directories contain language-agnostic JSON test fixtures used by both the TypeScript and Python implementations to ensure behavioral parity.
- **`apps/*`** are deployable applications (Next.js frontends and FastAPI backends).
- **`examples/*`** are demo applications that showcase how to use the toolkit packages.
- **`packages/*`** are shared internal configurations (ESLint, TypeScript, UI components) consumed by other workspaces.

## Development Workflow

### Branch naming

Use descriptive branch names with one of these prefixes:

- `feat/` -- new features (e.g., `feat/jamaica-schools-search`)
- `fix/` -- bug fixes (e.g., `fix/trn-validation-edge-case`)
- `docs/` -- documentation changes (e.g., `docs/contributing-guide`)
- `chore/` -- maintenance tasks (e.g., `chore/update-dependencies`)
- `refactor/` -- code refactoring (e.g., `refactor/currency-formatting`)

### Making changes

1. Create a new branch from `main`:

   ```bash
   git checkout -b feat/my-feature
   ```

2. Make your changes in the relevant package(s).

3. Run tests to make sure nothing is broken:

   ```bash
   # TypeScript tests
   pnpm test

   # Python tests (if you modified Python code)
   uv run pytest
   ```

4. Run linting:

   ```bash
   # TypeScript / JavaScript
   pnpm lint

   # Python
   uv run ruff check .
   ```

5. Commit your changes and push your branch.

### Running a specific package's tests

```bash
# TypeScript — run tests for a single package
pnpm --filter jamaica-trn test

# Python — run tests for a single package
cd toolkit/jamaica-trn/python && uv run pytest
```

### Running a specific app

```bash
# Start a single app in dev mode
pnpm --filter ai-assistant-web dev

# Start a Python API
cd apps/ai-assistant-api && uvicorn app.main:app --reload --port 8001
```

## Adding a New Package

If you are adding a new toolkit package (e.g., `jamaica-example`):

1. Create the directory structure:

   ```
   toolkit/jamaica-example/
   ├── ts/
   │   ├── src/
   │   │   └── index.ts
   │   ├── package.json
   │   └── tsconfig.json
   ├── python/
   │   ├── jamaica_example/
   │   │   └── __init__.py
   │   ├── tests/
   │   │   └── test_example.py
   │   └── pyproject.toml
   └── shared-tests/
       └── fixtures.json       # Language-agnostic test data
   ```

2. Follow the **shared-tests pattern**: define your test inputs and expected outputs in `shared-tests/fixtures.json`, then import those fixtures in both the TypeScript and Python test suites. This ensures both implementations behave identically.

3. Add the TypeScript package to the pnpm workspace (it should be auto-detected via `toolkit/*/ts` in `pnpm-workspace.yaml`).

4. Add the Python package to the uv workspace in the root `pyproject.toml`.

5. Re-export the new package from the `jamaica` meta-package if appropriate.

6. Add documentation for the new package in `apps/docs/`.

## Pull Request Guidelines

- **Keep PRs small and focused.** Each PR should address a single concern. If you find yourself making unrelated changes, split them into separate PRs.
- **Write tests.** All new functionality should include tests. Bug fixes should include a test that reproduces the bug.
- **Update documentation.** If your change affects the public API or user-facing behavior, update the relevant docs in `apps/docs/`.
- **Add a changeset.** Run `pnpm changeset` to generate a changeset file that describes your changes. This is used to automate versioning and changelogs.
- **Describe your changes.** Fill out the PR template with a clear summary, list of changes, and testing steps.
- **Ensure CI passes.** All tests, linting, and build checks must pass before a PR can be merged.

## Code Style

### TypeScript

- Follow the shared ESLint configuration in `packages/eslint-config/`.
- Run `pnpm lint` to check for issues and `pnpm format` to auto-format.
- Use TypeScript strict mode.
- Prefer named exports over default exports.

### Python

- Follow the [Ruff](https://docs.astral.sh/ruff/) linter and formatter configuration.
- Run `uv run ruff check .` to lint and `uv run ruff format .` to auto-format.
- Use type hints for all public functions.

### General rules

- **No runtime dependencies in toolkit packages.** Toolkit packages (under `toolkit/`) should be zero-dependency to keep them lightweight. Dev dependencies and peer dependencies are fine.
- Write clear, descriptive commit messages.
- Keep functions small and focused.

## Reporting Issues

We use GitHub Issues to track bugs and feature requests. Please use the provided issue templates:

- [Bug Report](https://github.com/jamaica-digital/jamaica/issues/new?template=bug_report.yml) -- for reporting bugs
- [Feature Request](https://github.com/jamaica-digital/jamaica/issues/new?template=feature_request.yml) -- for suggesting new features

Before opening a new issue, please search existing issues to avoid duplicates.

## Questions?

If you have questions or need help, start a discussion on [GitHub Discussions](https://github.com/jamaica-digital/jamaica/discussions).

Thank you for contributing to the Jamaica Developer Kit!
