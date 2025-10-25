Prompt

Part 1 – Setup

Create public repo pokedex via GitHub CLI.

Part 2 – User Story Format
Include: Given/When/Then, Role, Complexity (Fibonacci), Brief desc, Acceptance criteria, Definition of Done.

Requirements
Frontend (Next 15)

Pokédex App:
Login – Form admin/admin only; validate; persist (login state via local db/storage/cookie); protected routes + redirects.
Home – Search + paginated Pokémon list (API); sort by name/number; show img/name/id.
Detail – Click → Pokémon details (abilities/moves/forms).
Design – Follow Figma (mobile-first, responsive, SEO); clean scalable architecture.

Frontend Tech

Atomic Design + JSDoc.

Zustand for state.

Utils/constants/enums in separate files.

Container-Presentational pages.

Unit tests for utils/components.

Backend (Node 24)

Light API (using PokeAPI):

POST /login → auth (admin/admin).

GET /pokemons → paginated list.

GET /pokemons/{id} → details.

Optional extra endpoints.
Use Express; in-memory or SQLite OK.
Add JSDoc to each endpoint.
If using GenAI, include prompts + edits in repo.

GenAI Task (README)

Create TypeScript Table Component for Task Manager with CRUD (title, desc, status, due_date) + user relation.
