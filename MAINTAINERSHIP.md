# Maintainer Scope

Jamaica Developer Kit is maintained as public infrastructure for developers building software for Jamaica. The maintenance burden is broader than a single package or demo app.

## What Ongoing Maintenance Includes

- Reviewing changes across 21 toolkit packages
- Keeping TypeScript and Python implementations behaviorally aligned
- Updating shared fixtures and regression tests when data or rules change
- Maintaining docs, examples, and GitHub Pages deployment
- Triaging issues about tax rules, identity validation, location data, and public-service references
- Managing release metadata and package publishing workflows

## Why The Work Is Ongoing

Several parts of the toolkit encode domain data and policy-sensitive logic, including:

- payroll and tax calculations
- government fee references
- public holidays and working-day logic
- bank, school, health, and emergency directories
- parish, constituency, and place datasets
- live data integrations

That means maintenance is not only code changes. It also includes data verification, documentation updates, and regression coverage whenever source data or business rules change.

## Repository Surfaces Under Maintenance

- `toolkit/`
- `apps/docs`
- `examples/`
- `.github/workflows/`
- shared test fixtures and CI verification

## Maintainer Goal

The goal is to keep Jamaica-specific developer primitives public, reusable, and production-friendly so developers do not have to reimplement the same country-specific logic in every project.
