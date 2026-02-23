# Changesets

This project uses [Changesets](https://github.com/changesets/changesets) for automated versioning and npm publishing.

## What is a changeset?

A changeset is a description of the changes you made and how they should affect package versions. Each changeset specifies which packages changed and whether those changes are a major, minor, or patch version bump.

## How to add a changeset

When you make a change to any publishable package, run:

```bash
pnpm changeset
```

You will be prompted to:

1. Select which packages have changed
2. Choose a bump type (major / minor / patch) for each
3. Write a summary of the changes

This creates a markdown file in the `.changeset/` directory that gets committed with your PR.

## How releases work

When changesets are merged to `main`, a GitHub Action automatically:

1. Opens a "Version Packages" PR that bumps versions and updates changelogs
2. When that PR is merged, packages are published to npm

You do not need to manually bump versions or publish packages.
