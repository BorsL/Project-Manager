# Tooling

## Package Manager

Use pnpm.

Rules:

- Commit exactly one lockfile: `pnpm-lock.yaml`.
- Do not commit `package-lock.json`, `bun.lock`, or `yarn.lock` unless intentionally switching package managers.
- Use `pnpm expo install <package>` for Expo SDK-aware dependencies.
- Use `pnpm add <package>` for regular dependencies.
- Use `pnpm run <script>` for scripts.
- Keep Node.js LTS available.

## Code Quality

Use Biome first:

- formatting
- import organization
- low-noise lint/check baseline

Do not enable aggressive linting at the beginning.

Keep ESLint optional for later if needed for:

- Expo defaults
- React Native-specific rules
- React Hooks rules
- testing-library rules

Conceptual scripts:

```json
{
  "scripts": {
    "format": "biome format --write .",
    "check": "biome check .",
    "typecheck": "tsc --noEmit",
    "doctor": "expo-doctor",
    "verify": "pnpm check && pnpm typecheck && pnpm doctor"
  }
}
```

## Local Try-It Commands

Add scripts so the app can be tried locally with Convex and the simulator/emulator.

Conceptual scripts:

```json
{
  "scripts": {
    "dev": "concurrently -n convex,expo -c cyan,green \"pnpm dev:backend\" \"pnpm dev:app\"",
    "dev:backend": "convex dev",
    "dev:app": "expo start",
    "dev:ios": "expo start --ios",
    "dev:android": "expo start --android",
    "dev:go": "expo start --go",
    "dev:client": "expo start --dev-client",
    "dev:check": "pnpm doctor"
  }
}
```

Preferred local flow:

```bash
pnpm dev
```

Then from Expo terminal UI:

```text
I -> iOS Simulator
A -> Android Emulator
S -> switch Expo Go / development build
```

If Convex is already running:

```bash
pnpm dev:app
```

## Git Hooks

Use Lefthook as the lightweight hook manager.

Conceptual policy:

```text
pre-commit:
  run Biome checks/format hygiene

pre-push:
  run pnpm verify
```

Keep hooks as wrappers around package scripts. Do not hide important behavior in custom hook-only shell logic.

## GitHub Actions CI

Use GitHub Actions for public repo checks.

Required CI checks:

- install with pnpm
- run Biome check
- run TypeScript check
- run tests when tests exist
- run Expo doctor

Conceptual workflow:

```yaml
name: CI

on:
  pull_request:
  push:
    branches: [main]

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v6
      - uses: actions/setup-node@v6
        with:
          node-version-file: .node-version
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm check
      - run: pnpm typecheck
      - run: pnpm doctor
```

Verify exact action versions when implementation begins.

## PR Reporting

Start with GitHub Actions summaries and inline annotations from tools.

Optional later:

- reviewdog for inline PR annotations
- Danger JS for PR policy comments

Do not add automated AI review/comment bots until there is a clear security policy for untrusted PR content.

## EAS / Mobile Build Automation

Use EAS Workflows or EAS Build triggers later for mobile builds, previews, submissions, and OTA updates.

Initial policy:

- no production deploy on push
- no store submit from PRs
- preview builds only on manual trigger, release branch, or explicit label
- production builds only after CI passes
- do not run EAS builds on every push by default
