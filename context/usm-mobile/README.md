# USM Mobile Context

Living context for the USM mobile/tablet app built with Expo for Android and iOS.

Current mode: planning complete enough to scaffold, but no app has been created yet. Do not scaffold, install dependencies, or write implementation code unless the user explicitly asks.

## Read First

- [Product](product.md): app behavior, screens, routes, and responsive behavior.
- [Architecture](architecture.md): stack, folder structure, FSD adaptation, and UI system.
- [Data](data.md): Convex direction, schema model, queries, mutations, and local dev notes.
- [Tooling](tooling.md): pnpm, Biome, local dev commands, hooks, CI, and EAS policy.
- [Public Safety](public-safety.md): public repo, secrets, environment variables, docs standards, and security guardrails.
- [Open Questions](open-questions.md): useful unresolved decisions that do not block scaffolding.
- [Resources](resources.md): official docs and references.

## Current Decision Snapshot

- App type: task/project manager.
- Platforms: Android and iOS.
- Form factors: phones and tablets.
- Out of scope for now: desktop, MacBook/macOS, web, watch/TV.
- Main surfaces: Todos, Projects, Roadmap.
- Project task stages: Designing, Building, Testing, Completed.
- Initial navigation: bottom tabs for Todos, Projects, Roadmap.
- Initial default tab: Projects.
- Auth: none for MVP; demo/dev data only.
- Backend: Convex.
- Package manager: pnpm.
- UI stack: React Native Reusables + NativeWind, wrapped by app-owned USM UI components.
- Architecture: FSD-inspired structure adapted for Expo Router.
- Code quality: Biome first; ESLint optional later for Expo/React Native-specific rules.
- Repo visibility: public repo is acceptable with strict secret-management guardrails.

## MVP Scope

Build first:

- Create, edit, mark done, and delete/archive standalone todos.
- Create and edit projects.
- Create and edit project tasks.
- Move project tasks through Designing, Building, Testing, Completed.
- Show a manual Roadmap queue across todos and projects.
- Open tasks/projects from the Roadmap to resume work.
- Adapt layouts for phone and tablet.

Out of scope for first build:

- Authentication and protected routes.
- Production or real private data.
- Push notifications.
- Full offline-first sync.
- Custom project stages.
- Automatic production deploys.

## First Implementation Order

1. Scaffold Expo app with TypeScript and pnpm using `usm-mobile` / `USM Mobile`.
2. Add repo safety: `.gitignore`, `.env.example`, README, license placeholder.
3. Add Expo Router route structure and bottom tabs.
4. Add Biome formatting/check setup.
5. Add local dev scripts: `dev`, `dev:backend`, `dev:app`, `dev:ios`, `dev:android`.
6. Add automation baseline: package scripts, Lefthook, GitHub Actions CI.
7. Add USM theme tokens and minimal shared UI primitives.
8. Build static/demo Todos, Projects, and Roadmap screens.
9. Add Convex schema/functions for projects, tasks, roadmap items.
10. Wire screens to Convex dev data.
11. Add responsive phone/tablet adaptations.
12. Run checks and update the public README/route map.

## Expo Snapshot

As of May 24, 2026, Expo is a React Native framework for Android, iOS, and web. Expo SDK 56 was released on May 21, 2026.

Planning implications:

- Prefer Expo managed workflow with TypeScript.
- Prefer development builds for realistic production-style testing.
- Expo Router is the routing default.
- Expo UI can be used selectively for native platform controls, but it is not the primary design system.
- Expo Go is useful for learning if dependencies allow it; move to `expo-dev-client` once native-only modules require it.
