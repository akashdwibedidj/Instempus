# ARCHITECTURE — Instempus

## Layer diagram (strict, dependencies only go downward)

```
pages/
  └── composes feature components, no business logic
components/
  ├── ui/        — design-system primitives (Button, Card, Badge …)
  ├── layout/    — AppShell, Sidebar, BottomNav, RoleGuard
  └── feedback/  — AsyncBoundary, EmptyState, ErrorState, Spinner
features/<name>/
  ├── components/ — UI pieces for this feature
  ├── hooks/      — TanStack Query wrappers (useXxx.ts)
  ├── services/   — ONLY layer that imports supabaseClient
  ├── schemas.ts  — zod schemas
  ├── types.ts    — feature-specific types
  └── index.ts    — public exports (feature manifest + components + hooks)
hooks/           — (none cross-feature; each hook lives inside its feature)
lib/
  ├── supabaseClient.ts
  ├── queryClient.ts
  ├── errors.ts    — AppError type
  └── dates.ts
```

**Rules:**
- Components & pages never import `supabaseClient` directly.
- Features never import each other's internals — only through `index.ts`.
- Static identifiers (routes, permissions, step IDs) live in `src/constants/`.

---

## Feature registry pattern

Every feature exports a manifest from its `index.ts`:
```ts
export const manifest = {
  id: 'gatepass',
  routes: [...],
  navItems: [...],
  allowedRoles: ['student', 'teacher', 'warden', 'security'],
  i18nNamespace: 'gatepass',
};
```
`src/app/featureRegistry.ts` is the only place features are listed.
The router and role-based menus are generated from it at runtime.

---

## Data flow — read path

```
Component
  └── calls hook (useXxx)
        └── TanStack Query
              ├── Dexie (IndexedDB) — returns immediately
              └── supabase service — fetches in background, updates cache
```

## Data flow — write path

```
Component → hook mutation → service
  ├── online  → Supabase directly, response triggers TanStack Query invalidation
  └── offline → write to Dexie outbox → service worker syncs when online
                 UI shows "pending" state until server ACK
```

---

## Notification fan-out

Workflow Engine / Issue Board / Messaging / Notices / Payments
  → events table (DB trigger)
  → Edge Function subscriber
  → Notification Service (push / in-app inbox / SMS fallback)

---

## Application workflow engine (generic)

```
application_types table  ← type definition + JSON form schema
approval_steps table     ← ordered step chain per type
step handler registry    ← one file per step, implements StepHandler interface
workflow engine          ← reads tables, delegates to handler; never has if(type==='leave')
```

Adding a new application type = insert rows into `application_types` + `approval_steps`.
Adding a new approval step = one handler file + one registry line.

---

## Offline / PWA

- vite-plugin-pwa generates the service worker.
- Dexie stores: messages, outbox, notices, issues (read cache).
- Outbox items carry a client-generated UUID (idempotency key).
- Sync worker processes outbox on `online` event and on app foreground.

---

## Org → Groups derivation

Groups are never manually created by users (initially). They are computed from:
- `SectionSlot` → one group per (stream, dept, year, section)
- `Hostel`       → one group per hostel
- `Year`         → one group per (dept, year)

Group membership = live query against `StudentEnrollment` for academic groups,
`HostelRoom` for hostel groups. No membership table to maintain.
