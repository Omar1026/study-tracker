create table if not exists public.study_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  subject text not null check (char_length(trim(subject)) between 1 and 60),
  duration integer not null check (duration between 1 and 1440),
  note text not null default '' check (char_length(note) <= 240),
  study_date date not null default current_date,
  created_at timestamptz not null default now()
);

create index if not exists study_sessions_user_date_idx
on public.study_sessions (user_id, study_date, created_at desc);

alter table public.study_sessions enable row level security;
grant select, insert, update, delete on public.study_sessions to authenticated;

drop policy if exists "Students can read their own sessions" on public.study_sessions;
drop policy if exists "Students can add their own sessions" on public.study_sessions;
drop policy if exists "Students can update their own sessions" on public.study_sessions;
drop policy if exists "Students can delete their own sessions" on public.study_sessions;

create policy "Students can read their own sessions"
on public.study_sessions for select to authenticated
using ((select auth.uid()) = user_id);

create policy "Students can add their own sessions"
on public.study_sessions for insert to authenticated
with check ((select auth.uid()) = user_id);

create policy "Students can update their own sessions"
on public.study_sessions for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Students can delete their own sessions"
on public.study_sessions for delete to authenticated
using ((select auth.uid()) = user_id);
-- «اجتماع النقط»: جداول المهام والتخطيط الأسبوعي.

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null check (char_length(trim(title)) between 1 and 120),
  due_date date,
  done boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists tasks_user_done_idx
on public.tasks (user_id, done, due_date nulls last, created_at desc);

alter table public.tasks enable row level security;
grant select, insert, update, delete on public.tasks to authenticated;

drop policy if exists "Students can read their own tasks" on public.tasks;
drop policy if exists "Students can add their own tasks" on public.tasks;
drop policy if exists "Students can update their own tasks" on public.tasks;
drop policy if exists "Students can delete their own tasks" on public.tasks;

create policy "Students can read their own tasks"
on public.tasks for select to authenticated
using ((select auth.uid()) = user_id);

create policy "Students can add their own tasks"
on public.tasks for insert to authenticated
with check ((select auth.uid()) = user_id);

create policy "Students can update their own tasks"
on public.tasks for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Students can delete their own tasks"
on public.tasks for delete to authenticated
using ((select auth.uid()) = user_id);

-- بنود التخطيط الأسبوعي المتكرر (لكل يوم من أيام الأسبوع).
create table if not exists public.plan_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null check (char_length(trim(title)) between 1 and 120),
  weekday smallint not null check (weekday between 1 and 7),
  start_time time,
  created_at timestamptz not null default now()
);

create index if not exists plan_items_user_weekday_idx
on public.plan_items (user_id, weekday, created_at);

alter table public.plan_items enable row level security;
grant select, insert, update, delete on public.plan_items to authenticated;

drop policy if exists "Students can read their own plans" on public.plan_items;
drop policy if exists "Students can add their own plans" on public.plan_items;
drop policy if exists "Students can update their own plans" on public.plan_items;
drop policy if exists "Students can delete their own plans" on public.plan_items;

create policy "Students can read their own plans"
on public.plan_items for select to authenticated
using ((select auth.uid()) = user_id);

create policy "Students can add their own plans"
on public.plan_items for insert to authenticated
with check ((select auth.uid()) = user_id);

create policy "Students can update their own plans"
on public.plan_items for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Students can delete their own plans"
on public.plan_items for delete to authenticated
using ((select auth.uid()) = user_id);

