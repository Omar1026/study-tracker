-- تعديل نطاق أيام الأسبوع في plan_items ليطابق قيم getDay للواجهة:
-- الأحد 0 إلى السبت 6. يُبقي السجلات الحالية كما هي ويتيح حفظ بنود يوم الأحد.
alter table public.plan_items drop constraint if exists plan_items_weekday_check;
alter table public.plan_items
  add constraint plan_items_weekday_check check (weekday between 0 and 6);
