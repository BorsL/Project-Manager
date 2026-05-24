# Data

## Backend Decision

Use Convex for the MVP.

Why Convex fits:

- The app is live state: tasks, stages, roadmap, resume context.
- Convex queries/mutations are TypeScript-first.
- Query results update reactively without manual cache invalidation.
- It avoids early REST/ORM/API boilerplate.
- Expo has official Convex guidance.

Supabase remains a future alternative if the project becomes SQL/reporting/storage-heavy.

## Convex vs Supabase Summary

Convex is not "just NoSQL." It is document-relational: tables, document IDs, relationships, indexes, ACID transactions, and serializable isolation.

The key difference:

```text
Supabase = direct Postgres / SQL platform
Convex = reactive document-relational backend accessed through TypeScript functions
```

Use Convex for:

- reactive task state
- live lists grouped by stage
- TypeScript backend logic
- fast product iteration
- simple-to-medium relational needs

Use Supabase if the app strongly needs:

- direct Postgres/SQL control
- relational reporting and analytics
- Postgres extensions
- mature SQL migrations/admin workflows
- established Supabase auth/storage patterns

## Conceptual Schema

### `projects`

Represents a project the user is managing.

Fields:

- `name`
- `description`, optional
- `status`: active, archived
- `color`, optional
- `sortOrder`, optional
- `lastOpenedAt`
- `createdAt`
- `updatedAt`

### `tasks`

Represents either a standalone todo or a project task.

Fields:

- `ownerId`, future/optional if auth is added
- `projectId`, optional for standalone todos
- `scope`: todo, project
- `title`
- `description`, optional
- `status`: todo, active, done, archived, deleted
- `stage`: designing, building, testing, completed; optional for standalone todos
- `priority`, optional
- `dueAt`, optional
- `completedAt`, optional
- `deletedAt`, optional
- `lastOpenedAt`
- `createdAt`
- `updatedAt`

### `taskSteps`

Optional detail layer for tasks with multiple internal steps.

Fields:

- `taskId`
- `title`
- `description`, optional
- `position`
- `state`: todo, active, done, skipped, blocked
- `stage`, optional
- `completedAt`, optional
- `createdAt`
- `updatedAt`

### `roadmapItems`

Ordered work queue across standalone todos and projects.

Fields:

- `taskId`, optional
- `projectId`, optional
- `title`, optional override
- `kind`: task, project, note
- `position`
- `status`: planned, current, done, skipped, archived
- `scheduledFor`, optional
- `resumeContext`, optional
- `createdAt`
- `updatedAt`

### Future Tables

Add later only when needed:

- `users`
- `taskEvents`
- `taskViews`
- `workflowTemplates`

## Query Patterns

- List projects by status/lastOpenedAt.
- List standalone todos by status/updatedAt.
- List tasks for a project grouped by stage.
- Get task detail with optional steps.
- Get project board summary.
- Get roadmap items in planned order.
- Get current/next roadmap item.
- Search tasks by title/body later.

## Mutation Patterns

- Create/edit/archive project.
- Create/edit/delete/archive standalone todo.
- Mark standalone todo done.
- Create/edit/delete/archive project task.
- Change project task stage.
- Add/reorder/complete task steps later.
- Add task/project/note to roadmap.
- Reorder roadmap items.
- Mark roadmap item done/skipped.
- Update `lastOpenedAt` when opening a task/project.

## Local Convex Development

After the Expo app exists:

```bash
pnpm add convex
pnpm exec convex dev
```

`convex dev` creates the backend folder, generates types, and keeps functions synced while it runs.

Development options:

- Cloud dev deployment: easiest path; requires Convex account/project.
- Local deployment: runs Convex locally; useful for avoiding a cloud account early, currently beta.

Local mode commands:

```bash
pnpm exec convex deployment select local
pnpm exec convex dev
```

Switch back:

```bash
pnpm exec convex deployment select dev
```

Expo client env:

```text
EXPO_PUBLIC_CONVEX_URL=
```

Never commit `.env.local`.

## Offline Note

Convex handles realtime sync and network interruptions, but it is not a full local-first offline database. If the app later needs robust offline creation/editing for long disconnected periods, add a deliberate local database and sync queue.

For MVP, assume online-first dev/demo usage.
