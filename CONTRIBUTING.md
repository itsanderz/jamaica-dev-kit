# Contributing to Jamaica Developer Kit

Thanks for contributing to Jamaica Developer Kit. This repository maintains a public toolkit for building Jamaica-focused software across TypeScript and Python.

Please read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) before participating.

## Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| [Node.js](https://nodejs.org/) | 22+ | TypeScript tooling |
| [pnpm](https://pnpm.io/) | 9.x | Workspace package manager |
| [Python](https://www.python.org/) | 3.11+ | Python tooling |
| [uv](https://docs.astral.sh/uv/) | latest | Python dependency management |

## Getting Started

```bash
git clone https://github.com/itsanderz/jamaica-dev-kit.git
cd jamaica-dev-kit
pnpm install
uv sync
```

## Repository Structure

```text
jamaica-dev-kit/
|-- toolkit/         # Public toolkit packages
|-- apps/            # Docs and deployable apps
|-- examples/        # Demo applications
|-- packages/        # Shared internal configs
|-- tests/           # E2E and shared verification
|-- .github/         # CI, release, and community workflows
```

Key conventions:

- `toolkit/*/ts` contains TypeScript packages published through the pnpm workspace.
- `toolkit/*/python` contains Python packages managed through the uv workspace.
- `toolkit/*/shared-tests` stores fixtures shared across language implementations.
- `apps/docs` is the public documentation site deployed to GitHub Pages.

## Development Workflow

Run the main checks before opening a pull request:

```bash
pnpm build
pnpm test
pnpm lint
pnpm typecheck
uv run pytest
uv run ruff check .
```

If you changed docs, also verify the docs build:

```bash
pnpm --filter docs build
```

If you changed a specific toolkit package, prefer targeted checks as well:

```bash
pnpm --filter jamaica-trn test
cd toolkit/jamaica-trn/python
uv run pytest
```

## Pull Requests

- Keep pull requests focused on one concern.
- Add or update tests for behavior changes.
- Update docs for any public API change.
- Add a changeset for versioned package changes with `pnpm changeset`.
- Use clear commit messages and include validation steps in the PR description.

## Reporting Problems

Use GitHub Issues for bugs and feature requests:

- [Open an issue](https://github.com/itsanderz/jamaica-dev-kit/issues)

Please search existing issues before opening a new one.

## Questions

If something is unclear, open an issue with context and reproduction details so it can be triaged.
