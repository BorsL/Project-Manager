# Projects Manager App Context

This is the Expo app for Projects Manager. Before changing product behavior,
architecture, data model, or tooling, read `../context/projects-manager/README.md`.

Important boundaries:

- Android and iOS phones/tablets are in scope.
- Auth is intentionally absent for the MVP.
- Convex data is demo/dev only until auth and ownership exist.
- Keep route files thin and put behavior in `src/pages`, `src/widgets`,
  `src/features`, `src/entities`, and `src/shared`.
- Keep the repo public-safe: no secrets, real data, EAS tokens, signing files, or
  `.env.local`.
