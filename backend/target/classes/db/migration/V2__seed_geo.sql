-- V2__seed_geo.sql
-- Create geographic tables

CREATE TABLE IF NOT EXISTS regions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS prefectures (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    region_id BIGINT NOT NULL,
    FOREIGN KEY (region_id) REFERENCES regions(id)
);

CREATE TABLE IF NOT EXISTS communes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    prefecture_id BIGINT NOT NULL,
    FOREIGN KEY (prefecture_id) REFERENCES prefectures(id)
);

CREATE INDEX idx_prefectures_region ON prefectures(region_id);
CREATE INDEX idx_communes_prefecture ON communes(prefecture_id);

-- Seed Moroccan Regions (12 regions)
INSERT INTO regions (id, name) VALUES
(1, 'طنجة-تطوان-الحسيمة'),
(2, 'الشرق'),
(3, 'فاس-مكناس'),
(4, 'الرباط-سلا-القنيطرة'),
(5, 'بني ملال-خنيفرة'),
(6, 'الدار البيضاء-سطات'),
(7, 'مراكش-آسفي'),
(8, 'درعة-تافيلالت'),
(9, 'سوس-ماسة'),
(10, 'كلميم-واد نون'),
(11, 'العيون-الساقية الحمراء'),
(12, 'الداخلة-وادي الذهب');

-- Seed Prefectures/Provinces for each region

-- Region 1: Tanger-Tétouan-Al Hoceïma
INSERT INTO prefectures (id, name, region_id) VALUES
(1, 'طنجة-أصيلة', 1),
(2, 'المضيق-الفنيدق', 1),
(3, 'تطوان', 1),
(4, 'الفحص-أنجرة', 1),
(5, 'العرائش', 1),
(6, 'الحسيمة', 1),
(7, 'شفشاون', 1),
(8, 'وزان', 1);

-- Region 2: Oriental
INSERT INTO prefectures (id, name, region_id) VALUES
(9, 'وجدة-أنجاد', 2),
(10, 'الناظور', 2),
(11, 'الدريوش', 2),
(12, 'جرادة', 2),
(13, 'بركان', 2),
(14, 'تاوريرت', 2),
(15, 'جرسيف', 2),
(16, 'فجيج', 2);

-- Region 3: Fès-Meknès
INSERT INTO prefectures (id, name, region_id) VALUES
(17, 'فاس', 3),
(18, 'مكناس', 3),
(19, 'الحاجب', 3),
(20, 'إفران', 3),
(21, 'مولاي يعقوب', 3),
(22, 'صفرو', 3),
(23, 'بولمان', 3),
(24, 'تاونات', 3),
(25, 'تازة', 3);

-- Region 4: Rabat-Salé-Kénitra
INSERT INTO prefectures (id, name, region_id) VALUES
(26, 'الرباط', 4),
(27, 'سلا', 4),
(28, 'الصخيرات-تمارة', 4),
(29, 'القنيطرة', 4),
(30, 'الخميسات', 4),
(31, 'سيدي قاسم', 4),
(32, 'سيدي سليمان', 4);

-- Region 5: Béni Mellal-Khénifra
INSERT INTO prefectures (id, name, region_id) VALUES
(33, 'بني ملال', 5),
(34, 'أزيلال', 5),
(35, 'الفقيه بن صالح', 5),
(36, 'خنيفرة', 5),
(37, 'خريبكة', 5);

-- Region 6: Casablanca-Settat
INSERT INTO prefectures (id, name, region_id) VALUES
(38, 'الدار البيضاء', 6),
(39, 'المحمدية', 6),
(40, 'الجديدة', 6),
(41, 'النواصر', 6),
(42, 'مديونة', 6),
(43, 'بن سليمان', 6),
(44, 'برشيد', 6),
(45, 'سطات', 6),
(46, 'سيدي بنور', 6);

-- Region 7: Marrakech-Safi
INSERT INTO prefectures (id, name, region_id) VALUES
(47, 'مراكش', 7),
(48, 'شيشاوة', 7),
(49, 'الحوز', 7),
(50, 'قلعة السراغنة', 7),
(51, 'الصويرة', 7),
(52, 'الرحامنة', 7),
(53, 'آسفي', 7),
(54, 'اليوسفية', 7);

-- Region 8: Drâa-Tafilalet
INSERT INTO prefectures (id, name, region_id) VALUES
(55, 'الرشيدية', 8),
(56, 'ورزازات', 8),
(57, 'ميدلت', 8),
(58, 'تنغير', 8),
(59, 'زاكورة', 8);

-- Region 9: Souss-Massa
INSERT INTO prefectures (id, name, region_id) VALUES
(60, 'أكادير-إدا أوتانان', 9),
(61, 'إنزكان-أيت ملول', 9),
(62, 'شتوكة-آيت باها', 9),
(63, 'تارودانت', 9),
(64, 'تيزنيت', 9),
(65, 'طاطا', 9);

-- Region 10: Guelmim-Oued Noun
INSERT INTO prefectures (id, name, region_id) VALUES
(66, 'كلميم', 10),
(67, 'أسا-الزاك', 10),
(68, 'طانطان', 10),
(69, 'سيدي إفني', 10);

-- Region 11: Laâyoune-Sakia El Hamra
INSERT INTO prefectures (id, name, region_id) VALUES
(70, 'العيون', 11),
(71, 'بوجدور', 11),
(72, 'طرفاية', 11),
(73, 'السمارة', 11);

-- Region 12: Dakhla-Oued Ed-Dahab
INSERT INTO prefectures (id, name, region_id) VALUES
(74, 'وادي الذهب', 12),
(75, 'أوسرد', 12);

-- Sample communes for major prefectures (abbreviated for brevity - add more as needed)

-- Communes for Tanger-Assilah
INSERT INTO communes (name, prefecture_id) VALUES
('طنجة المدينة', 1),
('أصيلة', 1),
('الغربية', 1),
('العوامة', 1),
('مقريصات', 1);

-- Communes for Tétouan
INSERT INTO communes (name, prefecture_id) VALUES
('تطوان', 3),
('المرتيل', 3),
('الفنيدق', 3),
('عزلا', 3),
('بني حزمار', 3);

-- Communes for Al Hoceïma
INSERT INTO communes (name, prefecture_id) VALUES
('الحسيمة', 6),
('إمزورن', 6),
('بني بوعياش', 6),
('تاركيست', 6),
('أجدير', 6);

-- Communes for Oujda-Angad
INSERT INTO communes (name, prefecture_id) VALUES
('وجدة', 9),
('بني درار', 9),
('سيدي يحيى', 9),
('العيون سيدي ملوك', 9);

-- Communes for Nador
INSERT INTO communes (name, prefecture_id) VALUES
('الناظور', 10),
('زايو', 10),
('سلوان', 10),
('العروي', 10),
('بني أنصار', 10);

-- Communes for Fès
INSERT INTO communes (name, prefecture_id) VALUES
('فاس', 17),
('الزواغة', 17),
('مشرع حمادي', 17),
('سيدي حرازم', 17);

-- Communes for Meknès
INSERT INTO communes (name, prefecture_id) VALUES
('مكناس', 18),
('الحاجب', 18),
('توليت', 18),
('ويسلان', 18);

-- Communes for Rabat
INSERT INTO communes (name, prefecture_id) VALUES
('الرباط', 26),
('أكدال الرياض', 26),
('السويسي', 26),
('اليوسفية', 26);

-- Communes for Salé
INSERT INTO communes (name, prefecture_id) VALUES
('سلا الجديدة', 27),
('العيايدة', 27),
('سيدي موسى', 27),
('لمريسة', 27);

-- Communes for Kénitra
INSERT INTO communes (name, prefecture_id) VALUES
('القنيطرة', 29),
('المهدية', 29),
('سيدي الطيبي', 29),
('سيدي يحيى الغرب', 29);

-- Communes for Béni Mellal
INSERT INTO communes (name, prefecture_id) VALUES
('بني ملال', 33),
('قصبة تادلة', 33),
('فم العنصر', 33),
('سوق السبت', 33);

-- Communes for Casablanca
INSERT INTO communes (name, prefecture_id) VALUES
('عين الشق', 38),
('عين السبع-الحي المحمدي', 38),
('الفداء-مرس السلطان', 38),
('بن مسيك', 38),
('سباتة', 38),
('المعاريف', 38),
('أنفا', 38),
('سيدي بليوط', 38);

-- Communes for Mohammedia
INSERT INTO communes (name, prefecture_id) VALUES
('المحمدية', 39),
('عين حرودة', 39),
('بني يخلف', 39),
('المجاطية أولاد طالب', 39);

-- Communes for El Jadida
INSERT INTO communes (name, prefecture_id) VALUES
('الجديدة', 40),
('أزمور', 40),
('سيدي بوزيد', 40),
('مولاي عبد الله', 40);

-- Communes for Settat
INSERT INTO communes (name, prefecture_id) VALUES
('سطات', 45),
('برشيد', 45),
('بن أحمد', 45),
('الدروة', 45);

-- Communes for Marrakech
INSERT INTO communes (name, prefecture_id) VALUES
('المنارة', 47),
('جليز', 47),
('المدينة', 47),
('سيدي يوسف بن علي', 47),
('النخيل', 47),
('مشوار القصبة', 47);

-- Communes for Al Haouz
INSERT INTO communes (name, prefecture_id) VALUES
('تحناوت', 49),
('أمزميز', 49),
('أسني', 49),
('ويركان', 49);

-- Communes for Safi
INSERT INTO communes (name, prefecture_id) VALUES
('آسفي', 53),
('الشماعية', 53),
('جمعة سحيم', 53),
('اليوسفية', 53);

-- Communes for Errachidia
INSERT INTO communes (name, prefecture_id) VALUES
('الرشيدية', 55),
('أرفود', 55),
('الريصاني', 55),
('كلعة مكونة', 55);

-- Communes for Ouarzazate
INSERT INTO communes (name, prefecture_id) VALUES
('ورزازات', 56),
('تنغير', 56),
('سكورة', 56),
('زاكورة', 56);

-- Communes for Agadir
INSERT INTO communes (name, prefecture_id) VALUES
('أكادير', 60),
('الدشيرة الجهادية', 60),
('تيكوين', 60),
('بنسركاو', 60);

-- Communes for Inezgane-Aït Melloul
INSERT INTO communes (name, prefecture_id) VALUES
('إنزكان', 61),
('أيت ملول', 61),
('الدشيرة الجهادية', 61),
('تمسية', 61);

-- Communes for Taroudant
INSERT INTO communes (name, prefecture_id) VALUES
('تارودانت', 63),
('أولاد تايمة', 63),
('أولاد برحيل', 63),
('إغرم', 63);

-- Communes for Tiznit
INSERT INTO communes (name, prefecture_id) VALUES
('تيزنيت', 64),
('أكلو', 64),
('تافراوت', 64),
('سيدي إفني', 64);

-- Communes for Guelmim
INSERT INTO communes (name, prefecture_id) VALUES
('كلميم', 66),
('أبينو', 66),
('تكانت', 66),
('أسرير', 66);

-- Communes for Tan-Tan
INSERT INTO communes (name, prefecture_id) VALUES
('طانطان', 68),
('الوطية', 68),
('بن خليل', 68);

-- Communes for Laâyoune
INSERT INTO communes (name, prefecture_id) VALUES
('العيون', 70),
('المرسى', 70),
('بوكراع', 70);

-- Communes for Dakhla
INSERT INTO communes (name, prefecture_id) VALUES
('الداخلة', 74),
('بئر كندوز', 74),
('كليميم', 74);

-- Add foreign key columns to institutions table
ALTER TABLE institutions ADD COLUMN region_id BIGINT;
ALTER TABLE institutions ADD COLUMN prefecture_id BIGINT;
ALTER TABLE institutions ADD COLUMN commune_id BIGINT;

ALTER TABLE institutions ADD CONSTRAINT fk_institutions_region 
    FOREIGN KEY (region_id) REFERENCES regions(id);
ALTER TABLE institutions ADD CONSTRAINT fk_institutions_prefecture 
    FOREIGN KEY (prefecture_id) REFERENCES prefectures(id);
ALTER TABLE institutions ADD CONSTRAINT fk_institutions_commune 
    FOREIGN KEY (commune_id) REFERENCES communes(id);

CREATE INDEX idx_institutions_region ON institutions(region_id);
CREATE INDEX idx_institutions_prefecture ON institutions(prefecture_id);
CREATE INDEX idx_institutions_commune ON institutions(commune_id);
