# College Social & Administration Platform — System Design

> Converted from `SYSTEM_DESIGN.pdf`.
>
> Visual diagrams from the PDF have been converted into text/Mermaid diagrams so that language models can read the entities, relationships, direction of flow, and decision points without needing the original graphics.

---

## 1. Organisation Hierarchy (the “shape” of a college)

This is the backbone everything else attaches to — sections, groups, hashtags, permissions, and routing all derive from it.

### Diagram 1 — Organisation hierarchy

```text
College
├── Stream: B.Tech
│   ├── Dept: CSE
│   │   ├── Year 1
│   │   │   ├── Sem 1 / Sem 2
│   │   │   ├── Section A
│   │   │   └── Section B
│   │   ├── Year 2
│   │   │   ├── Sem 3 / Sem 4
│   │   │   └── Sections
│   │   ├── HOD - CSE
│   │   └── Teachers - CSE
│   └── Dept: ECE
├── Stream: MBA
├── Hostels
│   └── Hostel: Block A
│       ├── Floor
│       │   └── Room
│       └── Warden
├── Canteens / Mess
│   └── Canteen Staff Account
└── Admin Office
    ├── Super Admin
    └── Accounts / Fees Office

Students
└── belong to both:
    ├── Academic hierarchy: Stream → Dept → Year → Sem → Section
    └── Residential hierarchy: Hostel → Floor → Room
```

### Why this matters for your design

Almost every feature you listed (hashtags, DMs, routing, dashboards) is really just “who does this student belong to, right now, across two hierarchies” — academic (Stream→Dept→Year→Sem→Section) and residential (Hostel→Floor→Room). A student sits in both at once. Model this explicitly as data, not as hardcoded logic, or every new feature will re-derive it differently.

---

# 2. Component Architecture

## 2a. Client to Core Services

### Diagram 2 — Client → Gateway → Core Services

```text
CLIENT LAYER
┌───────────────────────────────────────────────────────────────────────┐
│ Client - web / app / shared device                                  │
│ App UI - Feed / DM / Dashboard                                      │
│ Local Queue - unsent requests                                       │
│ Local Cache - text first                                            │
└───────────────────────────────┬───────────────────────────────────────┘
                                │
                                ▼
┌───────────────────────────────────────────────────────────────────────┐
│ API Gateway + Auth                                                  │
└───────────────────────────────┬───────────────────────────────────────┘
                                │
       ┌────────────────────────┼─────────────────────────┐
       ▼                        ▼                         ▼
┌──────────────┐      ┌────────────────────┐     ┌─────────────────────┐
│ Identity &   │      │ Org Structure      │     │ Application / Ticket │
│ RBAC         │      │ Service            │     │ Engine               │
└──────────────┘      └────────────────────┘     └─────────────────────┘
       │                        │                         │
       ▼                        ▼                         ▼
┌──────────────┐      ┌────────────────────┐     ┌─────────────────────┐
│ Org DB       │      │ Org DB             │     │ Applications/Tickets│
└──────────────┘      └────────────────────┘     │ DB + File/Media     │
                                                  └─────────────────────┘

Other core services behind the gateway:
- Attendance Service
- Notice / Targeted Post Service
- DM + Group Messaging
- Hashtag / Group Engine
- Payments and Dues Service
- FAQ Chatbot
- Admin Dashboard and Analytics
- AI Duplicate-Request Check

Notification fan-out:
Application/Ticket Engine
Notice Service
Messaging
Payments Service
        │
        ▼
Notification Service
   ├── Push
   ├── In-app inbox
   └── SMS fallback
```

## 2b. Which service writes to which store

| Service | Data store(s) it uses |
|---|---|
| Identity and RBAC | Org DB |
| Org Structure Service | Org DB |
| Hashtag / Group Engine | Org DB (groups auto-derived from org structure) |
| Application / Ticket Engine | Applications/Tickets DB, File/Media Store (attachments, signatures) |
| Attendance Service | Applications/Tickets DB |
| Notice / Targeted Post Service | Messages DB |
| DM + Group Messaging | Messages DB |
| Payments and Dues Service | Payments DB, File/Media Store (screenshots) |
| Admin Dashboard and Analytics | Reads across Applications/Tickets DB, Messages DB, Payments DB |
| FAQ Chatbot | Search/Index |

## 2c. Notification fan-out

Application/Ticket Engine, Notice Service, Messaging, and Payments Service all publish events into a single Notification Service, which delivers each one through whichever channel fits the recipient:

```text
Application/Ticket Engine ─┐
Notice Service ────────────┤
Messaging ─────────────────┼──► Notification Service
Payments Service ──────────┘          │
                                      ├──► Push (online)
                                      ├──► In-app inbox (next login)
                                      └──► SMS (no data connection)
```

---

# 3. How Your Features Map to This

| Your feature | Maps to | Notes / what was implicit |
|---|---|---|
| Instagram-style DM to teacher/HOD/warden/canteen/accounts | Messaging Service, contact list built from Org Service | Every “account” a student can DM is really a role bound to an org node (this teacher for this section, this warden for this hostel). DM UI is just a view; the real object underneath is a conversation tied to a role, not a person — so if a teacher changes section, history and routing must follow the role, not get lost. |
| Leave / Hostel Leave / Registration / Gate Pass as chat options | Workflow/Ticket Engine, entered through Messaging | Model it once as a generic Application (type, submitter, target approver role, status, unique ID, attachments, signature, timestamps, audit log) — not as four separate features. Everything else (leave, gate pass, hostel leave, registration) is just a type + approval chain on this one object. |
| Application auto-formatted + unique ID + digital signature | Workflow Engine + Files store for the generated PDF | “Digital signature” needs a decision: drawn/typed signature image (fine for a prototype, not legally binding) or a real e-signature/OTP-based approval (needed if this is ever used for official documents like a bonafide certificate)? Flag this as a gap — right now it’s undefined. |
| Approve/Decline with reason | Workflow Engine state machine | Needs states: `Submitted → Under Review → Approved/Declined (with reason) → [optional] Escalated`. |
| Escalation path | Workflow Engine | If a teacher ignores it for 3 days, add an auto-escalation-to-HOD rule. |
| Admin sees pending tasks per teacher | Admin Dashboard reading from Workflow Engine | Needs “workload per role” as a first-class query — ageing, count by status, count by type. |
| Hashtag groups (#btech.cse.sec.a) | Hashtag/Group Engine, auto-generated from Org Service | Don’t let these be manually created strings — auto-derive one group per (stream, dept, section), one per (hostel), one per (year), etc. from the org hierarchy. Manual hashtags will drift out of sync with actual student enrollment. |
| Feed / notices with likes-comments | Feed Service | Complaints going through a public/semi-public feed mixes social visibility with operational tracking. The problem statement wants an audit trail and resolution tracking — that needs to live in the Workflow Engine regardless of whether it’s also shown as a feed post. Treat the feed post as a view of a ticket, not the ticket itself. |
| Attendance dashboard | Attendance Service | Attendance source is unspecified: teacher marking in-app or sync from an existing biometric/RFID system. This changes the design and must be decided before building. |
| Payments (paid/unpaid + screenshot) | Payments Service, DM to “Accounts” role | Screenshot-based proof is fragile — no verification, easy to fake, no reconciliation with actual bank records. At minimum, mark screenshot-based payments as `Pending Verification` until Accounts staff confirms, and generate a receipt only after confirmation, not on upload. |
| Chatbot FAQ | FAQ Chatbot | Keep it a thin layer over a static FAQ + the Workflow Engine so it can answer “where’s my gate pass request” by querying real data, not just canned answers. |
| Low/no internet, offline queueing | Local Queue on client, syncs to API Gateway when back online | Missing requirement: conflict handling. If a student submits the same leave request twice because the first “looked like” it failed, use client-generated idempotency keys per submission so retries don’t duplicate. |
| Notification like WhatsApp | Notification Service | Three delivery tiers: push (online), in-app inbox (next login), SMS/low-data fallback for students without a working data connection. |

---

## 3a. Updated decisions (from clarification round)

- Self-service onboarding, no manual org mapping. Student/Teacher/HOD/Admin each pick their own stream/dept/year/sem/section (or dept, for HOD) at signup and log in directly into that context — no admin has to manually assign anyone into the org tree at creation time. Admin retains override power for corrections.
- Teacher and HOD are separate role types with separate permitted application types — teacher handles simpler registrations; HOD handles registration + leave application + other main approvals. Not a shared role with different labels.
- Admin sees everything, across every role and every workflow.
- Org restructuring (promote a year, merge sections, etc.) is an admin-only privileged action, done from an admin panel — not something a regular user self-serves, since it affects other people’s data. A user can request a personal correction (e.g., wrong section) via settings, but it routes to teacher/HOD for verification before applying, rather than applying immediately.
- Duplicate-request detection is a general AI layer, not canteen-specific — it should sit in front of any complaint/request type (canteen, hostel maintenance, etc.) and flag “a similar request already exists” rather than silently creating a duplicate.
- Visibility is scoped by feature, not one blanket rule. Leave applications, gate passes, payments, and notices stay one-to-one — visible only to sender, recipient, and admin. Hostel/canteen issues are the one exception: visible as a shared board to everyone who belongs to that hostel/canteen group (like GitHub issues or a Reddit thread, scoped to members), so people can see what’s already reported, add “facing this too,” and comment — but never visible college-wide, and never to people outside that group.
- Regional language toggle lives at login and in settings, not just assumed from device locale.

---

# 4. What’s Missing From Your Current Design (worth fixing before you build)

- **No students-without-smartphones path.** The problem statement explicitly asks for this. An Instagram-style app has no answer for it. You need at least one non-app channel — SMS-based requests, or a physical kiosk/shared-computer flow at the hostel/admin office that writes into the same Workflow Engine.
- **No role for Department Head separate from “teacher.”** HOD should be a distinct approver tier.
- **No audit trail spec.** Need an immutable log per application: who touched it, when, what changed.
- **No data migration / rollout plan.** Existing register/attendance-system data needs an import approach.
- **No handling of recurring/duplicate complaints.** A simple version: flag if 3+ complaints hit the same hostel room/location in 30 days.
- **Privacy/visibility boundary undefined.** Decide who can see hostel complaints and how public/board-like visibility interacts with operational resolution.
- **Regional language support** should be treated as a UI-layer i18n requirement.

---

# 5. Process Flows — Who Sends, Who Approves, What They Get

Each flow below is the actual step-by-step: who initiates, who reviews, what decision gets made, and what the initiator ends up with.

## 5.1 Leave Application (student → teacher)

### Diagram 3

```text
Student
  │
  │ Submit Leave Application (reason, dates)
  ▼
Workflow Engine
  │
  ├── Assign unique ID + format document
  │
  ├── Notify Teacher — new request
  ▼
Teacher (Section)
  │
  ├── Approve OR Decline (with reason)
  ▼
Workflow Engine
  │
  ├── Update status + log to audit trail
  └── Notify Student — decision
  ▼
Student
  │
  └── Result: Approved (signed doc) OR Declined (reason)

Notification Service:
  Workflow Engine → Notification Service → Push/SMS — pending leave request

Escalation:
  IF Teacher does not act within the set time
  → auto-escalate to HOD
```

**Who gets what:** Student gets a signed, timestamped document with a unique ID if approved, or a stated reason if declined. Admin can see this request in the dashboard regardless of outcome.

---

## 5.2 Registration Request

Registration request routing depends on category:

```text
Student
  │
  │ Submit Registration Request
  ▼
Workflow Engine
  │
  ├── Simple registration
  │     (elective add, form correction)
  │       │
  │       ▼
  │     Teacher
  │       │
  │       └── Approve / Decline
  │
  └── Main registration
        (semester registration, subject change)
          │
          ▼
        HOD
          │
          └── Approve / Decline

Workflow Engine
  │
  └── Confirmation + status → Student
```

**Routing rule:** The request type decides the approver automatically — the student never chooses who to send it to; the system routes it based on the category picked.

---

## 5.3 Gate Pass (student → approver → security)

### Diagram 5

```text
Student
  │
  │ Request Gate Pass (reason, out-time)
  ▼
Workflow Engine
  │
  │ Route for approval
  ▼
Teacher or Warden
  │
  ├── Approve / Decline
  │
  ▼
Workflow Engine
  │
  └── IF approved → Digital Gate Pass (QR + validity window)
                         │
                         ▼
                       Student
                         │
                         │ Show Digital Gate Pass at gate
                         ▼
                     Security Guard
                         │
                         │ Scan and verify pass validity
                         ▼
               Valid / Expired / Already Used
```

**Who gets what:** Student gets a time-boxed digital pass; the guard gets a live verify, not a static screenshot they have to trust — this closes the “forwarded fake pass” gap.

---

## 5.4 Complaint (student → duplicate check → warden or canteen → resolution), shown as a scoped issue board

Once inside a hostel’s (or canteen’s) chat, “Issues” opens a board — not a single private ticket, but a list scoped to everyone who belongs there. A CSE-Sec-A student in Hostel Block A sees Hostel Block A’s issues because they’re a member of that hostel group; they don’t see Hostel Block B’s issues, and this is separate from the fully-private DM/notice model used elsewhere (leave applications, gate passes, grades — those stay one-to-one).

### Diagram 6

```text
Student (hostel member)
  │
  ├── Open Issues
  │     └── See Open / In Progress / Resolved list
  │
  └── Raise new issue (text/photo)
          │
          ▼
Duplicate-Check Layer
          │
          ├── Similar issue exists
          │      │
          │      └── Show existing issue instead of creating new one
          │             ├── "Facing this too" → affected-count +1
          │             └── Comment
          │
          └── No match
                 │
                 ▼
           Workflow Engine
                 │
                 ├── Create ticket
                 ├── Assign unique ID
                 └── Status = Open
                 │
                 ▼
           Hostel Issue Board
                 │
                 ├── Appears to all hostel members in scope
                 └── Notify — new issue
                 │
                 ▼
        Warden / Canteen Staff
                 │
                 └── Update status:
                       Open → In Progress → Resolved
                              + resolution note
                 │
                 ▼
             Hostel members
                 └── Status updates visible to all

Admin Dashboard:
  └── Ageing + affected-count + recurrence across every hostel
```

**Who gets what:** Every hostel member sees the same board — what’s open, what’s in progress, what’s resolved — and can add themselves to an existing issue (“facing this too”) or comment instead of filing a duplicate. Warden sees one queue for their hostel. Admin sees ageing and affected-count across every hostel.

---

## 5.5 Notice / Targeted Post (admin, teacher, or HOD → group)

### Diagram 7

```text
Admin / Teacher / HOD
  │
  │ Post notice — target group
  ▼
Hashtag / Group Engine
  │
  ├── Resolve target to current member list
  │
  └── Deliver to each member
           │
           ▼
Notification Service
           │
           ├── Push
           ├── In-app
           └── SMS fallback
           │
           ▼
Students in that group
           │
           └── Read receipt / action taken
                    │
                    ▼
           Notification Service
                    │
                    ▼
Admin / Teacher / HOD
  └── Read and action tracking — who saw it, who acted
```

**Who gets what:** Sender sees delivery and read tracking per recipient — not a public post, just a targeted send visible only to sender, recipients, and admin.

---

## 5.6 Payment Proof (student → accounts → receipt)

### Diagram 8

```text
Student
  │
  │ Upload payment screenshot
  ▼
Payments Service
  │
  ├── Mark status = Pending Verification
  └── Notify Accounts Staff
             │
             ▼
       Accounts Staff
             │
             └── Confirm match against bank record OR Reject
                       │
              ┌────────┴────────┐
              ▼                 ▼
          Confirmed           Rejected
              │                 │
              ▼                 ▼
      Status = Paid       Status = Rejected
      Receipt generated   Reason shown
                          Re-upload allowed
```

**Who gets what:** Student only gets an official receipt after Accounts staff confirms — the screenshot alone never auto-marks the fee as paid.

---

## 5.7 Org Correction — Self-Service vs Admin Override

### Diagram 9

```text
Student
  │
  ├── Self-service correction (e.g. wrong section)
  │       │
  │       ▼
  │   Workflow Engine
  │       │
  │       └── Route for verification
  │               │
  │               ▼
  │         Teacher or HOD
  │               │
  │               └── Verify / Reject
  │                       │
  │                       └── IF verified → Applied
  │
  └── Structural change (merge sections, promote year)
          │
          ▼
        Admin
          │
          └── Directly apply org change
                    │
                    ▼
             Workflow Engine
                    │
                    └── Log as privileged admin action
                        + audit trail
```

**Who gets what:** A personal fix needs a human check before it changes data; a structural change is admin-only and always logged separately from normal edits, since it affects many people’s records at once.

---

# 7. Promotion & Teacher-Assignment Model

This is the key correction from the last message: **a teacher is bound to a slot, not to a batch of students.**

The slot is `(Dept, Year, Section)` — e.g. `CSE, Year 1, Section A`. Whoever currently holds that slot teaches whoever is currently in it. When students promote from Year 1 → Year 2, they don’t take their teacher with them — they arrive into whichever teacher currently holds the Year 2 slot.

### Example — Ramesh / Rakesh / Akshi / Yash scenario

| Slot (Dept, Year, Section) | Teacher in 2025-26 | Teacher in 2026-27 | Students in 2025-26 → where they go in 2026-27 |
|---|---|---|---|
| CSE, Year 1, Sec A | Ramesh | Akash (new intake’s teacher) | This year’s Year 1 batch → moves to Year 2 slot |
| CSE, Year 2, Sec A | Rakesh | Ramesh | This year’s Year 2 batch → moves to Year 3 slot |
| CSE, Year 3, Sec A | Akshi | Rakesh | This year’s Year 3 batch → moves to Year 4 slot |
| CSE, Year 4, Sec A | Yash | Akshi | This year’s Year 4 batch → graduates, archived |

### Slot model

```text
                         SectionSlot
                  (dept_id, year, section)
                       /           \
                      /             \
       binds teacher /               \ binds students
                    /                 \
                   ▼                   ▼
          SlotAssignment          StudentEnrollment
       (teacher_id, slot_id,      (student_id, slot_id,
        academic_year)             academic_year, status)
                   │                   │
                   ▼                   ▼
                Teacher             Student

Promotion (scheduled batch job):
  Year N StudentEnrollment
       │
       ├── close current enrollment
       │
       └── create next-year enrollment
              → Year N+1, same dept + section

Year 4:
  → status = graduated
  → read-only / archived
  → account is NOT deleted

Teacher reassignment:
  SlotAssignment changes
  → student records are untouched
```

Read this both ways: teachers move between slots year to year (Ramesh: Year 1 slot → Year 2 slot), and students move between slots too (this year’s Year 1 students become next year’s Year 2 students) — but a student’s slot move and their teacher’s slot move are two independent things that just happen to land the student with whichever teacher occupies their new slot. Neither one is “attached” to the other; both point at the slot, and the slot is what ties them together for that year.

### What this means for the build

- A `SectionSlot` is its own entity: `(dept_id, year, section)`. It exists independent of which teacher or which students currently occupy it.
- `SlotAssignment` links a `teacher_id` to a `slot_id` for a given academic year. This can change every year, or even mid-year, without touching student records at all.
- A `StudentEnrollment` links a `student_id` to a `slot_id` for a given academic year.
- Promotion = closing this year’s enrollment and creating next year’s enrollment pointing at the next slot (Year N+1, same section, same dept).
- Promotion is a scheduled batch job, not a manual per-student edit: at year-end, for every active `StudentEnrollment`, create a new one at year+1 in the same dept/section, unless flagged (backlog/repeat/graduating).
- Year 4 students get status = graduated instead of a new enrollment, and their account moves to a read-only/archived state — not deleted, since certificates and history still need to be pulled up later.
- Because group membership (hashtag groups), DM routing, teacher dashboards, and attendance all read current `SectionSlot`, this one promotion event automatically updates every downstream feature — no per-feature update needed.
- Teacher slot reassignment (moving Rakesh from Sec A to Sec B, or from Year 2 to Year 3) works the same way — it’s a `SlotAssignment` change, controllable by admin, or by the teacher themself if self-service is allowed, with admin override.

---

# 8. Offline Message Storage (like WhatsApp)

Group chats and DMs need to be readable with no connection, not just sendable-when-back-online.

```text
Server
  │
  │ received messages
  ▼
Client local encrypted store
  ├── SQLite (mobile)
  └── IndexedDB (web)
          │
          ├── Chat opens → read local store first
          └── Network available → background sync new messages

Outgoing message
  │
  ▼
Local Queue
  │
  ├── pending indicator
  └── wait for server acknowledgement
          │
          ▼
Server
  │
  └── server-assigned message ID + timestamp
          │
          ▼
Client sync/reconciliation
  └── prevents duplicate messages after reconnect
```

Every message the account has received gets written locally on delivery, not fetched fresh each time the chat opens.

Opening a chat reads from local store first, then syncs any new messages in the background when a connection exists — same pattern as WhatsApp, so chat history is always available offline, only new messages need connectivity.

Outgoing messages queue locally and sent-but-unconfirmed messages show with a pending indicator until the server acknowledges them, exactly like WhatsApp’s single/double tick.

Sync uses each message’s server-assigned ID and timestamp to avoid duplicates when the same device reconnects after being offline for a while.

---

# 9. Core Data Entities

| Entity | Key fields | Notes |
|---|---|---|
| User | `id`, `role` (student/teacher/hod/warden/canteen/accounts/admin), `name`, `phone`, `language_pref` | One account type per role; role decides what the app UI shows |
| SectionSlot | `id`, `dept_id`, `year`, `section` | Exists independent of who’s teaching or enrolled |
| SlotAssignment | `id`, `slot_id`, `teacher_id`, `academic_year` | Teacher-to-slot binding, changes yearly |
| StudentEnrollment | `id`, `student_id`, `slot_id`, `academic_year`, `status` (active/backlog/graduated) | Student-to-slot binding, changes on promotion |
| HostelRoom | `id`, `hostel_id`, `floor`, `room_no`, `warden_id` | Residential hierarchy, separate from academic |
| Application | `id`, `type` (leave/gatepass/registration/etc), `submitter_id`, `approver_role`, `status`, `unique_code`, `signature_ref`, `created_at` | One generic table for all approval-based workflows |
| Complaint | `id`, `submitter_id`, `target_role` (warden/canteen), `scope_id` (hostel_id or canteen_id), `text`, `photo_ref`, `status` (open/in_progress/resolved), `duplicate_of_id`, `affected_count` | Visible as a board to everyone in `scope_id`, not just submitter and admin; `duplicate_of_id` set by AI check |
| IssueComment | `id`, `complaint_id`, `author_id`, `text`, `created_at` | Comments on a Complaint, visible to everyone who can see that issue board |
| Group | `id`, `type` (hashtag/hostel/year), `auto_derived_from` (slot_id or hostel_id) | Membership is computed, not manually maintained |
| Message | `id`, `group_id` or `dm_thread_id`, `sender_id`, `text`, `attachment_ref`, `sent_at`, `delivered_at`, `read_at` | Stored client-side and server-side for offline read |
| Payment | `id`, `student_id`, `amount`, `proof_ref`, `status` (pending/confirmed/rejected), `verified_by` | Receipt only generated on confirmed |
| AuditLog | `id`, `actor_id`, `action`, `target_entity`, `target_id`, `before`, `after`, `timestamp` | Every admin override and approval decision logged here |

---

# 10. Suggested Minimum Viable Scope (for a hackathon prototype)

Given the brief wants 3 workflows end-to-end, pick these to demo the full architecture without overbuilding:

1. **Gate Pass** — student → teacher/warden approval → digital pass shown to guard. Shows Workflow Engine + Messaging + role-based approval.
2. **Hostel Complaint** — student → ticket → warden dashboard → status update → resolution. Shows Workflow Engine + Admin Dashboard + ageing/tracking.
3. **Notices via hashtag group** — admin/teacher → `#btech.cse.sec.a` → feed + notification, read/action tracking. Shows Org Service + Group Engine + Notification Service.

Then demo:
- Admin dashboard showing pending/ageing across all three.
- Offline queue working on a throttled/low-bandwidth connection.

This gives full-stack coverage of the architecture above without needing to fully build attendance, payments, and the chatbot for the demo — those can be “coming next” on the roadmap slide.
