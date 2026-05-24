# Product

## Product Model

USM is a personal task and project manager with three main surfaces:

```text
Todos
Projects
Roadmap
```

Tasks can be standalone todos or project tasks.

Standalone todos:

- add
- edit
- mark done
- delete/archive

Projects:

- create/edit project
- open project board
- create/edit project tasks
- move project tasks through fixed stages

Roadmap:

- manual ordered queue/timeline
- includes todos, project tasks, and optionally projects
- helps decide what to do next
- lets the user jump back into a task or project

## Project Workflow

Every project task uses four stages for the MVP:

```text
Designing -> Building -> Testing -> Completed
```

Meanings:

- `Designing`: planning, research, design, or specification.
- `Building`: active implementation or assembly.
- `Testing`: verification, review, QA, or refinement.
- `Completed`: done and lower priority.

## Screens And Routes

```text
/                          -> redirect to /projects
/todos                     -> Standalone Todo List
/todos/new                 -> Create Todo screen or modal
/projects                  -> Projects list
/projects/new              -> Create Project screen or modal
/projects/[projectId]      -> Project Board
/projects/[projectId]/edit -> Project Edit
/tasks/[taskId]            -> Task Detail
/roadmap                   -> Roadmap / Timeline
```

Screen responsibilities:

- Todo List: list standalone todos, quick done/delete actions, open/edit todo.
- Projects: list projects, open project, show simple task summary.
- Project Board: show project tasks grouped by Designing, Building, Testing, Completed.
- Task Detail: inspect/edit task, move stage, mark todo done, delete/archive.
- Project Edit: edit name, description, visual marker later, archive later.
- Roadmap: ordered work queue across todos/projects, quick resume.

## Interaction Model

Task cards/items should be tappable and easy to scan.

Phone movement:

- open task detail or bottom sheet
- choose stage from a picker/action sheet

Tablet movement:

- show multi-column board where space allows
- explore drag-and-drop after basic movement is reliable

Roadmap items:

- ordered
- tappable
- linked to a task/project/note
- designed as a resume surface, not only a calendar

## Responsive Behavior

Phone:

- single-column layouts
- bottom tabs or simple stack navigation
- thumb-friendly primary actions
- bottom sheets for task/project actions
- avoid forcing a four-column board

Tablet:

- richer project lists
- optional list/detail split views
- four project-board columns in landscape if space allows
- roadmap beside current task/project preview if useful

The same workflows must remain available on phones; tablets may show more context but should not introduce a different information architecture.

## Product Non-Goals For MVP

- Authentication.
- Protected routes.
- Multi-user permissions.
- Custom project stages.
- Complex workflow templates.
- Desktop/Mac/web layouts.
- Full offline-first sync.

## Early UX Defaults

- Initial tab: Projects.
- Roadmap: manual queue first, dates later.
- Completed items: keep available but visually lower priority.
- Delete behavior: prefer archive/soft-delete until a hard-delete decision is made.
