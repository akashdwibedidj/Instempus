-- 014_rls_issues.sql — RLS policies for issue board tables
-- Append-only. Never edit this file; create a new migration for changes.
-- Run AFTER 005_issues.sql.

-- ─── issue_categories ─────────────────────────────────────────────────────────
-- All authenticated users can read categories (to show the submit form).
create policy "issue_categories: authenticated read"
  on public.issue_categories for select
  to authenticated
  using (is_active = true);

create policy "issue_categories: admin write"
  on public.issue_categories for all
  to authenticated
  using  (public.current_user_role() = 'admin')
  with check (public.current_user_role() = 'admin');

-- ─── complaints ───────────────────────────────────────────────────────────────

-- Any authenticated user can see complaints in their own hostel or canteen scope.
-- Scope check: student's hostel_id matches scope_id, or canteen is open to all.
create policy "complaints: member read own scope"
  on public.complaints for select
  to authenticated
  using (
    -- hostel residents see their hostel's complaints
    (scope_type = 'hostel' and scope_id = (
      select hostel_id from public.profiles where id = auth.uid()
    ))
    or
    -- canteen complaints visible to everyone (canteen is shared)
    (scope_type = 'canteen')
  );

-- Warden sees all complaints for their hostel.
create policy "complaints: warden read own hostel"
  on public.complaints for select
  to authenticated
  using (
    public.current_user_role() = 'warden'
    and scope_type = 'hostel'
    and scope_id = (
      select hostel_id from public.profiles where id = auth.uid()
    )
  );

-- Canteen manager sees their canteen's complaints.
create policy "complaints: canteen read own scope"
  on public.complaints for select
  to authenticated
  using (
    public.current_user_role() = 'canteen'
    and scope_type = 'canteen'
    and scope_id = (
      select hostel_id from public.profiles where id = auth.uid()
    )
  );

-- Admin and principal see all complaints.
create policy "complaints: admin read all"
  on public.complaints for select
  to authenticated
  using (public.current_user_role() in ('admin', 'principal'));

-- Submitter can create a complaint.
create policy "complaints: submitter insert"
  on public.complaints for insert
  to authenticated
  with check (submitter_id = auth.uid());

-- Submitter can update their own open complaint (edit title/body, withdraw).
create policy "complaints: submitter update own"
  on public.complaints for update
  to authenticated
  using (submitter_id = auth.uid() and status = 'open')
  with check (submitter_id = auth.uid());

-- Warden / canteen manager can update status (in_progress, resolved, dismissed).
create policy "complaints: resolver update status"
  on public.complaints for update
  to authenticated
  using (
    public.current_user_role() in ('warden', 'canteen', 'admin')
    and (
      (scope_type = 'hostel' and public.current_user_role() = 'warden')
      or (scope_type = 'canteen' and public.current_user_role() = 'canteen')
      or public.current_user_role() = 'admin'
    )
  )
  with check (true);

-- ─── issue_comments ───────────────────────────────────────────────────────────

-- Anyone who can see the complaint can read its comments.
-- Reuse same scope logic via subquery.
create policy "issue_comments: read if complaint visible"
  on public.issue_comments for select
  to authenticated
  using (
    exists (
      select 1 from public.complaints c
      where c.id = issue_comments.complaint_id
        and (
          c.scope_type = 'canteen'
          or c.scope_id = (select hostel_id from public.profiles where id = auth.uid())
          or public.current_user_role() in ('admin', 'principal', 'warden', 'canteen')
        )
    )
  );

-- Authenticated users can comment on visible complaints.
create policy "issue_comments: authenticated insert"
  on public.issue_comments for insert
  to authenticated
  with check (author_id = auth.uid());

-- Author can delete their own comment.
create policy "issue_comments: author delete"
  on public.issue_comments for delete
  to authenticated
  using (author_id = auth.uid());

-- ─── issue_upvotes ────────────────────────────────────────────────────────────

-- Read upvotes for any visible complaint.
create policy "issue_upvotes: authenticated read"
  on public.issue_upvotes for select
  to authenticated
  using (true);

-- Users can upvote (insert) once — enforced by unique constraint.
create policy "issue_upvotes: authenticated insert"
  on public.issue_upvotes for insert
  to authenticated
  with check (user_id = auth.uid());

-- Users can remove their own upvote.
create policy "issue_upvotes: owner delete"
  on public.issue_upvotes for delete
  to authenticated
  using (user_id = auth.uid());
