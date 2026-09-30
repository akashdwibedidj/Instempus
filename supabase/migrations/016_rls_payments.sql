-- 016_rls_payments.sql — RLS policies for payment tables
-- Append-only. Never edit this file; create a new migration for changes.
-- Run AFTER 007_payments.sql.

-- ─── fee_items ────────────────────────────────────────────────────────────────

-- All authenticated users can read active fee items (to know what they owe).
create policy "fee_items: authenticated read active"
  on public.fee_items for select
  to authenticated
  using (is_active = true);

-- Admin sees all fee items including inactive.
create policy "fee_items: admin read all"
  on public.fee_items for select
  to authenticated
  using (public.current_user_role() = 'admin');

-- Only admin or accounts staff can create/update fee catalogue.
create policy "fee_items: admin write"
  on public.fee_items for all
  to authenticated
  using  (public.current_user_role() in ('admin', 'accounts'))
  with check (public.current_user_role() in ('admin', 'accounts'));

-- ─── payments ─────────────────────────────────────────────────────────────────

-- Student sees their own payment records.
create policy "payments: student read own"
  on public.payments for select
  to authenticated
  using (student_id = auth.uid());

-- Student submits a payment (insert).
create policy "payments: student insert"
  on public.payments for insert
  to authenticated
  with check (
    student_id = auth.uid()
    and public.current_user_role() = 'student'
  );

-- Student can re-upload proof when payment was rejected (update proof_ref only).
create policy "payments: student update rejected"
  on public.payments for update
  to authenticated
  using (
    student_id = auth.uid()
    and status = 'rejected'
  )
  with check (
    student_id = auth.uid()
    and status = 'pending'    -- re-upload resets status to pending
  );

-- Accounts staff sees all pending/rejected payments (their verification queue).
create policy "payments: accounts read queue"
  on public.payments for select
  to authenticated
  using (
    public.current_user_role() = 'accounts'
    and status in ('pending', 'rejected')
  );

-- Accounts staff can verify or reject payments.
create policy "payments: accounts verify"
  on public.payments for update
  to authenticated
  using  (public.current_user_role() = 'accounts')
  with check (
    public.current_user_role() = 'accounts'
    and status in ('confirmed', 'rejected')
  );

-- Admin sees all payments.
create policy "payments: admin read all"
  on public.payments for select
  to authenticated
  using (public.current_user_role() in ('admin', 'principal'));

-- Admin can update any payment (manual correction).
create policy "payments: admin update all"
  on public.payments for update
  to authenticated
  using  (public.current_user_role() = 'admin')
  with check (public.current_user_role() = 'admin');
