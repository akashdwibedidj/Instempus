# DATABASE — Instempus

## Tables (by migration file)

### 001_org.sql
| Table | Key columns | Notes |
|---|---|---|
| `streams` | `id`, `name`, `code` | B.Tech, MBA, etc. |
| `departments` | `id`, `stream_id`, `name`, `code` | CSE, ECE, etc. |
| `section_slots` | `id`, `dept_id`, `year` (1-4), `section` (A-Z), `academic_year` | Exists independent of teacher/students |
| `hostels` | `id`, `name`, `type` (boys/girls/co-ed) | |
| `canteens` | `id`, `name`, `location` | |

### 002_users.sql
| Table | Key columns | Notes |
|---|---|---|
| `profiles` | `id` (= auth.uid), `role`, `name`, `phone`, `roll_no`, `language_pref`, `avatar_url` | Extends Supabase auth |
| `pre_registered_students` | `roll_no`, `dept_id`, `year`, `section`, `academic_year` | Students self-register only if roll_no exists here |

### 003_slots_enrollments.sql
| Table | Key columns | Notes |
|---|---|---|
| `slot_assignments` | `id`, `slot_id`, `teacher_id`, `academic_year` | Teacher-to-slot binding |
| `student_enrollments` | `id`, `student_id`, `slot_id`, `academic_year`, `status` (active/backlog/graduated) | Student-to-slot binding |
| `hostel_rooms` | `id`, `hostel_id`, `floor`, `room_no`, `capacity` | |
| `hostel_assignments` | `id`, `student_id`, `room_id`, `academic_year`, `warden_id` | Student-to-room binding |

### 004_applications.sql
| Table | Key columns | Notes |
|---|---|---|
| `application_types` | `id`, `name`, `form_schema` (jsonb), `required_documents` (jsonb), `target_approver_role`, `is_active` | Types as data, not code |
| `approval_steps` | `id`, `application_type_id`, `step_order`, `step_handler_id`, `approver_role`, `timeout_hours` | Step chain as data |
| `applications` | `id`, `type_id`, `submitter_id`, `current_step`, `status` (submitted/under_review/approved/declined/escalated), `unique_code`, `form_data` (jsonb), `signature_ref`, `idempotency_key`, `created_at` | Generic application row |
| `application_step_logs` | `id`, `application_id`, `step_id`, `actor_id`, `decision`, `reason`, `acted_at` | Per-step audit |

### 005_issues.sql
| Table | Key columns | Notes |
|---|---|---|
| `issue_categories` | `id`, `name`, `scope_type` (hostel/canteen), `dept_routing` | Config table |
| `complaints` | `id`, `submitter_id`, `category_id`, `scope_type`, `scope_id`, `text`, `photo_ref`, `status` (open/in_progress/resolved), `duplicate_of_id`, `affected_count`, `idempotency_key`, `created_at` | Scoped issue board |
| `issue_comments` | `id`, `complaint_id`, `author_id`, `text`, `created_at` | |
| `issue_upvotes` | `id`, `complaint_id`, `user_id`, `created_at` | "Facing this too" |

### 006_groups_messages.sql
| Table | Key columns | Notes |
|---|---|---|
| `groups` | `id`, `type` (section/hostel/year/custom/event), `name`, `auto_derived_from`, `scope_ref` | |
| `group_members` | `group_id`, `user_id`, `joined_at` | Computed groups have no rows; membership is a view |
| `dm_threads` | `id`, `participant_a`, `participant_b` | |
| `messages` | `id`, `group_id` (nullable), `dm_thread_id` (nullable), `sender_id`, `text`, `attachment_ref`, `sent_at`, `delivered_at`, `read_at`, `idempotency_key` | |
| `notice_reads` | `notice_id`, `user_id`, `read_at`, `action_taken` | Read/action tracking |

### 007_payments.sql
| Table | Key columns | Notes |
|---|---|---|
| `fee_items` | `id`, `name`, `amount`, `academic_year`, `dept_id` (nullable) | Fee catalogue |
| `payments` | `id`, `student_id`, `fee_item_id`, `amount`, `proof_ref`, `status` (pending/confirmed/rejected), `verified_by`, `receipt_ref`, `idempotency_key` | |

### 008_attendance.sql
| Table | Key columns | Notes |
|---|---|---|
| `attendance_sessions` | `id`, `slot_id`, `date`, `created_by` | One per class session |
| `attendance_records` | `id`, `session_id`, `student_id`, `status` (present/absent/late) | |

### 009_audit_events.sql
| Table | Key columns | Notes |
|---|---|---|
| `events` | `id`, `source_service`, `event_type`, `entity_id`, `payload` (jsonb), `created_at` | Published by DB triggers; consumed by edge functions |
| `audit_logs` | `id`, `actor_id`, `action`, `target_entity`, `target_id`, `before` (jsonb), `after` (jsonb), `timestamp` | Immutable; populated by DB triggers |

### 010_config.sql
| Table | Key columns | Notes |
|---|---|---|
| `app_settings` | `key`, `value` (jsonb), `updated_at` | College name, logo, theme, escalation timeout, etc. |
| `role_permissions` | `role`, `permission_key` | Runtime permission map |
| `notification_templates` | `id`, `event_type`, `channel`, `template_text` | |

---

## RLS summary (by migration file, separate from schema files)

- `011_rls_org.sql` — public read for org structure; admin-only writes.
- `012_rls_users.sql` — own profile readable by self; admin sees all; teacher sees students in their slot.
- `013_rls_applications.sql` — submitter + current approver + admin only; security sees gate pass status only.
- `014_rls_issues.sql` — complaints visible to all members of `scope_id`; warden/canteen sees their scope queue; admin sees all.
- `015_rls_messages.sql` — group members only; DM participants only; admin sees all.
- `016_rls_payments.sql` — student sees own; accounts staff sees all; admin sees all.
- `017_rls_attendance.sql` — student sees own; teacher sees their slot; admin sees all.
- `018_rls_audit.sql` — admin and principal read-only; no direct writes (trigger-only).

---

## Migrations rule
Migrations are **append-only**. Never edit an existing migration file.
Every schema change is a new numbered file, backward compatible where possible.
Update this file in the same task as the migration.
