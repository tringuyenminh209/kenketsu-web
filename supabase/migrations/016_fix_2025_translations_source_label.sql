-- ==============================================================================
-- Migration 016: Sua loi migration 015 nap nham gia tri cho source_label
-- trong `translations` (nam 2025). Migration 015 vo tinh lay noi dung cua
-- khoa "lastYear.sourceLabel" (chi la tien to co dinh, vd "出典："/"Nguồn: ")
-- thay vi "lastYear.sourceLink" (noi dung hien thi that su cua link nguon),
-- khien trang web hien lap "Nguồn: Nguồn:".
-- File: supabase/migrations/016_fix_2025_translations_source_label.sql
-- ==============================================================================

UPDATE public.event_memories
SET translations =
  jsonb_set(translations, '{en,source_label}', '"ECC Social Action Center Activity Report"')
  || jsonb_build_object('vi', (translations->'vi') || jsonb_build_object('source_label', 'Báo cáo hoạt động ECC Trung tâm Đóng góp Xã hội'))
  || jsonb_build_object('zh', (translations->'zh') || jsonb_build_object('source_label', 'ECC社会贡献・国际交流中心 活动报告'))
  || jsonb_build_object('my', (translations->'my') || jsonb_build_object('source_label', 'ECC လူမှုရေးလှုပ်ရှားမှုဌာန လှုပ်ရှားမှုအစီရင်ခံစာ'))
  || jsonb_build_object('ne', (translations->'ne') || jsonb_build_object('source_label', 'ECC सामाजिक गतिविधि केन्द्र गतिविधि प्रतिवेदन'))
  || jsonb_build_object('uz', (translations->'uz') || jsonb_build_object('source_label', 'ECC Ijtimoiy faoliyat markazining hisoboti'))
  || jsonb_build_object('bn', (translations->'bn') || jsonb_build_object('source_label', 'ইসিসি সোশ্যাল অ্যাকশন সেন্টারের কার্যক্রমের রিপোর্ট'))
  || jsonb_build_object('id', (translations->'id') || jsonb_build_object('source_label', 'Laporan Aktivitas Pusat Aksi Sosial ECC'))
  || jsonb_build_object('ko', (translations->'ko') || jsonb_build_object('source_label', 'ECC 사회공헌센터 활동 보고서'))
  || jsonb_build_object('th', (translations->'th') || jsonb_build_object('source_label', 'รายงานสรุปกิจกรรมศูนย์ช่วยเหลือสังคมสถาบัน ECC'))
  || jsonb_build_object('si', (translations->'si') || jsonb_build_object('source_label', 'ECC සමාජ සේවා මධ්‍යස්ථානයේ ක්‍රියාකාරකම් වාර්තාව'))
WHERE event_year = 2025;
