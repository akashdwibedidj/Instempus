# PLAN — Instempus

Hackathon priority order (if time is short): Phase 0 → 1 → 2 → 3 → 5 → 6 → 7 → 8 → 4 → 9 → 10

---

## Phase 0 — Setup

- [x] Read SYSTEM_DESIGN.md and SYSTEM_ARCHITECTURE.md
- [x] Create docs/PROJECT_CONTEXT.md
- [x] Create docs/ARCHITECTURE.md
- [x] Create docs/DATABASE.md
- [x] Create docs/DECISIONS.md
- [x] Create docs/FILE_MAP.md
- [x] Create docs/PLAN.md (this file)
- [x] Create docs/PROGRESS.md
- [ ] Scaffold Vite + React 18 + TypeScript strict mode
- [ ] Configure Tailwind CSS
- [ ] Set up eslint + prettier
- [ ] Create folder structure (src/app, src/config, src/constants, src/lib, src/types, src/components, src/features, src/offline, src/i18n, src/pages)
- [ ] Create .env.example with all required keys
- [ ] Create src/config/env.ts (typed env access)
- [ ] Create src/lib/supabaseClient.ts
- [ ] Create src/lib/queryClient.ts
- [ ] Create src/lib/errors.ts (AppError type)
- [ ] Create src/lib/dates.ts
- [ ] Create src/constants/roles.ts
- [ ] Create src/constants/permissions.ts
- [ ] Create src/constants/statuses.ts
- [ ] Create src/constants/routes.ts
- [ ] Set up react-i18next, create i18n/index.ts + locales/en.json + hi.json + or.json (empty shells)
- [ ] Create src/app/featureRegistry.ts (empty shell)
- [ ] Create src/app/router.tsx (shell, reads featureRegistry)
- [ ] Create src/app/providers.tsx
- [ ] Create src/app/App.tsx
- [ ] Initial git commit

---

## Phase 1 — Database

- [ ] Write supabase/migrations/001_org.sql (streams, departments, section_slots, hostels, canteens)
- [ ] Write supabase/migrations/002_users.sql (profiles, pre_registered_students)
- [ ] Write supabase/migrations/003_slots_enrollments.sql
- [ ] Write supabase/migrations/004_applications.sql (application_types, approval_steps, applications, step_logs)
- [ ] Write supabase/migrations/005_issues.sql (complaints, issue_comments, issue_upvotes, issue_categories)
- [ ] Write supabase/migrations/006_groups_messages.sql (groups, dm_threads, messages, notice_reads)
- [ ] Write supabase/migrations/007_payments.sql
- [ ] Write supabase/migrations/008_attendance.sql
- [ ] Write supabase/migrations/009_audit_events.sql (events table + audit_logs + DB triggers)
- [ ] Write supabase/migrations/010_config.sql (app_settings, role_permissions, notification_templates)
- [ ] Write supabase/migrations/011_rls_org.sql
- [ ] Write supabase/migrations/012_rls_users.sql
- [ ] Write supabase/migrations/013_rls_applications.sql
- [ ] Write supabase/migrations/014_rls_issues.sql
- [ ] Write supabase/migrations/015_rls_messages.sql
- [ ] Write supabase/migrations/016_rls_payments.sql
- [ ] Write supabase/migrations/017_rls_attendance.sql
- [ ] Write supabase/migrations/018_rls_audit.sql
- [ ] Run all migrations against Supabase project
- [ ] Generate src/types/database.ts (supabase gen types)
- [ ] Write supabase/seed/config/application_types.json (leave, hostel leave, registration, gate pass)
- [ ] Write supabase/seed/config/app_settings.json (escalation_timeout_hours=48, gatepass_validity_hours=4, similarity_threshold=0.7, etc.)
- [ ] Write supabase/seed/config/issue_categories.json
- [ ] Write supabase/seed.sql (demo college: 1 principal, 1 admin, 2 HODs, 4 teachers, 20 students, 2 hostels, 1 warden, 1 canteen, 1 accounts, 1 security, sample data)
- [ ] Run seed.sql
- [ ] Update docs/DATABASE.md + FILE_MAP.md

---

## Phase 2 — Auth & Roles

- [ ] Create features/auth/services/authService.ts (login, logout, signUp, getSession)
- [ ] Create features/auth/services/onboardingService.ts (roll-number check, profile upsert)
- [ ] Create features/auth/hooks/useAuth.ts
- [ ] Create features/auth/hooks/useOnboarding.ts
- [ ] Create features/auth/schemas.ts (zod: loginSchema, studentOnboardSchema, staffOnboardSchema)
- [ ] Create features/auth/components/LoginForm.tsx
- [ ] Create features/auth/components/StudentOnboardForm.tsx
- [ ] Create features/auth/components/StaffOnboardForm.tsx (admin-only invite flow)
- [ ] Create features/auth/components/LanguagePicker.tsx
- [ ] Create Zustand session store (src/app/sessionStore.ts): userId, role, name, language
- [ ] Create src/components/layout/RoleGuard.tsx
- [ ] Create pages/LoginPage.tsx
- [ ] Create pages/OnboardingPage.tsx
- [ ] Wire auth routes into featureRegistry + router
- [ ] Add i18n keys for auth (en/hi/or)
- [ ] Vitest: authService unit tests
- [ ] Update PROGRESS.md + FILE_MAP.md, git commit

---

## Phase 3 — App Shell & UI Kit

- [ ] Create src/components/ui/Button.tsx
- [ ] Create src/components/ui/Input.tsx
- [ ] Create src/components/ui/Card.tsx
- [ ] Create src/components/ui/Badge.tsx
- [ ] Create src/components/ui/Modal.tsx
- [ ] Create src/components/ui/Tabs.tsx
- [ ] Create src/components/ui/Table.tsx
- [ ] Create src/components/ui/Avatar.tsx
- [ ] Create src/components/feedback/Spinner.tsx
- [ ] Create src/components/feedback/AsyncBoundary.tsx
- [ ] Create src/components/feedback/EmptyState.tsx
- [ ] Create src/components/feedback/ErrorState.tsx
- [ ] Create src/components/layout/AppShell.tsx (Instagram-style: top bar + content + bottom nav)
- [ ] Create src/components/layout/BottomNav.tsx (Home / DM / Applications / Dashboard)
- [ ] Create src/components/layout/Sidebar.tsx (desktop breakpoint)
- [ ] Create pages/HomePage.tsx (shell, notices feed placeholder)
- [ ] Create pages/DashboardPage.tsx (role-aware, placeholder)
- [ ] Set up Tailwind design tokens (dark mode, glassmorphism, brand colors, fonts)
- [ ] Verify responsive layout on 360px wide (low-end phone)
- [ ] Update PROGRESS.md + FILE_MAP.md, git commit

---

## Phase 4 — Applications Engine

- [ ] Create features/applications/registry/steps/registry.ts (step handler map)
- [ ] Create features/applications/registry/steps/teacherReviewStep.ts
- [ ] Create features/applications/registry/steps/hodReviewStep.ts
- [ ] Create features/applications/registry/steps/wardenReviewStep.ts
- [ ] Create features/applications/registry/steps/principalReviewStep.ts
- [ ] Create features/applications/services/applicationTypeService.ts (fetch types + steps from DB)
- [ ] Create features/applications/services/applicationService.ts (submit, list, getById, decide)
- [ ] Create features/applications/services/workflowEngine.ts (advance step, trigger audit, escalate)
- [ ] Create features/applications/hooks/useApplicationTypes.ts
- [ ] Create features/applications/hooks/useMyApplications.ts
- [ ] Create features/applications/hooks/useApplicationDetail.ts
- [ ] Create features/applications/hooks/useApprovalQueue.ts (for teacher/HOD/warden)
- [ ] Create features/applications/components/DynamicFormRenderer.tsx (builds form from JSON schema)
- [ ] Create features/applications/components/ApplicationCard.tsx
- [ ] Create features/applications/components/ApprovalPanel.tsx (approve/decline with reason)
- [ ] Create features/applications/components/ApplicationPDF.tsx (PDF generation)
- [ ] Create features/applications/components/StatusTimeline.tsx (step-by-step audit view)
- [ ] Create features/applications/schemas.ts
- [ ] Create features/applications/types.ts
- [ ] Create pages/ApplicationsPage.tsx (submit + my applications list)
- [ ] Create pages/ApprovalQueuePage.tsx (teacher/HOD queue)
- [ ] Write supabase/functions/escalate-applications/index.ts
- [ ] Add i18n keys for applications
- [ ] Vitest: workflowEngine + applicationService tests
- [ ] Update PROGRESS.md + FILE_MAP.md, git commit

---

## Phase 5 — Gate Pass

- [ ] Create features/gatepass/services/gatepassService.ts (request, approve, decline, verify)
- [ ] Create features/gatepass/services/qrTokenService.ts (sign JWT, verify JWT)
- [ ] Create features/gatepass/hooks/useGatepassRequest.ts
- [ ] Create features/gatepass/hooks/useGatepassApproval.ts
- [ ] Create features/gatepass/hooks/useGatepassVerify.ts
- [ ] Create features/gatepass/components/GatepassRequestForm.tsx
- [ ] Create features/gatepass/components/GatepassQRCard.tsx (displays QR to student)
- [ ] Create features/gatepass/components/GuardScanScreen.tsx (camera scan + live result)
- [ ] Create features/gatepass/schemas.ts
- [ ] Create pages/GatepassPage.tsx (student view)
- [ ] Create pages/GuardVerifyPage.tsx (security role only)
- [ ] Write supabase/functions/verify-gatepass/index.ts (JWT verify endpoint)
- [ ] Add i18n keys for gatepass
- [ ] Vitest: qrTokenService (sign + verify + expiry)
- [ ] Update PROGRESS.md + FILE_MAP.md, git commit

---

## Phase 6 — Issue Board

- [ ] Create features/issues/services/issueService.ts (create, list, update status, upvote, comment)
- [ ] Create features/issues/services/duplicateCheckService.ts (Postgres text similarity query)
- [ ] Create features/issues/hooks/useIssueBoard.ts
- [ ] Create features/issues/hooks/useCreateIssue.ts
- [ ] Create features/issues/hooks/useIssueDetail.ts
- [ ] Create features/issues/components/IssueBoardList.tsx
- [ ] Create features/issues/components/IssueCard.tsx
- [ ] Create features/issues/components/IssueDetailPanel.tsx
- [ ] Create features/issues/components/NewIssueForm.tsx
- [ ] Create features/issues/components/DuplicateWarningBanner.tsx
- [ ] Create features/issues/components/CommentThread.tsx
- [ ] Create features/issues/schemas.ts
- [ ] Create pages/IssueBoardPage.tsx (hostel or canteen scoped)
- [ ] Create pages/WardenQueuePage.tsx
- [ ] Add i18n keys for issues
- [ ] Vitest: duplicateCheckService
- [ ] Update PROGRESS.md + FILE_MAP.md, git commit

---

## Phase 7 — Notices & Messaging

- [ ] Create features/messaging/groupTypes/sectionGroupType.ts
- [ ] Create features/messaging/groupTypes/hostelGroupType.ts
- [ ] Create features/messaging/groupTypes/yearGroupType.ts
- [ ] Create features/messaging/groupTypes/customGroupType.ts
- [ ] Create features/messaging/services/groupService.ts (list groups, resolve membership)
- [ ] Create features/messaging/services/messageService.ts (send, list, mark read, outbox sync)
- [ ] Create features/messaging/services/dmService.ts (create thread, list messages)
- [ ] Create features/messaging/hooks/useGroups.ts
- [ ] Create features/messaging/hooks/useMessages.ts
- [ ] Create features/messaging/hooks/useDMs.ts
- [ ] Create features/messaging/components/ConversationList.tsx (Instagram DM sidebar)
- [ ] Create features/messaging/components/ChatWindow.tsx
- [ ] Create features/messaging/components/MessageBubble.tsx (pending / sent / delivered / read)
- [ ] Create features/messaging/components/GroupsList.tsx (group tab inside DM section)
- [ ] Create features/notices/services/noticeService.ts (post, list, markRead, trackAction)
- [ ] Create features/notices/hooks/useNotices.ts
- [ ] Create features/notices/hooks/useNoticeTracking.ts
- [ ] Create features/notices/components/NoticeFeed.tsx (Home page feed)
- [ ] Create features/notices/components/NoticeCard.tsx
- [ ] Create features/notices/components/ComposeNotice.tsx (teacher/HOD/admin only)
- [ ] Set up Dexie: offline/dexieDb.ts (messages, outbox, notices tables)
- [ ] Create offline/outbox.ts (enqueue, dequeue, sync)
- [ ] Create offline/syncWorker.ts (service worker sync handler)
- [ ] Wire Supabase Realtime for new messages + notices
- [ ] Write supabase/functions/notify/index.ts (fan-out edge function)
- [ ] Pages: MessagingPage.tsx, NoticeBoardPage.tsx
- [ ] Add i18n keys for messaging + notices
- [ ] Vitest: messageService outbox idempotency test
- [ ] Update PROGRESS.md + FILE_MAP.md, git commit

---

## Phase 8 — Admin & Principal

- [ ] Create features/admin/services/userManagementService.ts (create, list, assign role)
- [ ] Create features/admin/services/orgManagementService.ts (bulk reassign, promote, merge)
- [ ] Create features/admin/services/promotionService.ts (year-end batch promotion job)
- [ ] Create features/admin/services/auditService.ts (list audit log with filters)
- [ ] Create features/admin/services/analyticsService.ts (pending count, ageing, resolution time, workload)
- [ ] Create features/admin/services/settingsService.ts (read/write app_settings, application_types, approval_steps)
- [ ] Create features/admin/hooks/useAdminDashboard.ts
- [ ] Create features/admin/hooks/useAuditLog.ts
- [ ] Create features/admin/hooks/useUserManagement.ts
- [ ] Create features/admin/hooks/useSettings.ts
- [ ] Create features/admin/components/DashboardMetrics.tsx (pending, ageing, workload cards)
- [ ] Create features/admin/components/AuditLogTable.tsx
- [ ] Create features/admin/components/UserTable.tsx
- [ ] Create features/admin/components/RoleAssignForm.tsx
- [ ] Create features/admin/components/BulkReassignPanel.tsx
- [ ] Create features/admin/components/PromotionPanel.tsx
- [ ] Create features/admin/components/ApplicationTypeEditor.tsx (admin settings — config UI)
- [ ] Create features/admin/components/FeatureFlagToggle.tsx
- [ ] Create pages/AdminDashboardPage.tsx
- [ ] Create pages/AdminUsersPage.tsx
- [ ] Create pages/AdminSettingsPage.tsx
- [ ] Create pages/PrincipalDashboardPage.tsx (read-only analytics + final escalation)
- [ ] Add i18n keys for admin
- [ ] Vitest: analyticsService query correctness
- [ ] Update PROGRESS.md + FILE_MAP.md, git commit

---

## Phase 9 — Payments & Attendance & Chatbot

- [ ] Create features/payments/services/paymentService.ts (upload proof, verify, generate receipt)
- [ ] Create features/payments/hooks/usePayments.ts
- [ ] Create features/payments/components/FeeStatus.tsx
- [ ] Create features/payments/components/ProofUploadForm.tsx
- [ ] Create features/payments/components/AccountsVerifyPanel.tsx
- [ ] Create features/payments/components/ReceiptView.tsx
- [ ] Create pages/PaymentsPage.tsx
- [ ] Create features/attendance/services/attendanceService.ts (mark, list, summary)
- [ ] Create features/attendance/hooks/useAttendance.ts
- [ ] Create features/attendance/components/AttendanceMarker.tsx (teacher view)
- [ ] Create features/attendance/components/AttendanceSummary.tsx (student view)
- [ ] Create pages/AttendancePage.tsx
- [ ] Create features/chatbot/services/chatbotService.ts (FAQ query + workflow data lookup)
- [ ] Create features/chatbot/hooks/useChatbot.ts
- [ ] Create features/chatbot/components/ChatbotWidget.tsx (floating button)
- [ ] Create features/chatbot/components/ChatbotPanel.tsx
- [ ] Add i18n keys for payments, attendance, chatbot
- [ ] Vitest: paymentService status transitions
- [ ] Update PROGRESS.md + FILE_MAP.md, git commit

---

## Phase 10 — Hardening & Packaging

- [ ] PWA offline test: throttle to offline, verify cached reads and outbox send
- [ ] Low-bandwidth pass: image lazy-load, compression before upload, paginated lists
- [ ] Language pass: verify all strings go through t(), en/hi/or all complete
- [ ] Accessibility pass: keyboard nav, contrast check, all inputs labelled
- [ ] Vitest coverage pass: all services have tests, all tests green
- [ ] Performance pass: React.lazy / code splitting per feature
- [ ] Add Capacitor + configure Android build
- [ ] Write demo script (3 MVP workflows end-to-end)
- [ ] Write adoption note slide
- [ ] Final git tag: v1.0.0-hackathon
- [ ] Update all docs

---

## Notes

- Hackathon MVP focus: Gate Pass (Phase 5) + Issue Board (Phase 6) + Notices (Phase 7) + Admin Dashboard (Phase 8) demonstrated together with offline queue.
- Each checkbox is scoped to one file or one small group of related files — small enough to finish in a single response.
- Do not start a new phase until PROGRESS.md says the previous is complete and the project compiles.
