# DECISIONS — Instempus

All assumptions, design choices, and library additions are recorded here.
Format: `[date] — [topic]: [decision] — [rationale]`

---

## Roles & access

**2026-09-29 — Principal role:**
Principal is treated as a read-only, elevated-analytics role with final escalation approval power.
Self-registers via admin invite only. Cannot modify org structure.
_Rationale:_ spec said "principal" in the roles list but didn't define behaviour; closest real-world
analogy is "college director who can see everything and unblock final escalations."

**2026-09-29 — Security role:**
Security guards see ONLY the gate pass QR verification screen. No other data visible.
_Rationale:_ minimal surface area reduces privacy risk and simplifies RLS.

**2026-09-29 — Teacher vs HOD:**
Teacher handles: simple registrations, leave approval, attendance marking.
HOD handles: main registration (semester), leave escalations, department-wide notices.
These are two distinct roles, not one with a flag.
_Rationale:_ SYSTEM_DESIGN.md §3a explicitly states "Teacher and HOD are separate role types."

---

## Onboarding

**2026-09-29 — Student onboarding:**
Students self-register only if their roll number exists in `pre_registered_students`.
The roll number lookup is done before Supabase Auth `signUp` is called.
_Rationale:_ prevents open registration; admin bulk-uploads the pre-reg list each year.

**2026-09-29 — Staff onboarding:**
Teacher, HOD, warden, canteen, accounts, security accounts are created by admin only
(admin issues an invite link or creates the account directly).
_Rationale:_ spec §5; "Teacher/staff onboarding by admin."

---

## Digital signature

**2026-09-29 — Signature approach:**
Using a drawn/typed signature image stored in Supabase Storage for the prototype.
Not legally binding. Flagged as a gap — production would need OTP-based approval.
_Rationale:_ SYSTEM_DESIGN.md §3 flags this explicitly as undefined; keeping simple for hackathon.

---

## Attendance source

**2026-09-29 — Attendance marking:**
Teacher marks attendance in-app manually. Biometric/RFID sync is a future integration.
_Rationale:_ SYSTEM_DESIGN.md §3 says "Attendance source is unspecified … must be decided before building."
Teacher-in-app is the simplest default that works without external hardware.

---

## UI / UX

**2026-09-29 — App layout:**
Instagram-inspired: bottom nav with Home (global notices feed), DM (contacts + group tab),
Applications, and a role-specific Dashboard tab. Mobile-first, dark mode with glassmorphism.
_Rationale:_ user explicitly requested Instagram-style layout in the brief.

---

## Non-smartphone path

**2026-09-29 — SMS / kiosk:**
Marked as Phase 10 (hardening) for the hackathon. Architecture and DB are designed to support it
(same Workflow Engine receives requests from any channel), but the SMS gateway and kiosk UI
are not built in Phases 0–9.
_Rationale:_ time-box constraint; the core architecture accommodates it without a rewrite.

---

## Extensibility

**2026-09-29 — Lookup tables over Postgres enums:**
Application statuses, issue statuses, group types, and step IDs use `text` columns with check
constraints (managed by migrations), not Postgres enums.
_Rationale:_ adding a new value requires only a migration ALTER, not an enum rebuild; matches
§7A "Lookup tables instead of enums."

---

## Libraries added (one line each)

| Library | Why | Date |
|---|---|---|
| `qrcode.react` | Client-side QR code generation for gate passes (no server round trip) | 2026-09-29 |
| `@react-pdf/renderer` | Generate signed application PDF in browser | 2026-09-29 |
| `date-fns` | Date arithmetic (escalation timeout, gate pass validity window) | 2026-09-29 |
| `lucide-react` | Icon library — lightweight, tree-shakeable, TS types included | 2026-09-29 |
| `browser-image-compression` | Compress screenshots before upload (low-bandwidth requirement) | 2026-09-29 |
| `jose` | Sign / verify gate pass JWT tokens in Edge Functions | 2026-09-29 |
