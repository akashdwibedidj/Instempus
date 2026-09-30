# PROGRESS — Instempus

Last updated: 2026-09-30 23:30 IST
Current phase: 3 — App Shell & UI Kit (In Progress)
Last completed task: Phase 3, Task 2 — UI Component Kit built: Button (4 variants/3 sizes/loading), Input (label/error/helper/icons), Card (glass-card), Badge (RoleBadge + StatusPill with colour maps), Avatar (5 sizes/initials/role dot), Spinner, Skeleton (shimmer), EmptyState, Modal (Esc+backdrop), Tabs (segmented), OfflineBanner. All wired into AppShell. Zero TS errors.
NEXT STEP (exact): Phase 3, Task 3 — Build the rich Home feed page (`src/pages/HomePage.tsx`): "Important" strip (story bubbles for urgent/pinned), hashtag filter chips row, mock PostCard feed (PostCard component: Avatar + RoleBadge + time + target-group chip + body + Got-it button + seen count), Skeleton loading state, EmptyState when feed is empty.

---

## Overall Roadmap Status

- [x] **Phase 0 — Setup**: Vite + React + TypeScript, Tailwind CSS, project layout, i18n setup, Supabase client singleton, routing shells.
- [x] **Phase 1 — Database**: 20 migrations executed in Supabase (org, users, slots, applications, issues, messaging, payments, attendance, audit, config, RLS policies, onboard RPC, profile RLS recursion fix).
- [x] **Phase 2 — Auth & Roles (COMPLETE & VERIFIED)**:
  - [x] Task 1 — `authService.ts`, `onboardingService.ts` with Supabase client isolation.
  - [x] Task 2 — `sessionStore.ts` (loading | unauthenticated | needs_onboarding | authenticated), `useAuthListener.ts` with deadlock-safe auth state change hydration.
  - [x] Task 3 — Zod validation schemas (`schemas.ts`), `useAuth.ts`, `useOnboarding.ts`.
  - [x] Task 4 — `LoginForm.tsx` (Sign in / Sign up), `StudentOnboardForm.tsx`, `StaffOnboardForm.tsx`, `LanguagePicker.tsx`.
  - [x] Task 5 — `RoleGuard.tsx`, `LoginPage.tsx`, `OnboardingPage.tsx`, placeholder `HomePage.tsx`.
  - [x] Task 6 — Multilingual i18n support (`en.json`, `hi.json`, `or.json`).
  - [x] Task 7 — Database bug fixes:
    - `020_fix_profile_rls_recursion.sql`: Converted `current_user_role()`, `current_user_dept_id()`, `current_user_hostel_id()` to `LANGUAGE plpgsql SECURITY DEFINER` to prevent inlining and 42P17 infinite recursion.
    - Updated `onboard_student` RPC to auto-provision pre-registrations gracefully and seed demo students (`2501CSE001` - `2501CSE020`).
  - [x] Verified live: User onboarding completed and redirected successfully to `/home`.
- [ ] **Phase 3 — App Shell & UI Kit (IN PROGRESS)**:
  - [x] Task 1 — AppShell layout (Instagram-style, Capacitor-ready: 5-tab bottom nav, desktop sidebar lg+, role overrides).
  - [x] Task 2 — UI Component Kit (Button, Input, Card, Badge/RoleBadge/StatusPill, Avatar, Spinner, Skeleton, EmptyState, Modal, Tabs, OfflineBanner).
  - [ ] Task 3 — Rich Home Page (Important strip, hashtag chips, PostCard feed, skeleton loading, mock data).
- [ ] **Phase 4 — Applications Engine**: Multi-step approval workflows (Leave, Gate Pass, Hostel Leave) with QR verification.
- [ ] **Phase 5 — Issues Board**: Upvoting, hostel/canteen scope filtering, duplicate detection.
- [ ] **Phase 6 — Communications**: Department notices, group channels, direct messaging.
- [ ] **Phase 7 — Attendance**: Offline-first attendance logging, geofenced session verification, sync queue.
- [ ] **Phase 8 — Payments**: Fee catalog, receipts, mock payment gateway.
- [ ] **Phase 9 — Analytics & Management**: Admin & Principal analytics overview.

---

## Architectural Decisions & Standards

1. **Auth Service Boundary**: `authService.ts` and `onboardingService.ts` are the ONLY files allowed to import `supabaseClient` inside the auth feature.
2. **Session State Machine**: Four strictly typed statuses: `loading` → `unauthenticated` | `needs_onboarding` | `authenticated`.
3. **Role Elevation Security**: Client never directly updates `profiles.role`. Student onboarding is processed via PostgreSQL `onboard_student` security-definer RPC which guarantees `role = 'student'`.
4. **Database RLS Safety**: All helper functions referenced inside RLS policies are strictly `LANGUAGE plpgsql SECURITY DEFINER` to bypass PostgreSQL function inlining.
5. **Internationalization**: Complete tri-lingual support for English (`en`), Hindi (`hi`), and Odia (`or`).

---

## Recent Milestones

- Fixed PostgreSQL RLS recursion on `public.profiles` (`020_fix_profile_rls_recursion.sql`).
- Resolved duplicate `onboard_student` signatures in PostgREST.
- Pre-seeded `pre_registered_students` table and made onboarding RPC resilient.
- Added "Sign out / Back to Login" button to `OnboardingPage.tsx` to prevent account lock-in.
- End-to-end verification succeeded: user created profile and reached `/home`.
