-- supabase/seed.sql — Demo college data for Instempus
-- Run AFTER all 18 migrations.
-- All demo passwords: Demo@1234

-- ─── disable triggers during seed ────────────────────────────────────────────
set session_replication_role = replica;   -- skips FK triggers + audit triggers

-- ─── fixed UUIDs for demo accounts ───────────────────────────────────────────
-- Using fixed UUIDs so seed is idempotent (re-run safe via ON CONFLICT DO NOTHING)

-- admin          : 00000000-0000-0000-0000-000000000001
-- principal      : 00000000-0000-0000-0000-000000000002
-- hod_cse        : 00000000-0000-0000-0000-000000000003
-- hod_ece        : 00000000-0000-0000-0000-000000000004
-- teacher_1..4   : 00000000-0000-0000-0000-00000000001{1..4}
-- warden         : 00000000-0000-0000-0000-000000000021
-- canteen_mgr    : 00000000-0000-0000-0000-000000000022
-- accounts       : 00000000-0000-0000-0000-000000000023
-- security       : 00000000-0000-0000-0000-000000000024
-- students s1-s20: 00000000-0000-0000-0000-0000000001{01..20}

-- ─── auth.users (demo accounts) ───────────────────────────────────────────────
insert into auth.users (
  id, instance_id, aud, role, email,
  encrypted_password, email_confirmed_at,
  created_at, updated_at, raw_app_meta_data, raw_user_meta_data
)
select
  id::uuid,
  '00000000-0000-0000-0000-000000000000'::uuid,
  'authenticated', 'authenticated', email,
  crypt('Demo@1234', gen_salt('bf')),
  now(), now(), now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{}'::jsonb
from (values
  ('00000000-0000-0000-0000-000000000001', 'admin@instempus.edu'),
  ('00000000-0000-0000-0000-000000000002', 'principal@instempus.edu'),
  ('00000000-0000-0000-0000-000000000003', 'hod.cse@instempus.edu'),
  ('00000000-0000-0000-0000-000000000004', 'hod.ece@instempus.edu'),
  ('00000000-0000-0000-0000-000000000011', 'teacher1@instempus.edu'),
  ('00000000-0000-0000-0000-000000000012', 'teacher2@instempus.edu'),
  ('00000000-0000-0000-0000-000000000013', 'teacher3@instempus.edu'),
  ('00000000-0000-0000-0000-000000000014', 'teacher4@instempus.edu'),
  ('00000000-0000-0000-0000-000000000021', 'warden@instempus.edu'),
  ('00000000-0000-0000-0000-000000000022', 'canteen@instempus.edu'),
  ('00000000-0000-0000-0000-000000000023', 'accounts@instempus.edu'),
  ('00000000-0000-0000-0000-000000000024', 'security@instempus.edu'),
  ('00000000-0000-0000-0000-000000000101', 'student01@instempus.edu'),
  ('00000000-0000-0000-0000-000000000102', 'student02@instempus.edu'),
  ('00000000-0000-0000-0000-000000000103', 'student03@instempus.edu'),
  ('00000000-0000-0000-0000-000000000104', 'student04@instempus.edu'),
  ('00000000-0000-0000-0000-000000000105', 'student05@instempus.edu'),
  ('00000000-0000-0000-0000-000000000106', 'student06@instempus.edu'),
  ('00000000-0000-0000-0000-000000000107', 'student07@instempus.edu'),
  ('00000000-0000-0000-0000-000000000108', 'student08@instempus.edu'),
  ('00000000-0000-0000-0000-000000000109', 'student09@instempus.edu'),
  ('00000000-0000-0000-0000-000000000110', 'student10@instempus.edu'),
  ('00000000-0000-0000-0000-000000000111', 'student11@instempus.edu'),
  ('00000000-0000-0000-0000-000000000112', 'student12@instempus.edu'),
  ('00000000-0000-0000-0000-000000000113', 'student13@instempus.edu'),
  ('00000000-0000-0000-0000-000000000114', 'student14@instempus.edu'),
  ('00000000-0000-0000-0000-000000000115', 'student15@instempus.edu'),
  ('00000000-0000-0000-0000-000000000116', 'student16@instempus.edu'),
  ('00000000-0000-0000-0000-000000000117', 'student17@instempus.edu'),
  ('00000000-0000-0000-0000-000000000118', 'student18@instempus.edu'),
  ('00000000-0000-0000-0000-000000000119', 'student19@instempus.edu'),
  ('00000000-0000-0000-0000-000000000120', 'student20@instempus.edu')
) as t(id, email)
on conflict (id) do nothing;

-- ─── org structure ────────────────────────────────────────────────────────────
insert into public.streams (id, name, code) values
  ('aaaaaaaa-0000-0000-0000-000000000001', 'Bachelor of Technology', 'BTECH')
on conflict (id) do nothing;

insert into public.departments (id, stream_id, name, code) values
  ('bbbbbbbb-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'Computer Science & Engineering', 'CSE'),
  ('bbbbbbbb-0000-0000-0000-000000000002', 'aaaaaaaa-0000-0000-0000-000000000001', 'Electronics & Communication',   'ECE'),
  ('bbbbbbbb-0000-0000-0000-000000000003', 'aaaaaaaa-0000-0000-0000-000000000001', 'Mechanical Engineering',        'ME')
on conflict (id) do nothing;

insert into public.hostels (id, name, type) values
  ('cccccccc-0000-0000-0000-000000000001', 'Boys Hostel A',  'boys'),
  ('cccccccc-0000-0000-0000-000000000002', 'Girls Hostel B', 'girls')
on conflict (id) do nothing;

insert into public.canteens (id, name, location) values
  ('dddddddd-0000-0000-0000-000000000001', 'Main Canteen', 'Ground Floor, Academic Block')
on conflict (id) do nothing;

-- section slots: CSE Year-1 Section A + B
insert into public.section_slots (id, dept_id, year, section, academic_year) values
  ('eeeeeeee-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 1, 'A', '2025-26'),
  ('eeeeeeee-0000-0000-0000-000000000002', 'bbbbbbbb-0000-0000-0000-000000000001', 1, 'B', '2025-26'),
  ('eeeeeeee-0000-0000-0000-000000000003', 'bbbbbbbb-0000-0000-0000-000000000001', 2, 'A', '2025-26'),
  ('eeeeeeee-0000-0000-0000-000000000004', 'bbbbbbbb-0000-0000-0000-000000000002', 1, 'A', '2025-26')
on conflict (id) do nothing;

-- ─── profiles ─────────────────────────────────────────────────────────────────
insert into public.profiles (id, role, name, dept_id, hostel_id, onboarded_at) values
  ('00000000-0000-0000-0000-000000000001', 'admin',     'Admin User',        null, null, now()),
  ('00000000-0000-0000-0000-000000000002', 'principal', 'Dr. R.K. Sharma',   null, null, now()),
  ('00000000-0000-0000-0000-000000000003', 'hod',       'Dr. A. Mishra',     'bbbbbbbb-0000-0000-0000-000000000001', null, now()),
  ('00000000-0000-0000-0000-000000000004', 'hod',       'Dr. S. Panda',      'bbbbbbbb-0000-0000-0000-000000000002', null, now()),
  ('00000000-0000-0000-0000-000000000011', 'teacher',   'Prof. B. Das',      'bbbbbbbb-0000-0000-0000-000000000001', null, now()),
  ('00000000-0000-0000-0000-000000000012', 'teacher',   'Prof. M. Nayak',    'bbbbbbbb-0000-0000-0000-000000000001', null, now()),
  ('00000000-0000-0000-0000-000000000013', 'teacher',   'Prof. P. Rath',     'bbbbbbbb-0000-0000-0000-000000000002', null, now()),
  ('00000000-0000-0000-0000-000000000014', 'teacher',   'Prof. K. Sahoo',    'bbbbbbbb-0000-0000-0000-000000000002', null, now()),
  ('00000000-0000-0000-0000-000000000021', 'warden',    'Mr. S. Behera',     null, null, now()),
  ('00000000-0000-0000-0000-000000000022', 'canteen',   'Mr. D. Swain',      null, null, now()),
  ('00000000-0000-0000-0000-000000000023', 'accounts',  'Mrs. L. Mohanty',   null, null, now()),
  ('00000000-0000-0000-0000-000000000024', 'security',  'Mr. G. Pradhan',    null, null, now())
on conflict (id) do nothing;

-- students: 10 in Boys Hostel, 10 in Girls Hostel
insert into public.profiles (id, role, name, roll_no, dept_id, hostel_id, onboarded_at) values
  ('00000000-0000-0000-0000-000000000101', 'student', 'Rohit Kumar',    '2501CSE001', 'bbbbbbbb-0000-0000-0000-000000000001', 'cccccccc-0000-0000-0000-000000000001', now()),
  ('00000000-0000-0000-0000-000000000102', 'student', 'Amit Sahu',      '2501CSE002', 'bbbbbbbb-0000-0000-0000-000000000001', 'cccccccc-0000-0000-0000-000000000001', now()),
  ('00000000-0000-0000-0000-000000000103', 'student', 'Vikash Oram',    '2501CSE003', 'bbbbbbbb-0000-0000-0000-000000000001', 'cccccccc-0000-0000-0000-000000000001', now()),
  ('00000000-0000-0000-0000-000000000104', 'student', 'Sunil Majhi',    '2501CSE004', 'bbbbbbbb-0000-0000-0000-000000000001', 'cccccccc-0000-0000-0000-000000000001', now()),
  ('00000000-0000-0000-0000-000000000105', 'student', 'Deepak Toppo',   '2501CSE005', 'bbbbbbbb-0000-0000-0000-000000000001', 'cccccccc-0000-0000-0000-000000000001', now()),
  ('00000000-0000-0000-0000-000000000106', 'student', 'Rajan Kerketta', '2501CSE006', 'bbbbbbbb-0000-0000-0000-000000000001', 'cccccccc-0000-0000-0000-000000000001', now()),
  ('00000000-0000-0000-0000-000000000107', 'student', 'Manoj Tirkey',   '2501CSE007', 'bbbbbbbb-0000-0000-0000-000000000001', 'cccccccc-0000-0000-0000-000000000001', now()),
  ('00000000-0000-0000-0000-000000000108', 'student', 'Binod Munda',    '2501CSE008', 'bbbbbbbb-0000-0000-0000-000000000001', 'cccccccc-0000-0000-0000-000000000001', now()),
  ('00000000-0000-0000-0000-000000000109', 'student', 'Sanjay Gond',    '2501CSE009', 'bbbbbbbb-0000-0000-0000-000000000001', 'cccccccc-0000-0000-0000-000000000001', now()),
  ('00000000-0000-0000-0000-000000000110', 'student', 'Anil Bhatra',    '2501CSE010', 'bbbbbbbb-0000-0000-0000-000000000001', 'cccccccc-0000-0000-0000-000000000001', now()),
  ('00000000-0000-0000-0000-000000000111', 'student', 'Priya Nag',      '2501CSE011', 'bbbbbbbb-0000-0000-0000-000000000001', 'cccccccc-0000-0000-0000-000000000002', now()),
  ('00000000-0000-0000-0000-000000000112', 'student', 'Sunita Minz',    '2501CSE012', 'bbbbbbbb-0000-0000-0000-000000000001', 'cccccccc-0000-0000-0000-000000000002', now()),
  ('00000000-0000-0000-0000-000000000113', 'student', 'Rekha Lakra',    '2501CSE013', 'bbbbbbbb-0000-0000-0000-000000000001', 'cccccccc-0000-0000-0000-000000000002', now()),
  ('00000000-0000-0000-0000-000000000114', 'student', 'Anita Ekka',     '2501CSE014', 'bbbbbbbb-0000-0000-0000-000000000001', 'cccccccc-0000-0000-0000-000000000002', now()),
  ('00000000-0000-0000-0000-000000000115', 'student', 'Meera Hembrom',  '2501CSE015', 'bbbbbbbb-0000-0000-0000-000000000001', 'cccccccc-0000-0000-0000-000000000002', now()),
  ('00000000-0000-0000-0000-000000000116', 'student', 'Suman Kujur',    '2501CSE016', 'bbbbbbbb-0000-0000-0000-000000000001', 'cccccccc-0000-0000-0000-000000000002', now()),
  ('00000000-0000-0000-0000-000000000117', 'student', 'Kavita Oraon',   '2501CSE017', 'bbbbbbbb-0000-0000-0000-000000000001', 'cccccccc-0000-0000-0000-000000000002', now()),
  ('00000000-0000-0000-0000-000000000118', 'student', 'Lata Bodra',     '2501CSE018', 'bbbbbbbb-0000-0000-0000-000000000001', 'cccccccc-0000-0000-0000-000000000002', now()),
  ('00000000-0000-0000-0000-000000000119', 'student', 'Durga Pahan',    '2501CSE019', 'bbbbbbbb-0000-0000-0000-000000000001', 'cccccccc-0000-0000-0000-000000000002', now()),
  ('00000000-0000-0000-0000-000000000120', 'student', 'Kamla Soren',    '2501CSE020', 'bbbbbbbb-0000-0000-0000-000000000001', 'cccccccc-0000-0000-0000-000000000002', now())
on conflict (id) do nothing;

-- back-fill HOD and warden references
update public.departments set hod_id = '00000000-0000-0000-0000-000000000003' where code = 'CSE';
update public.departments set hod_id = '00000000-0000-0000-0000-000000000004' where code = 'ECE';
update public.hostels     set warden_id = '00000000-0000-0000-0000-000000000021' where name = 'Boys Hostel A';
update public.canteens    set manager_id = '00000000-0000-0000-0000-000000000022' where name = 'Main Canteen';

-- ─── slot assignments ─────────────────────────────────────────────────────────
insert into public.slot_assignments (slot_id, teacher_id, academic_year, subject) values
  ('eeeeeeee-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000011', '2025-26', 'Data Structures'),
  ('eeeeeeee-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000012', '2025-26', 'Data Structures'),
  ('eeeeeeee-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000011', '2025-26', 'DBMS'),
  ('eeeeeeee-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000013', '2025-26', 'Digital Electronics')
on conflict do nothing;

-- ─── student enrollments (students 1-10 → slot A, 11-20 → slot B) ────────────
insert into public.student_enrollments (student_id, slot_id, academic_year) values
  ('00000000-0000-0000-0000-000000000101', 'eeeeeeee-0000-0000-0000-000000000001', '2025-26'),
  ('00000000-0000-0000-0000-000000000102', 'eeeeeeee-0000-0000-0000-000000000001', '2025-26'),
  ('00000000-0000-0000-0000-000000000103', 'eeeeeeee-0000-0000-0000-000000000001', '2025-26'),
  ('00000000-0000-0000-0000-000000000104', 'eeeeeeee-0000-0000-0000-000000000001', '2025-26'),
  ('00000000-0000-0000-0000-000000000105', 'eeeeeeee-0000-0000-0000-000000000001', '2025-26'),
  ('00000000-0000-0000-0000-000000000106', 'eeeeeeee-0000-0000-0000-000000000001', '2025-26'),
  ('00000000-0000-0000-0000-000000000107', 'eeeeeeee-0000-0000-0000-000000000001', '2025-26'),
  ('00000000-0000-0000-0000-000000000108', 'eeeeeeee-0000-0000-0000-000000000001', '2025-26'),
  ('00000000-0000-0000-0000-000000000109', 'eeeeeeee-0000-0000-0000-000000000001', '2025-26'),
  ('00000000-0000-0000-0000-000000000110', 'eeeeeeee-0000-0000-0000-000000000001', '2025-26'),
  ('00000000-0000-0000-0000-000000000111', 'eeeeeeee-0000-0000-0000-000000000002', '2025-26'),
  ('00000000-0000-0000-0000-000000000112', 'eeeeeeee-0000-0000-0000-000000000002', '2025-26'),
  ('00000000-0000-0000-0000-000000000113', 'eeeeeeee-0000-0000-0000-000000000002', '2025-26'),
  ('00000000-0000-0000-0000-000000000114', 'eeeeeeee-0000-0000-0000-000000000002', '2025-26'),
  ('00000000-0000-0000-0000-000000000115', 'eeeeeeee-0000-0000-0000-000000000002', '2025-26'),
  ('00000000-0000-0000-0000-000000000116', 'eeeeeeee-0000-0000-0000-000000000002', '2025-26'),
  ('00000000-0000-0000-0000-000000000117', 'eeeeeeee-0000-0000-0000-000000000002', '2025-26'),
  ('00000000-0000-0000-0000-000000000118', 'eeeeeeee-0000-0000-0000-000000000002', '2025-26'),
  ('00000000-0000-0000-0000-000000000119', 'eeeeeeee-0000-0000-0000-000000000002', '2025-26'),
  ('00000000-0000-0000-0000-000000000120', 'eeeeeeee-0000-0000-0000-000000000002', '2025-26')
on conflict do nothing;

-- ─── hostel rooms ─────────────────────────────────────────────────────────────
insert into public.hostel_rooms (id, hostel_id, floor, room_no, capacity) values
  ('ffffffff-0000-0000-0000-000000000001', 'cccccccc-0000-0000-0000-000000000001', 1, '101', 2),
  ('ffffffff-0000-0000-0000-000000000002', 'cccccccc-0000-0000-0000-000000000001', 1, '102', 2),
  ('ffffffff-0000-0000-0000-000000000003', 'cccccccc-0000-0000-0000-000000000001', 1, '103', 2),
  ('ffffffff-0000-0000-0000-000000000004', 'cccccccc-0000-0000-0000-000000000001', 1, '104', 2),
  ('ffffffff-0000-0000-0000-000000000005', 'cccccccc-0000-0000-0000-000000000001', 1, '105', 2),
  ('ffffffff-0000-0000-0000-000000000011', 'cccccccc-0000-0000-0000-000000000002', 1, '101', 2),
  ('ffffffff-0000-0000-0000-000000000012', 'cccccccc-0000-0000-0000-000000000002', 1, '102', 2),
  ('ffffffff-0000-0000-0000-000000000013', 'cccccccc-0000-0000-0000-000000000002', 1, '103', 2),
  ('ffffffff-0000-0000-0000-000000000014', 'cccccccc-0000-0000-0000-000000000002', 1, '104', 2),
  ('ffffffff-0000-0000-0000-000000000015', 'cccccccc-0000-0000-0000-000000000002', 1, '105', 2)
on conflict do nothing;

-- ─── application types + approval steps ──────────────────────────────────────
insert into public.application_types (id, name, slug, form_schema, target_approver_role) values
  (
    'a1000000-0000-0000-0000-000000000001',
    'Leave Application', 'leave',
    '[{"name":"from_date","label":"From Date","type":"date","required":true},{"name":"to_date","label":"To Date","type":"date","required":true},{"name":"reason","label":"Reason","type":"textarea","required":true}]',
    'hod'
  ),
  (
    'a1000000-0000-0000-0000-000000000002',
    'Gate Pass', 'gatepass',
    '[{"name":"destination","label":"Destination","type":"text","required":true},{"name":"purpose","label":"Purpose","type":"textarea","required":true},{"name":"return_by","label":"Return By","type":"datetime","required":true}]',
    'warden'
  ),
  (
    'a1000000-0000-0000-0000-000000000003',
    'Hostel Leave', 'hostel_leave',
    '[{"name":"from_date","label":"From Date","type":"date","required":true},{"name":"to_date","label":"To Date","type":"date","required":true},{"name":"guardian_phone","label":"Guardian Phone","type":"tel","required":true},{"name":"reason","label":"Reason","type":"textarea","required":true}]',
    'warden'
  )
on conflict (id) do nothing;

-- leave: teacher → hod
insert into public.approval_steps (application_type_id, step_order, approver_role, timeout_hours) values
  ('a1000000-0000-0000-0000-000000000001', 1, 'teacher', 24),
  ('a1000000-0000-0000-0000-000000000001', 2, 'hod',     48)
on conflict do nothing;

-- gatepass: warden only
insert into public.approval_steps (application_type_id, step_order, approver_role, timeout_hours) values
  ('a1000000-0000-0000-0000-000000000002', 1, 'warden', 4)
on conflict do nothing;

-- hostel leave: warden → principal
insert into public.approval_steps (application_type_id, step_order, approver_role, timeout_hours) values
  ('a1000000-0000-0000-0000-000000000003', 1, 'warden',    12),
  ('a1000000-0000-0000-0000-000000000003', 2, 'principal', 48)
on conflict do nothing;

-- ─── issue categories ─────────────────────────────────────────────────────────
insert into public.issue_categories (name, scope_type) values
  ('Water Supply',       'hostel'),
  ('Electricity',        'hostel'),
  ('Cleanliness',        'hostel'),
  ('Food Quality',       'canteen'),
  ('Food Quantity',      'canteen'),
  ('Hygiene',            'canteen'),
  ('Internet / Wi-Fi',   'hostel'),
  ('Security Concern',   'hostel')
on conflict do nothing;

-- ─── fee items ────────────────────────────────────────────────────────────────
insert into public.fee_items (name, amount, academic_year, due_date) values
  ('Tuition Fee — Semester 1', 35000.00, '2025-26', '2025-08-31'),
  ('Hostel Fee — Annual',      18000.00, '2025-26', '2025-07-31'),
  ('Exam Fee — Semester 1',     2500.00, '2025-26', '2025-10-15')
on conflict do nothing;

-- ─── re-enable triggers ───────────────────────────────────────────────────────
set session_replication_role = default;
