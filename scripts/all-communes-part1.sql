-- ============================================================
-- COMMUNES PART 1 (Lines 1-500 from CSV)
-- Casablanca-Settat region communes (continuing from existing)
-- ============================================================

-- Missing communes for SETTAT (prefecture_id needs to be determined)
-- Missing communes for BENSLIMANE
-- Missing communes for CASABLANCA districts
-- Missing communes for SIDI BENNOUR

-- From CSV lines 750-849 (Casablanca-Settat region):
INSERT INTO communes (name, prefecture_id) VALUES
-- SETTAT additional communes
('صكامة', (SELECT id FROM prefectures WHERE name = 'سطات')),
('عين دربان - الحلف', (SELECT id FROM prefectures WHERE name = 'سطات')),
('كيسر', (SELECT id FROM prefectures WHERE name = 'سطات')),
('سيدي دحبي', (SELECT id FROM prefectures WHERE name = 'سطات')),
('سيدي بومهدي', (SELECT id FROM prefectures WHERE name = 'سطات')),
('سيدي أحمد الخضير', (SELECT id FROM prefectures WHERE name = 'سطات')),
('سيدي عبد الكريم', (SELECT id FROM prefectures WHERE name = 'سطات')),
('نخيلة', (SELECT id FROM prefectures WHERE name = 'سطات')),
('مزورة', (SELECT id FROM prefectures WHERE name = 'سطات')),
('مزامزة الجنوبية', (SELECT id FROM prefectures WHERE name = 'سطات')),
('مريزيق', (SELECT id FROM prefectures WHERE name = 'سطات')),
('منياعة', (SELECT id FROM prefectures WHERE name = 'سطات')),
('مسكورة', (SELECT id FROM prefectures WHERE name = 'سطات')),
('مشرع بن عبو', (SELECT id FROM prefectures WHERE name = 'سطات')),
('مكارطو', (SELECT id FROM prefectures WHERE name = 'سطات')),
('كدانة', (SELECT id FROM prefectures WHERE name = 'سطات')),
('البروج', (SELECT id FROM prefectures WHERE name = 'سطات')),
('دار الشفاعي', (SELECT id FROM prefectures WHERE name = 'سطات')),
('بوكركوه', (SELECT id FROM prefectures WHERE name = 'سطات')),
('بني ياقرين', (SELECT id FROM prefectures WHERE name = 'سطات')),
('بني خلوق', (SELECT id FROM prefectures WHERE name = 'سطات')),
('ابن أحمد', (SELECT id FROM prefectures WHERE name = 'سطات')),
('عين بلال', (SELECT id FROM prefectures WHERE name = 'سطات')),
('سيدي حجاج', (SELECT id FROM prefectures WHERE name = 'سطات')),
('سيدي العايدي', (SELECT id FROM prefectures WHERE name = 'سطات')),
('سيدي محمد بن رحال', (SELECT id FROM prefectures WHERE name = 'سطات')),
('أولاد سعيد', (SELECT id FROM prefectures WHERE name = 'سطات')),
('رأس العين الشاوية', (SELECT id FROM prefectures WHERE name = 'سطات')),
('ريمة', (SELECT id FROM prefectures WHERE name = 'سطات')),
('تولعات', (SELECT id FROM prefectures WHERE name = 'سطات')),
('أولاد صغير', (SELECT id FROM prefectures WHERE name = 'سطات')),
('أولاد امراح', (SELECT id FROM prefectures WHERE name = 'سطات')),
('أولاد محمد', (SELECT id FROM prefectures WHERE name = 'سطات')),
('أولاد فريحة', (SELECT id FROM prefectures WHERE name = 'سطات')),
('أولاد فارس الحلة', (SELECT id FROM prefectures WHERE name = 'سطات')),
('أولاد فارس', (SELECT id FROM prefectures WHERE name = 'سطات')),
('أولاد شبانة', (SELECT id FROM prefectures WHERE name = 'سطات')),
('أولاد بوعلي نواجة', (SELECT id FROM prefectures WHERE name = 'سطات')),
('أولاد عامر', (SELECT id FROM prefectures WHERE name = 'سطات')),
('واد النعناع', (SELECT id FROM prefectures WHERE name = 'سطات')),
('لولاد', (SELECT id FROM prefectures WHERE name = 'سطات')),
('لقراقرة', (SELECT id FROM prefectures WHERE name = 'سطات')),
('لخزازرة', (SELECT id FROM prefectures WHERE name = 'سطات')),
('الحوازة', (SELECT id FROM prefectures WHERE name = 'سطات')),
('الخميسات الشاوية', (SELECT id FROM prefectures WHERE name = 'سطات')),
('سطات', (SELECT id FROM prefectures WHERE name = 'سطات'));

-- BENSLIMANE communes
INSERT INTO communes (name, prefecture_id) VALUES
('زيايدة', (SELECT id FROM prefectures WHERE name = 'بن سليمان')),
('سيدي بطاش', (SELECT id FROM prefectures WHERE name = 'بن سليمان')),
('ردادنة أولاد مالك', (SELECT id FROM prefectures WHERE name = 'بن سليمان')),
('موالين الواد', (SELECT id FROM prefectures WHERE name = 'بن سليمان')),
('مليلة', (SELECT id FROM prefectures WHERE name = 'بن سليمان')),
('فضالات', (SELECT id FROM prefectures WHERE name = 'بن سليمان')),
('المنصورية', (SELECT id FROM prefectures WHERE name = 'بن سليمان')),
('شراط', (SELECT id FROM prefectures WHERE name = 'بن سليمان')),
('بوزنيقة', (SELECT id FROM prefectures WHERE name = 'بن سليمان')),
('بئر الناصر', (SELECT id FROM prefectures WHERE name = 'بن سليمان')),
('عين تزغة', (SELECT id FROM prefectures WHERE name = 'بن سليمان')),
('أحلاف', (SELECT id FROM prefectures WHERE name = 'بن سليمان')),
('أولاد يحيى لوطة', (SELECT id FROM prefectures WHERE name = 'بن سليمان')),
('أولاد علي الطوالع', (SELECT id FROM prefectures WHERE name = 'بن سليمان')),
('بن سليمان', (SELECT id FROM prefectures WHERE name = 'بن سليمان'));

-- Note: This is a partial file. The complete migration requires all communes to be added.
