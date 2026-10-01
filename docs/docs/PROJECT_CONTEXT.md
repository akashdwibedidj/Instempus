# PROJECT_CONTEXT — Instempus

## What
A college campus operations platform replacing paper registers, WhatsApp groups, notice boards,
and gate-pass booklets with one unified system. Built for BPUT Hackathon 2026, Problem 07 (Fretbox).

## Why
Manual processes cause delays, lost records, fake gate passes, and zero audit trails.
Instempus puts every workflow (leave, gate pass, complaints, notices, payments, attendance)
behind a single role-aware app with a full audit log.

## Who uses it
student · teacher · hod · warden · canteen · accounts · security · admin · principal

## Core idea
One generic **Application** object (type + submitter + approver role + status + audit trail)
backs every approval workflow. Application _types_ are data (DB rows), not code branches.

## Stack
| Layer | Choice |
|---|---|
| Frontend | React 18 + Vite + TypeScript strict |
| Styling | Tailwind CSS |
| Routing | react-router v6 |
| Server state | TanStack Query |
| Global state | Zustand (session/role only) |
| Forms | react-hook-form + zod |
| Backend | Supabase (Postgres, Auth, Storage, Realtime, RLS, Edge Functions) |
| Offline | Dexie (IndexedDB) + vite-plugin-pwa service worker |
| i18n | react-i18next (en, hi, or) |
| Tests | Vitest (services, utils, hooks only) |
| Future packaging | Capacitor (Phase 10 only) |

## Key conventions
- Max 150 lines per file (hard cap 200). One component per file. One job per file.
- Layer order: pages → components → hooks → services → lib/supabase
- Services are the ONLY files that import the Supabase client.
- Every feature folder exposes a public API through `index.ts`.
- All user-facing strings via `t('key')`. No magic strings; constants in `src/constants/`.
- Every write (approval, override, status change) triggers an AuditLog row.
- Offline-first: reads from Dexie, writes go to outbox queue, synced when online.

## UI concept
Instagram-inspired layout: Home feed (global notices), DM section (teachers/HOD/warden etc.
as contacts + group chat tab), role-specific dashboard. Mobile-first, dark-mode, glassmorphism.
