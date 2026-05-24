# Public Safety

## Repository Policy

The repository can be public.

Public-safe:

- app code
- Convex schema/functions
- docs/context
- `.env.example`
- demo/dev fixtures

Never commit:

- `.env`, `.env.local`, `.env.production`
- API secrets
- Convex admin/deploy keys
- EAS tokens
- Apple Developer credentials
- Google Play credentials
- Android signing keystores
- push notification keys
- production exports/backups
- real user/project/task data

Because MVP has no authentication, use demo/dev data only. Do not connect a public no-auth app to sensitive or production data.

## Environment Variables

Allowed public client variable:

```text
EXPO_PUBLIC_CONVEX_URL=
```

Do not put privileged values in `EXPO_PUBLIC_*`.

Rule: if a value can modify production data, administer backend resources, sign builds, or impersonate users, it must never be public and must never be bundled into the app.

## Convex Safety

For no-auth exploration:

- use development data only
- keep mutations intentionally scoped
- avoid deployment URLs connected to real data
- keep `.env.local` out of Git
- keep local Convex deployment state out of Git

Before real data or public testing:

- add authentication or another access-control model
- define server-side authorization in Convex functions
- validate mutation input
- prevent cross-project access once users/workspaces exist

## Mobile Credential Safety

Keep private:

- Android keystores
- Apple signing credentials
- EAS tokens
- service account JSON files
- push notification keys

Use EAS credential management or secure local storage, not Git.

## Automation Safety

- Local hooks must not require secrets.
- CI for fork PRs must not expose secrets.
- EAS tokens and signing credentials must only be available to trusted workflows.
- Production builds require protected branches, manual triggers, labels, or approvals.
- Automated PR comments must never include secrets or private environment values.
- Do not run AI agents automatically on untrusted PR content without explicit security review.

## Public Documentation Standard

The public repo should be easy to understand before opening the code.

Root README should include:

- app purpose
- current status
- tech stack
- setup commands
- local try-it commands
- route map
- architecture overview
- environment variables
- data model summary
- design-system notes
- safety notes

Document important route-facing screens, entities, and features. Avoid over-documenting tiny components.

Useful docs to add once code exists:

```text
src/pages/project-board/README.md
src/features/change-task-stage/README.md
src/entities/task/README.md
```

## License

Still undecided:

- MIT: permissive/open-source.
- Apache 2.0: permissive with patent language.
- No license: public source, but not open-source reusable.
