# Projects Manager

Expo MVP for Android and iOS phones/tablets. The app manages standalone todos,
project boards, and a manual roadmap for jumping back into active work.

## Stack

- Expo SDK 56, Expo Router, React Native, TypeScript
- Convex for no-auth demo/dev data
- NativeWind with app-owned UI primitives
- Biome, Lefthook, GitHub Actions
- pnpm

## Setup

```bash
pnpm install
cp .env.example .env.local
pnpm dev:backend
```

When Convex finishes configuration, copy the generated public URL into
`.env.local`:

```bash
EXPO_PUBLIC_CONVEX_URL=https://your-dev-deployment.convex.cloud
```

Then run the app:

```bash
pnpm dev:app
```

Or run backend and Expo together:

```bash
pnpm dev
```

## Commands

- `pnpm dev`: run Convex and Expo together
- `pnpm dev:backend`: run Convex dev
- `pnpm dev:app`: run Expo
- `pnpm dev:ios`: open iOS Simulator
- `pnpm dev:android`: open Android Emulator
- `pnpm check`: Biome check
- `pnpm typecheck`: TypeScript check
- `pnpm doctor`: Expo Doctor
- `pnpm verify`: all checks
- `pnpm eas:init`: connect this app to an EAS project
- `pnpm eas:env:preview`: add `EXPO_PUBLIC_CONVEX_URL` to the EAS preview environment
- `pnpm build:preview:android`: create an installable Android APK
- `pnpm build:preview:ios`: create an internal iOS build

## Internal Builds

Use EAS preview builds when you want the app installed on a phone without
running VS Code, Metro, or Expo Go.

First-time setup:

```bash
pnpm eas:init
pnpm eas:env:preview
```

Use the same Convex URL from `.env.local` when `pnpm eas:env:preview` asks for
the value. `EXPO_PUBLIC_CONVEX_URL` is public runtime configuration, but it is
still kept out of Git because this MVP has no authentication yet.

Build Android APK:

```bash
pnpm build:preview:android
```

Build iOS internal distribution:

```bash
pnpm build:preview:ios
```

Android can be installed from the APK link. iOS requires Apple ad hoc device
registration or another Apple-approved testing route; it is not a public App
Store release.

## Routes

- `/` redirects to `/projects`
- `/todos`
- `/todos/new`
- `/projects`
- `/projects/new`
- `/projects/[projectId]`
- `/projects/[projectId]/edit`
- `/tasks/[taskId]`
- `/roadmap`

## Architecture

Route files in `src/app` stay thin. Product screens live in `src/pages`.
Reusable screen blocks live in `src/widgets`. Domain types live in
`src/entities`. App-owned UI, theme tokens, Convex client helpers, and utilities
live in `src/shared`.

The import direction is:

```text
app -> pages -> widgets -> features -> entities -> shared
```

## Data Model

Convex tables:

- `projects`
- `tasks`
- `roadmapItems`

Task scopes:

- `todo`
- `project`

Project task stages:

- `designing`
- `building`
- `testing`
- `completed`

Deletes use soft archive fields for the MVP.

## Public Safety

This repo is designed to be public. Do not commit `.env.local`, secrets, real
user data, EAS tokens, keystores, provisioning profiles, or signing keys. Until
authentication exists, all Convex data should be treated as demo/dev data only.
