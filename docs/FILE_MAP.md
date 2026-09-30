# FILE_MAP — Instempus

One line per file. Updated after every task.
Format: `path — purpose`

---

## docs/
```
docs/PROJECT_CONTEXT.md       — what/why/who/stack/conventions (<100 lines)
docs/ARCHITECTURE.md          — layers, data flow, feature registry, offline, groups
docs/DATABASE.md              — tables, columns, RLS summary
docs/PLAN.md                  — phases and tasks with checkboxes
docs/PROGRESS.md              — current state, next step, blockers
docs/FILE_MAP.md              — this file
docs/DECISIONS.md             — assumptions, choices, libraries added
docs/SYSTEM_DESIGN.md         — source spec (read-only reference)
docs/SYSTEM_ARCHITECTURE.md   — source spec (read-only reference)
```

## supabase/  (created in Phase 1)
```
supabase/migrations/001_org.sql              — streams, departments, section_slots, hostels, canteens
supabase/migrations/002_users.sql            — profiles, pre_registered_students
supabase/migrations/003_slots_enrollments.sql — slot_assignments, student_enrollments, hostel_rooms, hostel_assignments
supabase/migrations/004_applications.sql     — application_types, approval_steps, applications, application_step_logs
supabase/migrations/005_issues.sql           — issue_categories, complaints, issue_comments, issue_upvotes
supabase/migrations/006_groups_messages.sql  — groups, group_members, dm_threads, messages, notice_reads
supabase/migrations/007_payments.sql         — fee_items, payments
supabase/migrations/008_attendance.sql       — attendance_sessions, attendance_records
supabase/migrations/009_audit_events.sql     — events, audit_logs
supabase/migrations/010_config.sql           — app_settings, role_permissions, notification_templates
supabase/migrations/011_rls_org.sql          — RLS policies for org tables
supabase/migrations/012_rls_users.sql        — RLS policies for profiles
supabase/migrations/013_rls_applications.sql — RLS policies for applications
supabase/migrations/014_rls_issues.sql       — RLS policies for complaints/issues
supabase/migrations/015_rls_messages.sql     — RLS policies for messages/groups
supabase/migrations/016_rls_payments.sql     — RLS policies for payments
supabase/migrations/017_rls_attendance.sql   — RLS policies for attendance
supabase/migrations/018_rls_audit.sql        — RLS policies for audit_logs/events
supabase/seed.sql                            — demo college data (1 admin, 20 students, etc.)
supabase/seed/config/application_types.json — seed data for application_types + approval_steps
supabase/seed/config/app_settings.json      — seed data for app_settings (escalation timeout, etc.)
supabase/seed/config/issue_categories.json  — seed data for issue_categories
supabase/functions/escalate-applications/index.ts — Edge Function: scheduled escalation checker
supabase/functions/verify-gatepass/index.ts        — Edge Function: guard QR scan verification
supabase/functions/notify/index.ts                 — Edge Function: notification fan-out subscriber
```

## src/  (created Phase 0–onwards)
```
src/main.tsx                      — React entry point (imports src/app/App.tsx)
src/app/App.tsx                   — root component: <Providers> + <AppRouter>
src/app/router.tsx                — createBrowserRouter built from featureRegistry
src/app/providers.tsx             — QueryClientProvider + i18n side-effect init
src/app/featureRegistry.ts        — FeatureManifest[] registry; routes added per feature

src/config/env.ts                 — typed env variable access
src/config/features.ts            — feature flags (on/off)
src/config/navigation.ts          — nav builder from featureRegistry + user role

src/constants/roles.ts            — role string literals
src/constants/permissions.ts      — permission key constants + role→permissions map
src/constants/statuses.ts         — application/issue/payment status literals
src/constants/routes.ts           — route path constants

src/lib/supabaseClient.ts         — Supabase client singleton
src/lib/queryClient.ts            — TanStack Query client config
src/lib/errors.ts                 — AppError type + error helpers
src/lib/dates.ts                  — date utilities (format, diff, isExpired)

src/types/database.ts             — generated Supabase types (auto-generated)
src/types/shared.ts               — shared types not tied to a single feature

src/components/ui/Button.tsx      — design-system Button
src/components/ui/Input.tsx       — design-system Input
src/components/ui/Card.tsx        — design-system Card
src/components/ui/Badge.tsx       — design-system Badge
src/components/ui/Modal.tsx       — design-system Modal
src/components/ui/Tabs.tsx        — design-system Tabs
src/components/ui/Table.tsx       — design-system Table
src/components/ui/Avatar.tsx      — design-system Avatar
src/components/layout/AppShell.tsx    — main layout wrapper
src/components/layout/Sidebar.tsx     — desktop sidebar nav
src/components/layout/BottomNav.tsx   — mobile bottom navigation
src/components/layout/RoleGuard.tsx   — renders children only if role has permission
src/components/feedback/AsyncBoundary.tsx — ErrorBoundary + Suspense combo
src/components/feedback/EmptyState.tsx    — empty list/data state
src/components/feedback/ErrorState.tsx    — error display
src/components/feedback/Spinner.tsx       — loading spinner

src/features/auth/index.ts        — public exports + manifest
src/features/org/index.ts         — public exports + manifest
src/features/applications/index.ts — public exports + manifest
src/features/gatepass/index.ts    — public exports + manifest
src/features/issues/index.ts      — public exports + manifest
src/features/messaging/index.ts   — public exports + manifest
src/features/notices/index.ts     — public exports + manifest
src/features/attendance/index.ts  — public exports + manifest
src/features/payments/index.ts    — public exports + manifest
src/features/chatbot/index.ts     — public exports + manifest
src/features/admin/index.ts       — public exports + manifest

src/offline/dexieDb.ts            — Dexie database schema
src/offline/outbox.ts             — outbox queue helpers
src/offline/syncWorker.ts         — background sync logic

src/i18n/index.ts                 — i18next setup
src/i18n/locales/en.json          — English strings
src/i18n/locales/hi.json          — Hindi strings
src/i18n/locales/or.json          — Odia strings
```

---

> Files added during Phase 1+ will be appended here by the agent after each task.
