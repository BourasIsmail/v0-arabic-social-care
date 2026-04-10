-- ============================================================
-- Script SQL : Create Users for each Prefecture
-- Creates 82 user accounts, one for each prefecture
-- ============================================================

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- BCrypt hash for "Entraide2026"
-- Generated using BCrypt with strength 12
SET @password_hash = '$2a$12$C9p2GVpO1GyMXufxUFglX.kWPqSe0RuGoEx8KC8c9Ee/0YL1IDbgS';

-- ============================================================
-- Create users for each prefecture
-- Email format: prefecture_name@entraide.ma (normalized)
-- Role: USER, linked to their prefecture_id and region_id
-- ============================================================

-- Region 1: طنجة - تطوان - الحسيمة (8 prefectures)
INSERT INTO users (email, password, full_name, role, region_id, prefecture_id, created_at, updated_at) VALUES
('hoceima@entraide.ma', @password_hash, 'مندوبية الحسيمة', 'USER', 1, 1, NOW(), NOW()),
('tanger@entraide.ma', @password_hash, 'مندوبية طنجة - أصيلة', 'USER', 1, 2, NOW(), NOW()),
('tetouan@entraide.ma', @password_hash, 'مندوبية تطوان', 'USER', 1, 3, NOW(), NOW()),
('larache@entraide.ma', @password_hash, 'مندوبية العرائش', 'USER', 1, 4, NOW(), NOW()),
('chefchaouen@entraide.ma', @password_hash, 'مندوبية شفشاون', 'USER', 1, 5, NOW(), NOW()),
('fahs-anjra@entraide.ma', @password_hash, 'مندوبية فحص - أنجرة', 'USER', 1, 6, NOW(), NOW()),
('mdiq-fnideq@entraide.ma', @password_hash, 'مندوبية المضيق - الفنيدق', 'USER', 1, 7, NOW(), NOW()),
('ouazzane@entraide.ma', @password_hash, 'مندوبية وزان', 'USER', 1, 8, NOW(), NOW());

-- Region 2: الشرق (8 prefectures)
INSERT INTO users (email, password, full_name, role, region_id, prefecture_id, created_at, updated_at) VALUES
('oujda@entraide.ma', @password_hash, 'مندوبية وجدة - أنكاد', 'USER', 2, 9, NOW(), NOW()),
('jerada@entraide.ma', @password_hash, 'مندوبية جرادة', 'USER', 2, 10, NOW(), NOW()),
('berkane@entraide.ma', @password_hash, 'مندوبية بركان', 'USER', 2, 11, NOW(), NOW()),
('taourirt@entraide.ma', @password_hash, 'مندوبية تاوريرت', 'USER', 2, 12, NOW(), NOW()),
('figuig@entraide.ma', @password_hash, 'مندوبية فجيج', 'USER', 2, 13, NOW(), NOW()),
('nador@entraide.ma', @password_hash, 'مندوبية الناظور', 'USER', 2, 14, NOW(), NOW()),
('guercif@entraide.ma', @password_hash, 'مندوبية كرسيف', 'USER', 2, 15, NOW(), NOW()),
('driouch@entraide.ma', @password_hash, 'مندوبية دريوش', 'USER', 2, 16, NOW(), NOW());

-- Region 3: فاس - مكناس (9 prefectures)
INSERT INTO users (email, password, full_name, role, region_id, prefecture_id, created_at, updated_at) VALUES
('taza@entraide.ma', @password_hash, 'مندوبية تازة', 'USER', 3, 17, NOW(), NOW()),
('taounate@entraide.ma', @password_hash, 'مندوبية تاونات', 'USER', 3, 18, NOW(), NOW()),
('sefrou@entraide.ma', @password_hash, 'مندوبية صفرو', 'USER', 3, 19, NOW(), NOW()),
('boulemane@entraide.ma', @password_hash, 'مندوبية بولمان', 'USER', 3, 20, NOW(), NOW()),
('hajeb@entraide.ma', @password_hash, 'مندوبية الحاجب', 'USER', 3, 21, NOW(), NOW()),
('ifrane@entraide.ma', @password_hash, 'مندوبية إفران', 'USER', 3, 22, NOW(), NOW()),
('fes@entraide.ma', @password_hash, 'مندوبية فاس', 'USER', 3, 23, NOW(), NOW()),
('moulay-yacoub@entraide.ma', @password_hash, 'مندوبية مولاي يعقوب', 'USER', 3, 24, NOW(), NOW()),
('meknes@entraide.ma', @password_hash, 'مندوبية مكناس', 'USER', 3, 25, NOW(), NOW());

-- Region 4: الرباط - سلا - القنيطرة (7 prefectures)
INSERT INTO users (email, password, full_name, role, region_id, prefecture_id, created_at, updated_at) VALUES
('rabat@entraide.ma', @password_hash, 'مندوبية الرباط', 'USER', 4, 26, NOW(), NOW()),
('skhirat-temara@entraide.ma', @password_hash, 'مندوبية الصخيرات - تمارة', 'USER', 4, 27, NOW(), NOW()),
('khemisset@entraide.ma', @password_hash, 'مندوبية خميسات', 'USER', 4, 28, NOW(), NOW()),
('kenitra@entraide.ma', @password_hash, 'مندوبية القنيطرة', 'USER', 4, 29, NOW(), NOW()),
('sidi-kacem@entraide.ma', @password_hash, 'مندوبية سيدي قاسم', 'USER', 4, 30, NOW(), NOW()),
('sale@entraide.ma', @password_hash, 'مندوبية سلا', 'USER', 4, 31, NOW(), NOW()),
('sidi-slimane@entraide.ma', @password_hash, 'مندوبية سيدي سليمان', 'USER', 4, 32, NOW(), NOW());

-- Region 5: بني ملال - خنيفرة (5 prefectures)
INSERT INTO users (email, password, full_name, role, region_id, prefecture_id, created_at, updated_at) VALUES
('beni-mellal@entraide.ma', @password_hash, 'مندوبية بني ملال', 'USER', 5, 33, NOW(), NOW()),
('azilal@entraide.ma', @password_hash, 'مندوبية أزيلال', 'USER', 5, 34, NOW(), NOW()),
('khenifra@entraide.ma', @password_hash, 'مندوبية خنيفرة', 'USER', 5, 35, NOW(), NOW()),
('khouribga@entraide.ma', @password_hash, 'مندوبية خريبكة', 'USER', 5, 36, NOW(), NOW()),
('fquih-ben-salah@entraide.ma', @password_hash, 'مندوبية الفقيه بن صالح', 'USER', 5, 37, NOW(), NOW());

-- Region 6: الدار البيضاء - سطات (16 prefectures)
INSERT INTO users (email, password, full_name, role, region_id, prefecture_id, created_at, updated_at) VALUES
('mohammedia@entraide.ma', @password_hash, 'مندوبية المحمدية', 'USER', 6, 38, NOW(), NOW()),
('el-jadida@entraide.ma', @password_hash, 'مندوبية الجديدة', 'USER', 6, 39, NOW(), NOW()),
('settat@entraide.ma', @password_hash, 'مندوبية سطات', 'USER', 6, 40, NOW(), NOW()),
('benslimane@entraide.ma', @password_hash, 'مندوبية بنسليمان', 'USER', 6, 41, NOW(), NOW()),
('casablanca-anfa@entraide.ma', @password_hash, 'مندوبية الدار البيضاء - أنفا', 'USER', 6, 42, NOW(), NOW()),
('hay-hassani@entraide.ma', @password_hash, 'مندوبية الحي الحسني', 'USER', 6, 43, NOW(), NOW()),
('ain-chock@entraide.ma', @password_hash, 'مندوبية عين الشق', 'USER', 6, 44, NOW(), NOW()),
('sidi-bernoussi@entraide.ma', @password_hash, 'مندوبية سيدي برنوصي', 'USER', 6, 45, NOW(), NOW()),
('ben-msik@entraide.ma', @password_hash, 'مندوبية بن مسيك', 'USER', 6, 46, NOW(), NOW()),
('moulay-rachid@entraide.ma', @password_hash, 'مندوبية مولاي رشيد', 'USER', 6, 47, NOW(), NOW()),
('nouaceur@entraide.ma', @password_hash, 'مندوبية النواصر', 'USER', 6, 48, NOW(), NOW()),
('mediouna@entraide.ma', @password_hash, 'مندوبية مديونة', 'USER', 6, 49, NOW(), NOW()),
('fida-mers-sultan@entraide.ma', @password_hash, 'مندوبية الفداء - مرس السلطان', 'USER', 6, 50, NOW(), NOW()),
('ain-sebaa@entraide.ma', @password_hash, 'مندوبية عين السبع - الحي المحمدي', 'USER', 6, 51, NOW(), NOW()),
('sidi-bennour@entraide.ma', @password_hash, 'مندوبية سيدي بنور', 'USER', 6, 52, NOW(), NOW()),
('berrechid@entraide.ma', @password_hash, 'مندوبية برشيد', 'USER', 6, 53, NOW(), NOW());

-- Region 7: مراكش - آسفي (8 prefectures)
INSERT INTO users (email, password, full_name, role, region_id, prefecture_id, created_at, updated_at) VALUES
('chichaoua@entraide.ma', @password_hash, 'مندوبية شيشاوة', 'USER', 7, 54, NOW(), NOW()),
('al-haouz@entraide.ma', @password_hash, 'مندوبية الحوز', 'USER', 7, 55, NOW(), NOW()),
('kelaa-sraghna@entraide.ma', @password_hash, 'مندوبية قلعة السراغنة', 'USER', 7, 56, NOW(), NOW()),
('essaouira@entraide.ma', @password_hash, 'مندوبية الصويرة', 'USER', 7, 57, NOW(), NOW()),
('safi@entraide.ma', @password_hash, 'مندوبية آسفي', 'USER', 7, 58, NOW(), NOW()),
('marrakech@entraide.ma', @password_hash, 'مندوبية مراكش', 'USER', 7, 59, NOW(), NOW()),
('rehamna@entraide.ma', @password_hash, 'مندوبية الرحامنة', 'USER', 7, 60, NOW(), NOW()),
('youssoufia@entraide.ma', @password_hash, 'مندوبية اليوسفية', 'USER', 7, 61, NOW(), NOW());

-- Region 8: درعة - تافيلالت (5 prefectures)
INSERT INTO users (email, password, full_name, role, region_id, prefecture_id, created_at, updated_at) VALUES
('ouarzazate@entraide.ma', @password_hash, 'مندوبية ورزازات', 'USER', 8, 62, NOW(), NOW()),
('zagora@entraide.ma', @password_hash, 'مندوبية زاكورة', 'USER', 8, 63, NOW(), NOW()),
('errachidia@entraide.ma', @password_hash, 'مندوبية الرشيدية', 'USER', 8, 64, NOW(), NOW()),
('tinghir@entraide.ma', @password_hash, 'مندوبية تنغير', 'USER', 8, 65, NOW(), NOW()),
('midelt@entraide.ma', @password_hash, 'مندوبية ميدلت', 'USER', 8, 66, NOW(), NOW());

-- Region 9: سوس - ماسة (6 prefectures)
INSERT INTO users (email, password, full_name, role, region_id, prefecture_id, created_at, updated_at) VALUES
('agadir@entraide.ma', @password_hash, 'مندوبية أكادير إيدا أوتانان', 'USER', 9, 67, NOW(), NOW()),
('inezgane@entraide.ma', @password_hash, 'مندوبية إنزكان - آيت ملول', 'USER', 9, 68, NOW(), NOW()),
('chtouka@entraide.ma', @password_hash, 'مندوبية شتوكة - آيت باها', 'USER', 9, 69, NOW(), NOW()),
('taroudant@entraide.ma', @password_hash, 'مندوبية تارودانت', 'USER', 9, 70, NOW(), NOW()),
('tiznit@entraide.ma', @password_hash, 'مندوبية تيزنيت', 'USER', 9, 71, NOW(), NOW()),
('tata@entraide.ma', @password_hash, 'مندوبية طاطا', 'USER', 9, 72, NOW(), NOW());

-- Region 10: كلميم - واد نون (4 prefectures)
INSERT INTO users (email, password, full_name, role, region_id, prefecture_id, created_at, updated_at) VALUES
('guelmim@entraide.ma', @password_hash, 'مندوبية كلميم', 'USER', 10, 73, NOW(), NOW()),
('assa-zag@entraide.ma', @password_hash, 'مندوبية أسا - الزاك', 'USER', 10, 74, NOW(), NOW()),
('tantan@entraide.ma', @password_hash, 'مندوبية طانطان', 'USER', 10, 75, NOW(), NOW()),
('sidi-ifni@entraide.ma', @password_hash, 'مندوبية سيدي إفني', 'USER', 10, 76, NOW(), NOW());

-- Region 11: العيون - الساقية الحمراء (4 prefectures)
INSERT INTO users (email, password, full_name, role, region_id, prefecture_id, created_at, updated_at) VALUES
('smara@entraide.ma', @password_hash, 'مندوبية السمارة', 'USER', 11, 77, NOW(), NOW()),
('laayoune@entraide.ma', @password_hash, 'مندوبية العيون', 'USER', 11, 78, NOW(), NOW()),
('boujdour@entraide.ma', @password_hash, 'مندوبية بوجدور', 'USER', 11, 79, NOW(), NOW()),
('tarfaya@entraide.ma', @password_hash, 'مندوبية طرفاية', 'USER', 11, 80, NOW(), NOW());

-- Region 12: الداخلة - وادي الذهب (2 prefectures)
INSERT INTO users (email, password, full_name, role, region_id, prefecture_id, created_at, updated_at) VALUES
('oued-eddahab@entraide.ma', @password_hash, 'مندوبية وادي الذهب', 'USER', 12, 81, NOW(), NOW()),
('aousserd@entraide.ma', @password_hash, 'مندوبية أوسرد', 'USER', 12, 82, NOW(), NOW());

-- ============================================================
-- Summary: 82 users created
-- Password for all accounts: Entraide2026
-- Role: USER
-- ============================================================
