# System Architecture — College Social & Administration Platform

> Converted from `SYSTEM_ARCHITECTURE.pdf`.
>
> Visual diagrams have been converted into explicit text diagrams so that language models can parse the architecture without relying on embedded graphics.

## BPUT Hackathon 2026 — Problem Statement 07 (Fretbox)

**Attendance, Mess, Hostel, Repeat: Campus Life, Debugged**

This document supersedes the earlier Instagram-style concept draft. All decisions below reflect the corrected direction: applications/tickets as the core object, scoped issue boards (not a public feed), role-bound slots, and a non-smartphone fallback path.

---

# 1. Overview

This document defines the system architecture for the College Social & Administration Platform: a single working system that replaces the register, the notice boards, the WhatsApp groups, and the paper gate-pass process described in the problem statement.

The architecture is built around one governing idea: almost every feature — leave, gate pass, hostel complaint, registration, notice, payment — is a variation of the same underlying object moving through a role-based approval chain. Model that object once, and every workflow becomes a configuration of it rather than a separate feature to build and maintain.

## 1.1 Design Principles

- One generic Application object (type + submitter + approver role + status + audit trail) backs leave, gate pass, registration, and certificate requests — not four separate features.
- Org membership is data, not hardcoded logic. A student sits in two hierarchies at once — academic (Stream → Dept → Year → Sem → Section) and residential (Hostel → Floor → Room) — and every feature (routing, groups, dashboards) reads from that data live.
- A teacher is bound to a slot (Dept, Year, Section), not to a batch of students. Promotion moves students between slots; it never touches who a teacher is.
- Hostel/canteen complaints are a scoped issue board (visible to everyone in that hostel/canteen group) — not a public Instagram-style feed, and not a private 1:1 ticket either. Leave, gate pass, payments, and notices stay strictly one-to-one (sender, recipient, admin only).
- Every approval, override, and status change is written to an immutable audit log — this is 20% of the evaluation criteria and cannot be an afterthought.
- The system must work with no smartphone and no reliable connection: local-first client storage, an offline send queue with idempotency keys, and an SMS/kiosk channel for students who have neither.

---

# 2. Component Architecture

The platform is organised as a set of focused services sitting behind a single API Gateway, each owning its own data. Every client — phone, laptop, or a shared kiosk device — talks to the same gateway.

## Diagram 1 — High-level component architecture

```text
CLIENT LAYER
┌──────────────────────────────────────────────────────────────────────────┐
│ Student / Teacher / HOD / Warden / Admin App                            │
│ (mobile / web / shared-kiosk device)                                    │
└───────────────┬───────────────────────────┬──────────────────────────────┘
                │                           │
                ▼                           ▼
        ┌──────────────┐          ┌───────────────────┐
        │ Local Cache  │          │ Local Queue       │
        │ text-first   │          │ unsent requests   │
        │ offline      │          │ idempotency key   │
        └──────┬───────┘          └─────────┬─────────┘
               │                            │
               └──────────────┬─────────────┘
                              ▼
              ┌─────────────────────────────────┐
              │ API Gateway + Auth               │
              │ session/JWT validation           │
              │ rate limiting + request routing  │
              └────────────────┬────────────────┘
                               │
        ┌──────────────────────┼───────────────────────────────────────┐
        │                      │                                       │
        ▼                      ▼                                       ▼
┌──────────────┐      ┌──────────────────┐                    ┌────────────────────┐
│ Identity &   │      │ Org Structure    │                    │ Application /       │
│ RBAC         │      │ Service          │                    │ Workflow Engine     │
└──────┬───────┘      └────────┬─────────┘                    └─────────┬──────────┘
       │                       │                                          │
       ▼                       ▼                                          ▼
    Org DB                  Org DB                             Applications/Tickets DB
                                                               + File/Media Store

Other core services:
  ├── Complaint / Issue Board Service
  ├── Messaging (DM + Group)
  ├── Hashtag / Group Engine
  ├── Notice / Targeted Post Service
  ├── Attendance Service
  ├── Payments & Dues Service
  ├── FAQ Chatbot
  ├── AI Duplicate-Request Check
  ├── Notification Service
  └── Admin Dashboard & Analytics

Data stores:
  ├── Org DB
  ├── Applications / Tickets DB
  ├── Complaints DB
  ├── Messages DB
  ├── Payments DB
  ├── File / Media Store
  ├── Search / Index
  └── Audit Log
```

**Diagram meaning:** client layer → API Gateway → focused core services → owned/shared data stores. The Notification Service is a fan-out layer for delivery channels. The Admin Dashboard reads across stores.

---

# 2.1 Client Layer

- **App UI (mobile / web / shared device):** feed, DM, dashboard views per role.
- **Local Cache:** renders text first and works from cached data before a network round trip completes.
- **Local Queue:** holds unsent requests offline; each item carries a client-generated idempotency key so a retried submission never creates a duplicate application.
- **Non-smartphone path:** an SMS gateway plus a kiosk/shared-computer terminal at the hostel and admin office, writing into the same Workflow Engine as the app — this is the explicit answer to the brief's “no smartphone” requirement.

```text
Mobile/Web/Shared Device
        │
        ├── Local Cache
        │      └── text-first/offline reads
        │
        ├── Local Queue
        │      └── unsent requests + idempotency key
        │
        └── Online sync
               │
               ▼
          API Gateway

Non-smartphone:
SMS Gateway ───────┐
                    ├──► API Gateway / Workflow Engine
Kiosk / Shared PC ─┘
```

---

# 2.2 Core Services and Their Data Stores

| Service | Responsibility | Data Store(s) |
|---|---|---|
| Identity & RBAC | Auth, roles, permissions per role | Org DB |
| Org Structure Service | Academic + residential hierarchy, section slots | Org DB |
| Application / Workflow Engine | Generic Application object + approval state machine (leave, gate pass, registration, certificates) | Applications/Tickets DB, File/Media Store |
| Complaint / Issue Board Service | Hostel & canteen issues as a scoped board, not a feed | Complaints DB, File/Media Store |
| Messaging (DM + Group) | Role-bound conversations (this teacher, this section) | Messages DB |
| Hashtag / Group Engine | Groups auto-derived from org structure (never manually created; in future can be created) | Org DB (derived) |
| Notice / Targeted Post Service | Targeted sends with per-recipient read/action tracking | Messages DB |
| Attendance Service | Attendance records, teacher-marked or synced | Applications/Tickets DB |
| Payments & Dues Service | Fee status, screenshot proof, verification state | Payments DB, File/Media Store |
| AI Duplicate-Request Check | Flags likely-duplicate complaints/tickets before creation; issues can also be seen by users so no duplicates | Reads Complaints DB |
| Notification Service | Fan-out to push / in-app inbox / SMS | — |
| FAQ Chatbot | Answers routine questions from a static FAQ + live workflow data | Search/Index |
| Admin Dashboard & Analytics | Pending items, ageing, resolution time, workload per role | Reads across all stores |

---

# 3. Organisation & Slot Model

The org hierarchy is the backbone every other feature derives from.

A student belongs to both:

```text
Academic:
Stream → Dept → Year → Sem → Section

Residential:
Hostel → Floor → Room
```

Hashtag groups, DM routing, and dashboards all read this live rather than each re-deriving it.

The key correction from the earlier draft: a teacher is bound to a slot, not to a batch of students. The slot is `(Dept, Year, Section)`. Whoever currently holds that slot teaches whoever is currently enrolled in it — when a batch promotes from Year 1 to Year 2, they do not carry their teacher with them; they arrive into whichever teacher currently holds the Year 2 slot.

## Diagram 2 — SectionSlot sits between teacher and student

```text
                         SectionSlot
                  (dept_id, year, section)
                       /           \
                      /             \
       binds teacher /               \ binds student
                    /                 \
                   ▼                   ▼
          SlotAssignment          StudentEnrollment
       (teacher_id, slot_id,      (student_id, slot_id,
        academic_year)             academic_year, status)
                   │                   │
                   ▼                   ▼
                Teacher             Student

Promotion:
  Year N enrollment
      │
      ├── close current enrollment
      └── create next-year enrollment
             → Year N+1, same dept + section

Year 4:
  → status = graduated
  → archived/read-only
  → not deleted

Teacher reassignment:
  → change SlotAssignment
  → student records remain unchanged

Downstream consumers of current SectionSlot:
  Groups
  DM routing
  Teacher dashboards
  Attendance
```

- **SectionSlot:** `(dept_id, year, section)` — exists independently of who is teaching or enrolled.
- **SlotAssignment:** links `teacher_id` to `slot_id` for a given `academic_year` — can change yearly or mid-year without touching any student record.
- **StudentEnrollment:** links `student_id` to `slot_id` for a given `academic_year` and status (active / backlog / graduated).
- **Promotion:** scheduled batch job at year-end: close this year's enrollment, open next year's at the next slot. Year-4 students get `status = graduated` and move to a read-only archived state — never deleted, since certificates and history must still be retrievable.
- Because groups, DM routing, dashboards, and attendance all read the current `SectionSlot`, a single promotion event updates every downstream feature with no per-feature update needed.

---

# 4. Notification Fan-out & Offline Sync

Four services — the Workflow Engine, the Complaint/Issue Board, Messaging, and the Notice Service — publish into one Notification Service, which picks a delivery channel per recipient rather than every service reimplementing delivery.

## Diagram 3 — Notification fan-out and offline delivery

```text
Application / Workflow Engine ─┐
Complaint / Issue Board ──────┤
Messaging (DM + Group) ───────┤
Notice / Targeted Post ───────┤
Payments Service ──────────────┘
                 │
                 ▼
       ┌─────────────────────┐
       │ Notification Service│
       └──────────┬──────────┘
                  │
        ┌─────────┼───────────────┐
        ▼         ▼               ▼
      Push     In-app inbox    SMS fallback
   app online   next login     no data connection
        │         │               │
        └─────────┴───────┬───────┘
                          ▼
               Recipient / Student
                          │
                          │ read/action
                          ▼
                 Sending service
                 (receipt tracking)
```

- **Push:** recipient's app is installed and the device is online.
- **In-app inbox:** read next time the recipient opens the app, no push needed.
- **SMS fallback:** recipient has no working data connection; this is the channel the non-smartphone kiosk path also relies on.
- Read/action receipts flow back to the sending service so the sender sees per-recipient delivery and read status.

## 4.1 Offline Message Storage (client-side)

- Every received message is written to a local encrypted store on delivery:
  - SQLite on mobile
  - IndexedDB on web
- Chat history reads from local storage first, so it is available with zero connection; only new messages need a live sync.
- Outgoing messages sit in the Local Queue and show a pending indicator until the server acknowledges them.
- Sync reconciles using each message's server-assigned ID and timestamp so a device reconnecting after an outage never creates duplicates.

```text
Incoming message
      │
      ▼
Local encrypted store
(SQLite / IndexedDB)
      │
      └── Chat opens → local history first

Outgoing message
      │
      ▼
Local Queue
      │
      └── pending
             │
             ▼
        Server ACK
             │
             ▼
          synced

Reconnect:
server-assigned message ID + timestamp
        ↓
deduplication / reconciliation
```

---

# 5. Core Workflows (MVP Scope)

Three workflows are built end-to-end to demonstrate the full architecture without overbuilding the remaining features for a first prototype.

## 5.1 Gate Pass

```text
Student
  │
  │ reason + out-time
  ▼
Workflow Engine
  │
  │ route
  ▼
Assigned Teacher / Warden
  │
  ├── Approve
  │     │
  │     ▼
  │   Time-boxed Digital Pass
  │   QR + validity window
  │     │
  │     ▼
  │   Security scans
  │     │
  │     ▼
  │   Live result:
  │     ├── Valid
  │     ├── Expired
  │     └── Already Used
  │
  └── Decline
```

Student submits reason + out-time → Workflow Engine routes to the assigned Teacher/Warden → Approve/Decline → on approval, a time-boxed digital pass (QR + validity window) is issued to the student → Security scans and gets a live valid/expired/already-used result, closing the “forwarded fake screenshot” gap that a static image leaves open.

## 5.2 Hostel / Canteen Complaint

```text
Student
  │
  │ text/photo
  ▼
AI Duplicate-Check
  │
  ├── Match found
  │      ├── show existing issue
  │      ├── "facing this too" → affected_count + 1
  │      └── comment
  │
  └── No match
         │
         ▼
   Workflow Engine
         │
         ▼
   Scoped Issue Board
   (hostel/canteen group)
         │
         ▼
 Warden / Canteen Staff
         │
         └── Open → In Progress → Resolved
                         │
                         ▼
                  Admin Dashboard
                  ageing + affected-count
```

Student raises an issue with text/photo → AI Duplicate-Check compares it against open issues in the same scope → if a match exists, the student is shown the existing issue and can add “facing this too” or comment instead of filing a duplicate → otherwise a new ticket is created, visible as a shared board to everyone in that hostel/canteen group only → Warden/Canteen staff update status (`Open → In Progress → Resolved`) → Admin dashboard tracks ageing and affected-count across every hostel.

## 5.3 Notice via Hashtag Group

```text
Admin / Teacher / HOD
       │
       │ target group
       ▼
Hashtag / Group Engine
       │
       │ resolve current members
       ▼
Notification Service
       │
       ├── Push
       ├── In-app
       └── SMS fallback
       │
       ▼
Students in group
       │
       └── read/action receipt
              │
              ▼
       Sender sees per-recipient
       delivery + read/action tracking
```

Admin/Teacher/HOD posts a notice targeted at an auto-derived group (e.g. a section or hostel group, never a manually maintained list) → Notification Service resolves the current member list and delivers per recipient → sender sees delivery and read/action tracking per recipient.

### MVP demo pairing

- Admin dashboard shows pending/ageing across all three workflows at once.
- Offline queue works under a throttled connection.
- This is the accessibility deliverable the brief asks for.

---

# 6. Core Data Entities

| Entity | Key Fields | Notes |
|---|---|---|
| User | `id`, `role`, `name`, `phone`, `language_pref` | One account per role; role decides what the UI shows |
| SectionSlot | `id`, `dept_id`, `year`, `section` | Exists independent of who teaches/enrolls |
| SlotAssignment | `id`, `slot_id`, `teacher_id`, `academic_year` | Teacher-to-slot binding, changes yearly |
| StudentEnrollment | `id`, `student_id`, `slot_id`, `academic_year`, `status` | Student-to-slot binding, changes on promotion |
| HostelRoom | `id`, `hostel_id`, `floor`, `room_no`, `warden_id` | Residential hierarchy, separate from academic |
| Application | `id`, `type`, `submitter_id`, `approver_role`, `status`, `unique_code`, `signature_ref`, `created_at` | One generic table for every approval-based workflow |
| Complaint | `id`, `submitter_id`, `target_role`, `scope_id`, `text`, `photo_ref`, `status`, `duplicate_of_id`, `affected_count` | Visible as a board within `scope_id`, not just to submitter and admin |
| IssueComment | `id`, `complaint_id`, `author_id`, `text`, `created_at` | Comments on a Complaint, visible to that issue board |
| Group | `id`, `type`, `auto_derived_from` | Membership computed from org structure, never manual |
| Message | `id`, `group_id / dm_thread_id`, `sender_id`, `text`, `attachment_ref`, `sent_at`, `delivered_at`, `read_at` | Stored client- and server-side for offline read |
| Payment | `id`, `student_id`, `amount`, `proof_ref`, `status`, `verified_by` | Receipt only generated once confirmed by Accounts staff |
| AuditLog | `id`, `actor_id`, `action`, `target_entity`, `target_id`, `before`, `after`, `timestamp` | Every approval and admin override logged here |

---

# 7. Access, Visibility & Roles

- **Roles:** Student, Teacher, HOD, Warden, Canteen Staff, Accounts/Fees Office, Admin.
- Teacher and HOD are separate role types with separate permitted application types:
  - Teacher: simpler registrations.
  - HOD: registration + leave + main approvals.
- **Self-service onboarding:** each user picks their own stream/dept/year/section (or dept, for HOD) at signup — no admin has to manually place anyone in the org tree.
- **Personal correction:** e.g. wrong section → routes to Teacher/HOD for verification before it applies.
- **Structural change:** merge sections, promote a year → admin-only, applied directly, and logged as a privileged action.
- **Visibility is scoped per feature:**
  - Leave: sender, recipient, admin.
  - Gate pass: sender, recipient, admin.
  - Payments: sender, recipient, admin.
  - Notices: sender, recipients, admin.
  - Hostel/canteen issues: shared board for everyone in that hostel/canteen group, never college-wide.
- **Admin sees everything** across every role and every workflow for oversight and the dashboard.

---

# 8. Corrections From the Original Concept

The following elements from the initial Instagram-style concept are intentionally not part of this architecture:

- A public, Instagram-style feed as the primary surface for complaints — replaced with a scoped issue board, because a complaint needs an audit trail and resolution tracking, not likes and comments visible college-wide.
- A shared “Teacher/HOD” role — split into two roles with distinct approval powers.
- Manually created hashtags — replaced with groups auto-derived from the org structure, so membership never drifts out of sync with actual enrollment.
- Payment status flipping to “paid” on screenshot upload alone — replaced with a `Pending Verification` state; a receipt is generated only after Accounts staff confirms against the bank record.
- A teacher permanently tied to a batch of students — replaced with the slot model in Section 3, so promotion and teacher reassignment are independent, low-effort operations.

---

# 9. Adoption & Rollout Note

For a college already running a register, a separate attendance system, and informal WhatsApp groups:

- Org Structure Service is seeded first from existing student/teacher records (a one-time import), after which self-service onboarding takes over for corrections.
- Attendance can start as teacher-marked in-app and later sync from an existing biometric/RFID system once that integration is confirmed — this is flagged as an open question, not assumed.
- Roll out gate pass, hostel complaints, and notices first (the three MVP workflows) since they need the least legacy data to migrate; attendance, payments, and the chatbot follow once the org data import is validated.
- The kiosk/SMS path should go live in parallel with the app from day one, not as a later add-on, since the brief specifically evaluates accessibility readiness.
