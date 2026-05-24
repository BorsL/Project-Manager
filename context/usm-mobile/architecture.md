# Architecture

## Stack

- Expo managed workflow.
- React Native.
- TypeScript.
- Expo Router.
- pnpm.
- Convex.
- React Native Reusables + NativeWind.
- Biome first; optional ESLint later.
- Android/iOS phones and tablets.
- No authentication or protected routes for MVP.

## Project Shape

```text
usm-mobile/
  README.md
  src/
    app/
      _layout.tsx
      index.tsx
      todos/
        index.tsx
        new.tsx
      projects/
        index.tsx
        new.tsx
        [projectId].tsx
        [projectId]/
          edit.tsx
      tasks/
        [taskId].tsx
      roadmap/
        index.tsx
    pages/
    widgets/
    features/
    entities/
    shared/
      ui/
      theme/
      api/
      config/
      icons/
      lib/
      types/
  assets/
  app.json
  package.json
  pnpm-lock.yaml
```

## FSD-Inspired Layers

Expo Router owns routing. FSD-style folders own product structure.

Import direction:

```text
app -> pages -> widgets -> features -> entities -> shared
```

Layer responsibilities:

- `src/app`: route files, layouts, providers, redirects.
- `src/pages`: screen compositions used by routes.
- `src/widgets`: large screen blocks composed from features/entities/shared.
- `src/features`: user actions such as create task, change stage, complete task.
- `src/entities`: domain concepts such as project, task, roadmap item.
- `src/shared`: app-agnostic UI, theme, Convex client setup, utilities, config.

Keep route files thin. Example:

```text
src/app/projects/[projectId].tsx
  imports -> src/pages/project-board/ui/project-board-screen.tsx
```

## Feature Examples

```text
src/features/create-task/
src/features/edit-task/
src/features/delete-task/
src/features/change-task-stage/
src/features/create-project/
src/features/edit-project/
src/features/reorder-roadmap/
```

Entity UI examples:

```text
src/entities/task/ui/task-card.tsx
src/entities/task/ui/stage-pill.tsx
src/entities/project/ui/project-card.tsx
src/entities/roadmap/ui/roadmap-item.tsx
```

## USM Design System Layer

The USM design system is the app-owned UI foundation, not a third-party library.

Use React Native Reusables as copy-owned component seeds, NativeWind as styling, and expose USM-owned components from:

```text
src/shared/ui
src/shared/theme
```

Recommended shared UI:

```text
button/
icon-button/
input/
textarea/
card/
badge/
tabs/
sheet/
dialog/
list-row/
empty-state/
screen-header/
```

Recommended theme tokens:

```text
colors.ts
spacing.ts
radius.ts
typography.ts
shadows.ts
motion.ts
tokens.ts
```

Rules:

- Feature code imports USM components, not raw UI kit components.
- NativeWind utility classes may live inside owned components and layouts.
- Extract repeated UI patterns into `shared/ui`.
- Domain UI belongs in `entities/*/ui` once it knows about product concepts.
- Action UI belongs in `features/*/ui`.
- Use Expo UI selectively for native controls where it clearly improves the experience.

## Naming And Documentation Rules

Prefer product names:

- `project-board`
- `task-detail`
- `change-task-stage`
- `create-project`
- `roadmap-item`
- `stage-column`

Avoid vague names:

- `manager`
- `container`
- `helper`
- `misc`
- `common`
- `stuff`

Public repo documentation should include route maps, screen responsibilities, setup commands, environment variables, design-system notes, and database model summary.

## Platform Notes

- Current scope: Android phones/tablets and iPhone/iPad.
- Out of scope: desktop, MacBook/macOS, web, watch/TV.
- Use Expo Go only while dependencies allow it.
- Use development builds for production-like testing and native-only modules.
