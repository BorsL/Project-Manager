# Open Questions

These are useful to decide soon, but they do not block the MVP scaffold.

## Product

- Is the app personal-only for the foreseeable future, or should team/workspace concepts remain easy later?
- Should todos be promotable into project tasks in MVP?
- Can Roadmap items point to projects directly, or only to tasks/notes?
- After MVP, should the Roadmap remain manual, become date-based, or become a hybrid?
- Should completed items be visible, collapsed, or hidden by default?
- Should delete mean hard delete or archive/soft delete?

## Design

- What visual tone should guide the first UI: calm/productive, technical, playful, minimal, or something else?
- On phone, should the project board use stage tabs, vertical sections, or horizontal swiping?
- On phone, should the Roadmap feel like a timeline, queue, checklist, or agenda?
- Which tablet layout matters most first: phone-like tablet layout or true master-detail?

## Technical

- Should Android and iOS be validated together, or should one simulator/device be the first target?
- Should Convex start as cloud dev deployment or local deployment?
- Should the first local workflow use Expo Go or development builds?
- Does the app need offline-first behavior later?
- Does the app need push notifications later?
- Does it need native features such as camera, files, maps, location, Bluetooth, NFC, or background tasks?
- Does it need SQL-style reporting/export later that might favor Supabase/Postgres?

## Public Repo

- Which license should the public repository use?
- Should the first public README be concise or tutorial-like?
- What demo data is safe to include publicly?
- When should authentication/access control be added before any real data is used?
- Should preview mobile builds be manual-only at first, or triggered by a GitHub label after CI passes?
- Should PR reporting stay with GitHub Actions summaries or add reviewdog/Danger later?
