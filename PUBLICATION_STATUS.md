# Publication Status

This document tracks the public release state of Jamaica Developer Kit and the remaining work before package publication to npm and PyPI.

## Current Public State

- Public GitHub repository: `itsanderz/jamaica-dev-kit`
- Public documentation: `https://itsanderz.github.io/jamaica-dev-kit/`
- Initial public GitHub release: `v0.1.0`
- CI, docs deployment, and release automation are publicly visible in `.github/workflows/`

## What Is Already Public

- Source code for 20+ Jamaica-focused toolkit packages
- Example applications covering payroll, parishes, checkout, and government-service flows
- GitHub Pages documentation
- Public maintenance backlog and release-readiness issues

## What Is Not Published Yet

- npm packages
- PyPI packages
- Global CLI package distribution

## Why Package Publication Is Still Pending

Package publication is not only a credentials problem. Registry naming needs to be finalized first.

Verified collisions:

- npm: `jamaica` already exists
- npm: `jamaica-parishes` already exists
- PyPI: `jamaica` already exists

That means the first public package release needs a final naming plan before automation can publish safely.

## Public Tracking Issues

- [#2 Prepare first public package release across npm and PyPI](https://github.com/itsanderz/jamaica-dev-kit/issues/2)
- [#4 Resolve registry package-name collisions before first public publish](https://github.com/itsanderz/jamaica-dev-kit/issues/4)

## Next Release-Readiness Steps

1. Finalize npm package names.
2. Finalize PyPI package names.
3. Update docs and examples to match the final naming scheme.
4. Update publish workflows to use the final package names.
5. Enable trusted publishing or token-based publication where appropriate.
6. Publish the first packages and replace planned names with real install commands.

## Maintainer Intent

The goal is to keep the repo public and credible while publication work is still in progress. Until package names and publishing configuration are finalized, the supported way to use the project is from source via the monorepo.
