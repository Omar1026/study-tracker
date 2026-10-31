-- «اجتماع النقط»: ترقية المهام (الأولوية والتكرار) وتصحيح نطاق أيام الخطة.
-- تُطبّق بأمان على قاعدة بيانات قائمة (idempotent) وتُكمل ما بدأه
-- ملف 20261028120000_tasks_and_plans.sql.

-- 1) أولوية المهمة وتكرارها.
alter table public.tasks add column if not exists priority text not null default 'normal';
alter table public.tasks add column if not exists recurrence text not null default 'none';

alter table public.tasks drop constraint if exists tasks_priority_check;
alter table public.tasks add constraint tasks_priority_check
  check (priority in ('high', 'normal', 'low'));

alter table public.tasks drop constraint if exists tasks_recurrence_check;
alter table public.tasks add constraint tasks_recurrence_check
  check (recurrence in ('none', 'daily', 'weekly', 'monthly'));

-- 2) أيام الأسبوع في التطبيق: 0 = الأحد … 6 = السبت
--    (القيود القديمة كانت 1..7 فكانت تمنع إضافة الأحد).
alter table public.plan_items drop constraint if exists plan_items_weekday_check;
alter table public.plan_items add constraint plan_items_weekday_check
  check (weekday between 0 and 6);
