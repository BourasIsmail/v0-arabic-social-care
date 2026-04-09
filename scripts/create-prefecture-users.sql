-- ============================================================
-- Script SQL : Create Prefecture Users
-- Email format: prefecture_name@entraide.ma
-- Password: Entraide2026 (BCrypt hash)
-- ============================================================

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- BCrypt hash for "Entraide2026"
-- Generated using BCrypt with strength 12
SET @password_hash = '$2a$12$C9p2GVpO1GyMXufxUFglX.kWPqSe0RuGoEx8KC8c9Ee/0YL1IDbgS';

-- ============================================================
-- CREATE PREFECTURE USERS (75 prefectures)
-- Role: USER, linked to their prefecture_id and region_id
-- ============================================================

INSERT INTO users (email, password, full_name, role, is_active, region_id, prefecture_id, created_at, updated_at) VALUES
-- Région 1 : طنجة - تطوان - الحسيمة
('alhoceima@entraide.ma', @password_hash, 'مندوبية الحسيمة', 'USER', true, 1, 1, NOW(), NOW()),
('tanger-assilah@entraide.ma', @password_hash, 'مندوبية طنجة - أصيلة', 'USER', true, 1, 2, NOW(), NOW()),
('tetouan@entraide.ma', @password_hash, 'مندوبية تطوان', 'USER', true, 1, 3, NOW(), NOW()),
('larache@entraide.ma', @password_hash, 'مندوبية العرائش', 'USER', true, 1, 4, NOW(), NOW()),
('chefchaouen@entraide.ma', @password_hash, 'مندوبية شفشاون', 'USER', true, 1, 5, NOW(), NOW()),
('fahs-anjra@entraide.ma', @password_hash, 'مندوبية فحص - أنجرة', 'USER', true, 1, 6, NOW(), NOW()),
('mdiq-fnideq@entraide.ma', @password_hash, 'مندوبية المضيق - الفنيدق', 'USER', true, 1, 7, NOW(), NOW()),
('ouazzane@entraide.ma', @password_hash, 'مندوبية وزان', 'USER', true, 1, 8, NOW(), NOW()),

-- Région 2 : الشرق
('oujda-angad@entraide.ma', @password_hash, 'مندوبية وجدة - أنكاد', 'USER', true, 2, 9, NOW(), NOW()),
('jerada@entraide.ma', @password_hash, 'مندوبية جرادة', 'USER', true, 2, 10, NOW(), NOW()),
('berkane@entraide.ma', @password_hash, 'مندوبية بركان', 'USER', true, 2, 11, NOW(), NOW()),
('taourirt@entraide.ma', @password_hash, 'مندوبية تاوريرت', 'USER', true, 2, 12, NOW(), NOW()),
('figuig@entraide.ma', @password_hash, 'مندوبية فجيج', 'USER', true, 2, 13, NOW(), NOW()),
('nador@entraide.ma', @password_hash, 'مندوبية الناظور', 'USER', true, 2, 14, NOW(), NOW()),
('driouch@entraide.ma', @password_hash, 'مندوبية درعة - إزكن', 'USER', true, 2, 15, NOW(), NOW()),
('guercif@entraide.ma', @password_hash, 'مندوبية كرسيف', 'USER', true, 2, 16, NOW(), NOW()),

-- Région 3 : فاس - مكناس
('fes@entraide.ma', @password_hash, 'مندوبية فاس', 'USER', true, 3, 17, NOW(), NOW()),
('meknes@entraide.ma', @password_hash, 'مندوبية مكناس', 'USER', true, 3, 18, NOW(), NOW()),
('sefrou@entraide.ma', @password_hash, 'مندوبية صفرو', 'USER', true, 3, 19, NOW(), NOW()),
('boulemane@entraide.ma', @password_hash, 'مندوبية بولمان', 'USER', true, 3, 20, NOW(), NOW()),
('ifrane@entraide.ma', @password_hash, 'مندوبية إفران', 'USER', true, 3, 21, NOW(), NOW()),
('elhajeb@entraide.ma', @password_hash, 'مندوبية الحاجب', 'USER', true, 3, 22, NOW(), NOW()),
('moulay-yacoub@entraide.ma', @password_hash, 'مندوبية مولاي يعقوب', 'USER', true, 3, 23, NOW(), NOW()),
('taounate@entraide.ma', @password_hash, 'مندوبية تاونات', 'USER', true, 3, 24, NOW(), NOW()),
('taza@entraide.ma', @password_hash, 'مندوبية تازة', 'USER', true, 3, 25, NOW(), NOW()),

-- Région 4 : الرباط - سلا - القنيطرة
('rabat@entraide.ma', @password_hash, 'مندوبية الرباط', 'USER', true, 4, 26, NOW(), NOW()),
('sale@entraide.ma', @password_hash, 'مندوبية سلا', 'USER', true, 4, 27, NOW(), NOW()),
('kenitra@entraide.ma', @password_hash, 'مندوبية القنيطرة', 'USER', true, 4, 28, NOW(), NOW()),
('skhirat-temara@entraide.ma', @password_hash, 'مندوبية الصخيرات - تمارة', 'USER', true, 4, 29, NOW(), NOW()),
('sidi-kacem@entraide.ma', @password_hash, 'مندوبية سيدي قاسم', 'USER', true, 4, 30, NOW(), NOW()),
('sidi-slimane@entraide.ma', @password_hash, 'مندوبية سيدي سليمان', 'USER', true, 4, 31, NOW(), NOW()),
('khemisset@entraide.ma', @password_hash, 'مندوبية خميسات', 'USER', true, 4, 32, NOW(), NOW()),

-- Région 5 : بني ملال - خنيفرة
('beni-mellal@entraide.ma', @password_hash, 'مندوبية بني ملال', 'USER', true, 5, 33, NOW(), NOW()),
('azilal@entraide.ma', @password_hash, 'مندوبية أزيلال', 'USER', true, 5, 34, NOW(), NOW()),
('fquih-ben-salah@entraide.ma', @password_hash, 'مندوبية الفقيه بن صالح', 'USER', true, 5, 35, NOW(), NOW()),
('khouribga@entraide.ma', @password_hash, 'مندوبية خريبكة', 'USER', true, 5, 36, NOW(), NOW()),
('khenifra@entraide.ma', @password_hash, 'مندوبية خنيفرة', 'USER', true, 5, 37, NOW(), NOW()),

-- Région 6 : الدار البيضاء - سطات
('casablanca@entraide.ma', @password_hash, 'مندوبية الدار البيضاء', 'USER', true, 6, 38, NOW(), NOW()),
('mohammedia@entraide.ma', @password_hash, 'مندوبية المحمدية', 'USER', true, 6, 39, NOW(), NOW()),
('nouaceur@entraide.ma', @password_hash, 'مندوبية النواصر', 'USER', true, 6, 40, NOW(), NOW()),
('mediouna@entraide.ma', @password_hash, 'مندوبية مديونة', 'USER', true, 6, 41, NOW(), NOW()),
('benslimane@entraide.ma', @password_hash, 'مندوبية بنسليمان', 'USER', true, 6, 42, NOW(), NOW()),
('berrechid@entraide.ma', @password_hash, 'مندوبية برشيد', 'USER', true, 6, 43, NOW(), NOW()),
('settat@entraide.ma', @password_hash, 'مندوبية سطات', 'USER', true, 6, 44, NOW(), NOW()),
('sidi-bennour@entraide.ma', @password_hash, 'مندوبية سيدي بنور', 'USER', true, 6, 45, NOW(), NOW()),
('el-jadida@entraide.ma', @password_hash, 'مندوبية الجديدة', 'USER', true, 6, 46, NOW(), NOW()),

-- Région 7 : مراكش - آسفي
('marrakech@entraide.ma', @password_hash, 'مندوبية مراكش', 'USER', true, 7, 47, NOW(), NOW()),
('alhaouz@entraide.ma', @password_hash, 'مندوبية الحوز', 'USER', true, 7, 48, NOW(), NOW()),
('kelaa-sraghna@entraide.ma', @password_hash, 'مندوبية قلعة السراغنة', 'USER', true, 7, 49, NOW(), NOW()),
('rehamna@entraide.ma', @password_hash, 'مندوبية الرحامنة', 'USER', true, 7, 50, NOW(), NOW()),
('chichaoua@entraide.ma', @password_hash, 'مندوبية شيشاوة', 'USER', true, 7, 51, NOW(), NOW()),
('safi@entraide.ma', @password_hash, 'مندوبية آسفي', 'USER', true, 7, 52, NOW(), NOW()),
('youssoufia@entraide.ma', @password_hash, 'مندوبية اليوسفية', 'USER', true, 7, 53, NOW(), NOW()),
('essaouira@entraide.ma', @password_hash, 'مندوبية الصويرة', 'USER', true, 7, 54, NOW(), NOW()),

-- Région 8 : درعة - تافيلالت
('ouarzazate@entraide.ma', @password_hash, 'مندوبية ورزازات', 'USER', true, 8, 55, NOW(), NOW()),
('tinghir@entraide.ma', @password_hash, 'مندوبية تينغير', 'USER', true, 8, 56, NOW(), NOW()),
('zagora@entraide.ma', @password_hash, 'مندوبية زاكورة', 'USER', true, 8, 57, NOW(), NOW()),
('errachidia@entraide.ma', @password_hash, 'مندوبية الرشيدية', 'USER', true, 8, 58, NOW(), NOW()),
('midelt@entraide.ma', @password_hash, 'مندوبية ميدلت', 'USER', true, 8, 59, NOW(), NOW()),

-- Région 9 : سوس - ماسة
('agadir@entraide.ma', @password_hash, 'مندوبية أكادير - إيداوتانان', 'USER', true, 9, 60, NOW(), NOW()),
('inezgane-aitmelloul@entraide.ma', @password_hash, 'مندوبية إنزكان - آيت ملول', 'USER', true, 9, 61, NOW(), NOW()),
('chtouka-aitbaha@entraide.ma', @password_hash, 'مندوبية شتوكة آيت باها', 'USER', true, 9, 62, NOW(), NOW()),
('taroudannt@entraide.ma', @password_hash, 'مندوبية تارودانت', 'USER', true, 9, 63, NOW(), NOW()),
('tiznit@entraide.ma', @password_hash, 'مندوبية تيزنيت', 'USER', true, 9, 64, NOW(), NOW()),
('tata@entraide.ma', @password_hash, 'مندوبية طاطا', 'USER', true, 9, 65, NOW(), NOW()),

-- Région 10 : كلميم - واد نون
('guelmim@entraide.ma', @password_hash, 'مندوبية كلميم', 'USER', true, 10, 66, NOW(), NOW()),
('assa-zag@entraide.ma', @password_hash, 'مندوبية أسا - الزاك', 'USER', true, 10, 67, NOW(), NOW()),
('tantan@entraide.ma', @password_hash, 'مندوبية طانطان', 'USER', true, 10, 68, NOW(), NOW()),
('sidi-ifni@entraide.ma', @password_hash, 'مندوبية سيدي إفني', 'USER', true, 10, 69, NOW(), NOW()),

-- Région 11 : العيون - الساقية الحمراء
('essmara@entraide.ma', @password_hash, 'مندوبية السمارة', 'USER', true, 11, 70, NOW(), NOW()),
('laayoune@entraide.ma', @password_hash, 'مندوبية العيون', 'USER', true, 11, 71, NOW(), NOW()),
('boujdour@entraide.ma', @password_hash, 'مندوبية بوجدور', 'USER', true, 11, 72, NOW(), NOW()),
('tarfaya@entraide.ma', @password_hash, 'مندوبية طرفاية', 'USER', true, 11, 73, NOW(), NOW()),

-- Région 12 : الداخلة - وادي الذهب
('oued-eddahab@entraide.ma', @password_hash, 'مندوبية وادي الذهب', 'USER', true, 12, 74, NOW(), NOW()),
('aousserd@entraide.ma', @password_hash, 'مندوبية أوسرد', 'USER', true, 12, 75, NOW(), NOW());

-- ============================================================
-- SUMMARY
-- ============================================================
-- Created 75 prefecture admin accounts
-- Email format: prefecture_name@entraide.ma
-- Password: Entraide2026
-- Role: USER
-- Each account is linked to its prefecture_id and region_id
