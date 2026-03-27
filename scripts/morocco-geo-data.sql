-- Morocco Administrative Data: Regions, Prefectures/Provinces, and Communes
-- Based on the 12 regions of Morocco (2015 territorial division)

-- Clear existing data (optional - uncomment if needed)
-- DELETE FROM communes;
-- DELETE FROM prefectures;
-- DELETE FROM regions;

-- =============================================
-- REGIONS (12 regions of Morocco)
-- =============================================
INSERT INTO regions (name) VALUES 
('طنجة-تطوان-الحسيمة'),
('الشرق'),
('فاس-مكناس'),
('الرباط-سلا-القنيطرة'),
('بني ملال-خنيفرة'),
('الدار البيضاء-سطات'),
('مراكش-آسفي'),
('درعة-تافيلالت'),
('سوس-ماسة'),
('كلميم-واد نون'),
('العيون-الساقية الحمراء'),
('الداخلة-وادي الذهب');

-- =============================================
-- PREFECTURES/PROVINCES BY REGION
-- =============================================

-- Region 1: طنجة-تطوان-الحسيمة
INSERT INTO prefectures (name, region_id) VALUES 
('طنجة-أصيلة', (SELECT id FROM regions WHERE name = 'طنجة-تطوان-الحسيمة')),
('المضيق-الفنيدق', (SELECT id FROM regions WHERE name = 'طنجة-تطوان-الحسيمة')),
('تطوان', (SELECT id FROM regions WHERE name = 'طنجة-تطوان-الحسيمة')),
('الفحص-أنجرة', (SELECT id FROM regions WHERE name = 'طنجة-تطوان-الحسيمة')),
('العرائش', (SELECT id FROM regions WHERE name = 'طنجة-تطوان-الحسيمة')),
('الحسيمة', (SELECT id FROM regions WHERE name = 'طنجة-تطوان-الحسيمة')),
('شفشاون', (SELECT id FROM regions WHERE name = 'طنجة-تطوان-الحسيمة')),
('وزان', (SELECT id FROM regions WHERE name = 'طنجة-تطوان-الحسيمة'));

-- Region 2: الشرق
INSERT INTO prefectures (name, region_id) VALUES 
('وجدة-أنكاد', (SELECT id FROM regions WHERE name = 'الشرق')),
('الناظور', (SELECT id FROM regions WHERE name = 'الشرق')),
('الدريوش', (SELECT id FROM regions WHERE name = 'الشرق')),
('جرادة', (SELECT id FROM regions WHERE name = 'الشرق')),
('بركان', (SELECT id FROM regions WHERE name = 'الشرق')),
('تاوريرت', (SELECT id FROM regions WHERE name = 'الشرق')),
('كرسيف', (SELECT id FROM regions WHERE name = 'الشرق')),
('فجيج', (SELECT id FROM regions WHERE name = 'الشرق'));

-- Region 3: فاس-مكناس
INSERT INTO prefectures (name, region_id) VALUES 
('فاس', (SELECT id FROM regions WHERE name = 'فاس-مكناس')),
('مكناس', (SELECT id FROM regions WHERE name = 'فاس-مكناس')),
('الحاجب', (SELECT id FROM regions WHERE name = 'فاس-مكناس')),
('إفران', (SELECT id FROM regions WHERE name = 'فاس-مكناس')),
('مولاي يعقوب', (SELECT id FROM regions WHERE name = 'فاس-مكناس')),
('صفرو', (SELECT id FROM regions WHERE name = 'فاس-مكناس')),
('بولمان', (SELECT id FROM regions WHERE name = 'فاس-مكناس')),
('تاونات', (SELECT id FROM regions WHERE name = 'فاس-مكناس')),
('تازة', (SELECT id FROM regions WHERE name = 'فاس-مكناس'));

-- Region 4: الرباط-سلا-القنيطرة
INSERT INTO prefectures (name, region_id) VALUES 
('الرباط', (SELECT id FROM regions WHERE name = 'الرباط-سلا-القنيطرة')),
('سلا', (SELECT id FROM regions WHERE name = 'الرباط-سلا-القنيطرة')),
('الصخيرات-تمارة', (SELECT id FROM regions WHERE name = 'الرباط-سلا-القنيطرة')),
('القنيطرة', (SELECT id FROM regions WHERE name = 'الرباط-سلا-القنيطرة')),
('الخميسات', (SELECT id FROM regions WHERE name = 'الرباط-سلا-القنيطرة')),
('سيدي قاسم', (SELECT id FROM regions WHERE name = 'الرباط-سلا-القنيطرة')),
('سيدي سليمان', (SELECT id FROM regions WHERE name = 'الرباط-سلا-القنيطرة'));

-- Region 5: بني ملال-خنيفرة
INSERT INTO prefectures (name, region_id) VALUES 
('بني ملال', (SELECT id FROM regions WHERE name = 'بني ملال-خنيفرة')),
('أزيلال', (SELECT id FROM regions WHERE name = 'بني ملال-خنيفرة')),
('الفقيه بن صالح', (SELECT id FROM regions WHERE name = 'بني ملال-خنيفرة')),
('خنيفرة', (SELECT id FROM regions WHERE name = 'بني ملال-خنيفرة')),
('خريبكة', (SELECT id FROM regions WHERE name = 'بني ملال-خنيفرة'));

-- Region 6: الدار البيضاء-سطات
INSERT INTO prefectures (name, region_id) VALUES 
('الدار البيضاء', (SELECT id FROM regions WHERE name = 'الدار البيضاء-سطات')),
('المحمدية', (SELECT id FROM regions WHERE name = 'الدار البيضاء-سطات')),
('عين السبع-الحي المحمدي', (SELECT id FROM regions WHERE name = 'الدار البيضاء-سطات')),
('عين الشق', (SELECT id FROM regions WHERE name = 'الدار البيضاء-سطات')),
('أنفا', (SELECT id FROM regions WHERE name = 'الدار البيضاء-سطات')),
('بن مسيك', (SELECT id FROM regions WHERE name = 'الدار البيضاء-سطات')),
('سيدي البرنوصي', (SELECT id FROM regions WHERE name = 'الدار البيضاء-سطات')),
('الحي الحسني', (SELECT id FROM regions WHERE name = 'الدار البيضاء-سطات')),
('مولاي رشيد', (SELECT id FROM regions WHERE name = 'الدار البيضاء-سطات')),
('النواصر', (SELECT id FROM regions WHERE name = 'الدار البيضاء-سطات')),
('مديونة', (SELECT id FROM regions WHERE name = 'الدار البيضاء-سطات')),
('الجديدة', (SELECT id FROM regions WHERE name = 'الدار البيضاء-سطات')),
('سيدي بنور', (SELECT id FROM regions WHERE name = 'الدار البيضاء-سطات')),
('سطات', (SELECT id FROM regions WHERE name = 'الدار البيضاء-سطات')),
('برشيد', (SELECT id FROM regions WHERE name = 'الدار البيضاء-سطات')),
('بن سليمان', (SELECT id FROM regions WHERE name = 'الدار البيضاء-سطات'));

-- Region 7: مراكش-آسفي
INSERT INTO prefectures (name, region_id) VALUES 
('مراكش', (SELECT id FROM regions WHERE name = 'مراكش-آسفي')),
('شيشاوة', (SELECT id FROM regions WHERE name = 'مراكش-آسفي')),
('الحوز', (SELECT id FROM regions WHERE name = 'مراكش-آسفي')),
('قلعة السراغنة', (SELECT id FROM regions WHERE name = 'مراكش-آسفي')),
('الصويرة', (SELECT id FROM regions WHERE name = 'مراكش-آسفي')),
('الرحامنة', (SELECT id FROM regions WHERE name = 'مراكش-آسفي')),
('آسفي', (SELECT id FROM regions WHERE name = 'مراكش-آسفي')),
('اليوسفية', (SELECT id FROM regions WHERE name = 'مراكش-آسفي'));

-- Region 8: درعة-تافيلالت
INSERT INTO prefectures (name, region_id) VALUES 
('الرشيدية', (SELECT id FROM regions WHERE name = 'درعة-تافيلالت')),
('ميدلت', (SELECT id FROM regions WHERE name = 'درعة-تافيلالت')),
('تنغير', (SELECT id FROM regions WHERE name = 'درعة-تافيلالت')),
('ورزازات', (SELECT id FROM regions WHERE name = 'درعة-تافيلالت')),
('زاكورة', (SELECT id FROM regions WHERE name = 'درعة-تافيلالت'));

-- Region 9: سوس-ماسة
INSERT INTO prefectures (name, region_id) VALUES 
('أكادير-إداوتنان', (SELECT id FROM regions WHERE name = 'سوس-ماسة')),
('إنزكان-أيت ملول', (SELECT id FROM regions WHERE name = 'سوس-ماسة')),
('شتوكة-أيت باها', (SELECT id FROM regions WHERE name = 'سوس-ماسة')),
('تارودانت', (SELECT id FROM regions WHERE name = 'سوس-ماسة')),
('تيزنيت', (SELECT id FROM regions WHERE name = 'سوس-ماسة')),
('طاطا', (SELECT id FROM regions WHERE name = 'سوس-ماسة'));

-- Region 10: كلميم-واد نون
INSERT INTO prefectures (name, region_id) VALUES 
('كلميم', (SELECT id FROM regions WHERE name = 'كلميم-واد نون')),
('أسا-الزاك', (SELECT id FROM regions WHERE name = 'كلميم-واد نون')),
('طانطان', (SELECT id FROM regions WHERE name = 'كلميم-واد نون')),
('سيدي إفني', (SELECT id FROM regions WHERE name = 'كلميم-واد نون'));

-- Region 11: العيون-الساقية الحمراء
INSERT INTO prefectures (name, region_id) VALUES 
('العيون', (SELECT id FROM regions WHERE name = 'العيون-الساقية الحمراء')),
('بوجدور', (SELECT id FROM regions WHERE name = 'العيون-الساقية الحمراء')),
('طرفاية', (SELECT id FROM regions WHERE name = 'العيون-الساقية الحمراء')),
('السمارة', (SELECT id FROM regions WHERE name = 'العيون-الساقية الحمراء'));

-- Region 12: الداخلة-وادي الذهب
INSERT INTO prefectures (name, region_id) VALUES 
('وادي الذهب', (SELECT id FROM regions WHERE name = 'الداخلة-وادي الذهب')),
('أوسرد', (SELECT id FROM regions WHERE name = 'الداخلة-وادي الذهب'));

-- =============================================
-- COMMUNES (Sample communes for each prefecture)
-- =============================================

-- طنجة-أصيلة communes
INSERT INTO communes (name, prefecture_id) VALUES 
('طنجة', (SELECT id FROM prefectures WHERE name = 'طنجة-أصيلة')),
('أصيلة', (SELECT id FROM prefectures WHERE name = 'طنجة-أصيلة')),
('الغندري', (SELECT id FROM prefectures WHERE name = 'طنجة-أصيلة')),
('حجر النحل', (SELECT id FROM prefectures WHERE name = 'طنجة-أصيلة')),
('أقواس بريش', (SELECT id FROM prefectures WHERE name = 'طنجة-أصيلة'));

-- المضيق-الفنيدق communes
INSERT INTO communes (name, prefecture_id) VALUES 
('المضيق', (SELECT id FROM prefectures WHERE name = 'المضيق-الفنيدق')),
('الفنيدق', (SELECT id FROM prefectures WHERE name = 'المضيق-الفنيدق')),
('مرتيل', (SELECT id FROM prefectures WHERE name = 'المضيق-الفنيدق'));

-- تطوان communes
INSERT INTO communes (name, prefecture_id) VALUES 
('تطوان', (SELECT id FROM prefectures WHERE name = 'تطوان')),
('الزاوية', (SELECT id FROM prefectures WHERE name = 'تطوان')),
('بني سعيد', (SELECT id FROM prefectures WHERE name = 'تطوان')),
('الحمراء', (SELECT id FROM prefectures WHERE name = 'تطوان'));

-- العرائش communes
INSERT INTO communes (name, prefecture_id) VALUES 
('العرائش', (SELECT id FROM prefectures WHERE name = 'العرائش')),
('القصر الكبير', (SELECT id FROM prefectures WHERE name = 'العرائش')),
('اللوكوس', (SELECT id FROM prefectures WHERE name = 'العرائش'));

-- الحسيمة communes
INSERT INTO communes (name, prefecture_id) VALUES 
('الحسيمة', (SELECT id FROM prefectures WHERE name = 'الحسيمة')),
('إمزورن', (SELECT id FROM prefectures WHERE name = 'الحسيمة')),
('بني بوعياش', (SELECT id FROM prefectures WHERE name = 'الحسيمة')),
('تارجيست', (SELECT id FROM prefectures WHERE name = 'الحسيمة'));

-- شفشاون communes
INSERT INTO communes (name, prefecture_id) VALUES 
('شفشاون', (SELECT id FROM prefectures WHERE name = 'شفشاون')),
('باب تازة', (SELECT id FROM prefectures WHERE name = 'شفشاون')),
('بني أحمد', (SELECT id FROM prefectures WHERE name = 'شفشاون'));

-- وجدة-أنكاد communes
INSERT INTO communes (name, prefecture_id) VALUES 
('وجدة', (SELECT id FROM prefectures WHERE name = 'وجدة-أنكاد')),
('أنكاد', (SELECT id FROM prefectures WHERE name = 'وجدة-أنكاد')),
('سيدي يحيى', (SELECT id FROM prefectures WHERE name = 'وجدة-أنكاد'));

-- الناظور communes
INSERT INTO communes (name, prefecture_id) VALUES 
('الناظور', (SELECT id FROM prefectures WHERE name = 'الناظور')),
('بني أنصار', (SELECT id FROM prefectures WHERE name = 'الناظور')),
('سلوان', (SELECT id FROM prefectures WHERE name = 'الناظور')),
('زايو', (SELECT id FROM prefectures WHERE name = 'الناظور'));

-- فاس communes
INSERT INTO communes (name, prefecture_id) VALUES 
('فاس', (SELECT id FROM prefectures WHERE name = 'فاس')),
('المدينة القديمة', (SELECT id FROM prefectures WHERE name = 'فاس')),
('جنان الورد', (SELECT id FROM prefectures WHERE name = 'فاس')),
('زواغة', (SELECT id FROM prefectures WHERE name = 'فاس'));

-- مكناس communes
INSERT INTO communes (name, prefecture_id) VALUES 
('مكناس', (SELECT id FROM prefectures WHERE name = 'مكناس')),
('ولماس', (SELECT id FROM prefectures WHERE name = 'مكناس')),
('بوفكران', (SELECT id FROM prefectures WHERE name = 'مكناس'));

-- الرباط communes
INSERT INTO communes (name, prefecture_id) VALUES 
('الرباط', (SELECT id FROM prefectures WHERE name = 'الرباط')),
('حسان', (SELECT id FROM prefectures WHERE name = 'الرباط')),
('أكدال-الرياض', (SELECT id FROM prefectures WHERE name = 'الرباط')),
('السويسي', (SELECT id FROM prefectures WHERE name = 'الرباط'));

-- سلا communes
INSERT INTO communes (name, prefecture_id) VALUES 
('سلا', (SELECT id FROM prefectures WHERE name = 'سلا')),
('الطبريكت', (SELECT id FROM prefectures WHERE name = 'سلا')),
('بطانة', (SELECT id FROM prefectures WHERE name = 'سلا')),
('العيايدة', (SELECT id FROM prefectures WHERE name = 'سلا'));

-- القنيطرة communes
INSERT INTO communes (name, prefecture_id) VALUES 
('القنيطرة', (SELECT id FROM prefectures WHERE name = 'القنيطرة')),
('المهدية', (SELECT id FROM prefectures WHERE name = 'القنيطرة')),
('سيدي الطيبي', (SELECT id FROM prefectures WHERE name = 'القنيطرة'));

-- الدار البيضاء communes
INSERT INTO communes (name, prefecture_id) VALUES 
('الدار البيضاء', (SELECT id FROM prefectures WHERE name = 'الدار البيضاء')),
('المعاريف', (SELECT id FROM prefectures WHERE name = 'الدار البيضاء'));

-- المحمدية communes
INSERT INTO communes (name, prefecture_id) VALUES 
('المحمدية', (SELECT id FROM prefectures WHERE name = 'المحمدية')),
('عين حرودة', (SELECT id FROM prefectures WHERE name = 'المحمدية')),
('بني يخلف', (SELECT id FROM prefectures WHERE name = 'المحمدية'));

-- الجديدة communes
INSERT INTO communes (name, prefecture_id) VALUES 
('الجديدة', (SELECT id FROM prefectures WHERE name = 'الجديدة')),
('أزمور', (SELECT id FROM prefectures WHERE name = 'الجديدة')),
('الحوزية', (SELECT id FROM prefectures WHERE name = 'الجديدة'));

-- سطات communes
INSERT INTO communes (name, prefecture_id) VALUES 
('سطات', (SELECT id FROM prefectures WHERE name = 'سطات')),
('البروج', (SELECT id FROM prefectures WHERE name = 'سطات')),
('لمذاكرة', (SELECT id FROM prefectures WHERE name = 'سطات'));

-- بني ملال communes
INSERT INTO communes (name, prefecture_id) VALUES 
('بني ملال', (SELECT id FROM prefectures WHERE name = 'بني ملال')),
('قصبة تادلة', (SELECT id FROM prefectures WHERE name = 'بني ملال')),
('أولاد امبارك', (SELECT id FROM prefectures WHERE name = 'بني ملال'));

-- خنيفرة communes
INSERT INTO communes (name, prefecture_id) VALUES 
('خنيفرة', (SELECT id FROM prefectures WHERE name = 'خنيفرة')),
('مريرت', (SELECT id FROM prefectures WHERE name = 'خنيفرة')),
('أكلموس', (SELECT id FROM prefectures WHERE name = 'خنيفرة'));

-- مراكش communes
INSERT INTO communes (name, prefecture_id) VALUES 
('مراكش', (SELECT id FROM prefectures WHERE name = 'مراكش')),
('المنارة-جليز', (SELECT id FROM prefectures WHERE name = 'مراكش')),
('سيدي يوسف بن علي', (SELECT id FROM prefectures WHERE name = 'مراكش')),
('النخيل', (SELECT id FROM prefectures WHERE name = 'مراكش'));

-- الحوز communes
INSERT INTO communes (name, prefecture_id) VALUES 
('تحناوت', (SELECT id FROM prefectures WHERE name = 'الحوز')),
('أمزميز', (SELECT id FROM prefectures WHERE name = 'الحوز')),
('آيت أورير', (SELECT id FROM prefectures WHERE name = 'الحوز'));

-- آسفي communes
INSERT INTO communes (name, prefecture_id) VALUES 
('آسفي', (SELECT id FROM prefectures WHERE name = 'آسفي')),
('جمعة شعيم', (SELECT id FROM prefectures WHERE name = 'آسفي')),
('الشماعية', (SELECT id FROM prefectures WHERE name = 'آسفي'));

-- الصويرة communes
INSERT INTO communes (name, prefecture_id) VALUES 
('الصويرة', (SELECT id FROM prefectures WHERE name = 'الصويرة')),
('تمنار', (SELECT id FROM prefectures WHERE name = 'الصويرة')),
('سيدي كاوكي', (SELECT id FROM prefectures WHERE name = 'الصويرة'));

-- أكادير communes
INSERT INTO communes (name, prefecture_id) VALUES 
('أكادير', (SELECT id FROM prefectures WHERE name = 'أكادير-إداوتنان')),
('الدشيرة الجهادية', (SELECT id FROM prefectures WHERE name = 'أكادير-إداوتنان')),
('تيكيوين', (SELECT id FROM prefectures WHERE name = 'أكادير-إداوتنان'));

-- تارودانت communes
INSERT INTO communes (name, prefecture_id) VALUES 
('تارودانت', (SELECT id FROM prefectures WHERE name = 'تارودانت')),
('أولاد تايمة', (SELECT id FROM prefectures WHERE name = 'تارودانت')),
('أولاد برحيل', (SELECT id FROM prefectures WHERE name = 'تارودانت'));

-- تيزنيت communes
INSERT INTO communes (name, prefecture_id) VALUES 
('تيزنيت', (SELECT id FROM prefectures WHERE name = 'تيزنيت')),
('أكلو', (SELECT id FROM prefectures WHERE name = 'تيزنيت')),
('الركادة', (SELECT id FROM prefectures WHERE name = 'تيزنيت'));

-- الرشيدية communes
INSERT INTO communes (name, prefecture_id) VALUES 
('الرشيدية', (SELECT id FROM prefectures WHERE name = 'الرشيدية')),
('أرفود', (SELECT id FROM prefectures WHERE name = 'الرشيدية')),
('كلميمة', (SELECT id FROM prefectures WHERE name = 'الرشيدية'));

-- ورزازات communes
INSERT INTO communes (name, prefecture_id) VALUES 
('ورزازات', (SELECT id FROM prefectures WHERE name = 'ورزازات')),
('تنغير', (SELECT id FROM prefectures WHERE name = 'ورزازات')),
('سكورة', (SELECT id FROM prefectures WHERE name = 'ورزازات'));

-- كلميم communes
INSERT INTO communes (name, prefecture_id) VALUES 
('كلميم', (SELECT id FROM prefectures WHERE name = 'كلميم')),
('بويزكارن', (SELECT id FROM prefectures WHERE name = 'كلميم')),
('أسرير', (SELECT id FROM prefectures WHERE name = 'كلميم'));

-- العيون communes
INSERT INTO communes (name, prefecture_id) VALUES 
('العيون', (SELECT id FROM prefectures WHERE name = 'العيون')),
('الفم الواد', (SELECT id FROM prefectures WHERE name = 'العيون'));

-- وادي الذهب (الداخلة) communes
INSERT INTO communes (name, prefecture_id) VALUES 
('الداخلة', (SELECT id FROM prefectures WHERE name = 'وادي الذهب')),
('بئر كندوز', (SELECT id FROM prefectures WHERE name = 'وادي الذهب'));

-- Additional communes for remaining prefectures

-- الفحص-أنجرة communes
INSERT INTO communes (name, prefecture_id) VALUES 
('الفحص', (SELECT id FROM prefectures WHERE name = 'الفحص-أنجرة')),
('أنجرة', (SELECT id FROM prefectures WHERE name = 'الفحص-أنجرة'));

-- وزان communes
INSERT INTO communes (name, prefecture_id) VALUES 
('وزان', (SELECT id FROM prefectures WHERE name = 'وزان')),
('زومي', (SELECT id FROM prefectures WHERE name = 'وزان'));

-- الدريوش communes
INSERT INTO communes (name, prefecture_id) VALUES 
('الدريوش', (SELECT id FROM prefectures WHERE name = 'الدريوش')),
('ميضار', (SELECT id FROM prefectures WHERE name = 'الدريوش'));

-- جرادة communes
INSERT INTO communes (name, prefecture_id) VALUES 
('جرادة', (SELECT id FROM prefectures WHERE name = 'جرادة')),
('عين بني مطهر', (SELECT id FROM prefectures WHERE name = 'جرادة'));

-- بركان communes
INSERT INTO communes (name, prefecture_id) VALUES 
('بركان', (SELECT id FROM prefectures WHERE name = 'بركان')),
('أحفير', (SELECT id FROM prefectures WHERE name = 'بركان')),
('السعيدية', (SELECT id FROM prefectures WHERE name = 'بركان'));

-- تاوريرت communes
INSERT INTO communes (name, prefecture_id) VALUES 
('تاوريرت', (SELECT id FROM prefectures WHERE name = 'تاوريرت')),
('العيون', (SELECT id FROM prefectures WHERE name = 'تاوريرت'));

-- كرسيف communes
INSERT INTO communes (name, prefecture_id) VALUES 
('كرسيف', (SELECT id FROM prefectures WHERE name = 'كرسيف')),
('تافرسيت', (SELECT id FROM prefectures WHERE name = 'كرسيف'));

-- فجيج communes
INSERT INTO communes (name, prefecture_id) VALUES 
('فجيج', (SELECT id FROM prefectures WHERE name = 'فجيج')),
('بوعرفة', (SELECT id FROM prefectures WHERE name = 'فجيج'));

-- الحاجب communes
INSERT INTO communes (name, prefecture_id) VALUES 
('الحاجب', (SELECT id FROM prefectures WHERE name = 'الحاجب')),
('سبع عيون', (SELECT id FROM prefectures WHERE name = 'الحاجب'));

-- إفران communes
INSERT INTO communes (name, prefecture_id) VALUES 
('إفران', (SELECT id FROM prefectures WHERE name = 'إفران')),
('أزرو', (SELECT id FROM prefectures WHERE name = 'إفران'));

-- مولاي يعقوب communes
INSERT INTO communes (name, prefecture_id) VALUES 
('مولاي يعقوب', (SELECT id FROM prefectures WHERE name = 'مولاي يعقوب')),
('سبع رواضي', (SELECT id FROM prefectures WHERE name = 'مولاي يعقوب'));

-- صفرو communes
INSERT INTO communes (name, prefecture_id) VALUES 
('صفرو', (SELECT id FROM prefectures WHERE name = 'صفرو')),
('البهاليل', (SELECT id FROM prefectures WHERE name = 'صفرو'));

-- بولمان communes
INSERT INTO communes (name, prefecture_id) VALUES 
('بولمان', (SELECT id FROM prefectures WHERE name = 'بولمان')),
('ميسور', (SELECT id FROM prefectures WHERE name = 'بولمان'));

-- تاونات communes
INSERT INTO communes (name, prefecture_id) VALUES 
('تاونات', (SELECT id FROM prefectures WHERE name = 'تاونات')),
('غفساي', (SELECT id FROM prefectures WHERE name = 'تاونات'));

-- تازة communes
INSERT INTO communes (name, prefecture_id) VALUES 
('تازة', (SELECT id FROM prefectures WHERE name = 'تازة')),
('واد أمليل', (SELECT id FROM prefectures WHERE name = 'تازة')),
('أكنول', (SELECT id FROM prefectures WHERE name = 'تازة'));

-- الصخيرات-تمارة communes
INSERT INTO communes (name, prefecture_id) VALUES 
('تمارة', (SELECT id FROM prefectures WHERE name = 'الصخيرات-تمارة')),
('الصخيرات', (SELECT id FROM prefectures WHERE name = 'الصخيرات-تمارة')),
('عين عتيق', (SELECT id FROM prefectures WHERE name = 'الصخيرات-تمارة'));

-- الخميسات communes
INSERT INTO communes (name, prefecture_id) VALUES 
('الخميسات', (SELECT id FROM prefectures WHERE name = 'الخميسات')),
('تيفلت', (SELECT id FROM prefectures WHERE name = 'الخميسات'));

-- سيدي قاسم communes
INSERT INTO communes (name, prefecture_id) VALUES 
('سيدي قاسم', (SELECT id FROM prefectures WHERE name = 'سيدي قاسم')),
('مشرع بلقصيري', (SELECT id FROM prefectures WHERE name = 'سيدي قاسم'));

-- سيدي سليمان communes
INSERT INTO communes (name, prefecture_id) VALUES 
('سيدي سليمان', (SELECT id FROM prefectures WHERE name = 'سيدي سليمان')),
('سيدي يحيى الغرب', (SELECT id FROM prefectures WHERE name = 'سيدي سليمان'));

-- أزيلال communes
INSERT INTO communes (name, prefecture_id) VALUES 
('أزيلال', (SELECT id FROM prefectures WHERE name = 'أزيلال')),
('دمنات', (SELECT id FROM prefectures WHERE name = 'أزيلال'));

-- الفقيه بن صالح communes
INSERT INTO communes (name, prefecture_id) VALUES 
('الفقيه بن صالح', (SELECT id FROM prefectures WHERE name = 'الفقيه بن صالح')),
('سوق السبت', (SELECT id FROM prefectures WHERE name = 'الفقيه بن صالح'));

-- خريبكة communes
INSERT INTO communes (name, prefecture_id) VALUES 
('خريبكة', (SELECT id FROM prefectures WHERE name = 'خريبكة')),
('وادي زم', (SELECT id FROM prefectures WHERE name = 'خريبكة')),
('بجعد', (SELECT id FROM prefectures WHERE name = 'خريبكة'));

-- برشيد communes
INSERT INTO communes (name, prefecture_id) VALUES 
('برشيد', (SELECT id FROM prefectures WHERE name = 'برشيد')),
('بن أحمد', (SELECT id FROM prefectures WHERE name = 'برشيد'));

-- بن سليمان communes
INSERT INTO communes (name, prefecture_id) VALUES 
('بن سليمان', (SELECT id FROM prefectures WHERE name = 'بن سليمان')),
('بوزنيقة', (SELECT id FROM prefectures WHERE name = 'بن سليمان'));

-- سيدي بنور communes
INSERT INTO communes (name, prefecture_id) VALUES 
('سيدي بنور', (SELECT id FROM prefectures WHERE name = 'سيدي بنور')),
('أولاد فرج', (SELECT id FROM prefectures WHERE name = 'سيدي بنور'));

-- شيشاوة communes
INSERT INTO communes (name, prefecture_id) VALUES 
('شيشاوة', (SELECT id FROM prefectures WHERE name = 'شيشاوة')),
('امنتانوت', (SELECT id FROM prefectures WHERE name = 'شيشاوة'));

-- قلعة السراغنة communes
INSERT INTO communes (name, prefecture_id) VALUES 
('قلعة السراغنة', (SELECT id FROM prefectures WHERE name = 'قلعة السراغنة')),
('أولاد زرواال', (SELECT id FROM prefectures WHERE name = 'قلعة السراغنة'));

-- الرحامنة communes
INSERT INTO communes (name, prefecture_id) VALUES 
('ابن جرير', (SELECT id FROM prefectures WHERE name = 'الرحامنة')),
('سيدي بوعثمان', (SELECT id FROM prefectures WHERE name = 'الرحامنة'));

-- اليوسفية communes
INSERT INTO communes (name, prefecture_id) VALUES 
('اليوسفية', (SELECT id FROM prefectures WHERE name = 'اليوسفية')),
('الشماعية', (SELECT id FROM prefectures WHERE name = 'اليوسفية'));

-- ميدلت communes
INSERT INTO communes (name, prefecture_id) VALUES 
('ميدلت', (SELECT id FROM prefectures WHERE name = 'ميدلت')),
('أوتات الحاج', (SELECT id FROM prefectures WHERE name = 'ميدلت'));

-- تنغير communes
INSERT INTO communes (name, prefecture_id) VALUES 
('تنغير', (SELECT id FROM prefectures WHERE name = 'تنغير')),
('الخميس دادس', (SELECT id FROM prefectures WHERE name = 'تنغير'));

-- زاكورة communes
INSERT INTO communes (name, prefecture_id) VALUES 
('زاكورة', (SELECT id FROM prefectures WHERE name = 'زاكورة')),
('أكدز', (SELECT id FROM prefectures WHERE name = 'زاكورة'));

-- إنزكان-أيت ملول communes
INSERT INTO communes (name, prefecture_id) VALUES 
('إنزكان', (SELECT id FROM prefectures WHERE name = 'إنزكان-أيت ملول')),
('أيت ملول', (SELECT id FROM prefectures WHERE name = 'إنزكان-أيت ملول'));

-- شتوكة-أيت باها communes
INSERT INTO communes (name, prefecture_id) VALUES 
('بيوكرى', (SELECT id FROM prefectures WHERE name = 'شتوكة-أيت باها')),
('أيت باها', (SELECT id FROM prefectures WHERE name = 'شتوكة-أيت باها'));

-- طاطا communes
INSERT INTO communes (name, prefecture_id) VALUES 
('طاطا', (SELECT id FROM prefectures WHERE name = 'طاطا')),
('أقا', (SELECT id FROM prefectures WHERE name = 'طاطا'));

-- أسا-الزاك communes
INSERT INTO communes (name, prefecture_id) VALUES 
('أسا', (SELECT id FROM prefectures WHERE name = 'أسا-الزاك')),
('الزاك', (SELECT id FROM prefectures WHERE name = 'أسا-الزاك'));

-- طانطان communes
INSERT INTO communes (name, prefecture_id) VALUES 
('طانطان', (SELECT id FROM prefectures WHERE name = 'طانطان')),
('الوطية', (SELECT id FROM prefectures WHERE name = 'طانطان'));

-- سيدي إفني communes
INSERT INTO communes (name, prefecture_id) VALUES 
('سيدي إفني', (SELECT id FROM prefectures WHERE name = 'سيدي إفني')),
('ميرلفت', (SELECT id FROM prefectures WHERE name = 'سيدي إفني'));

-- بوجدور communes
INSERT INTO communes (name, prefecture_id) VALUES 
('بوجدور', (SELECT id FROM prefectures WHERE name = 'بوجدور'));

-- طرفاية communes
INSERT INTO communes (name, prefecture_id) VALUES 
('طرفاية', (SELECT id FROM prefectures WHERE name = 'طرفاية'));

-- السمارة communes
INSERT INTO communes (name, prefecture_id) VALUES 
('السمارة', (SELECT id FROM prefectures WHERE name = 'السمارة'));

-- أوسرد communes
INSERT INTO communes (name, prefecture_id) VALUES 
('أوسرد', (SELECT id FROM prefectures WHERE name = 'أوسرد'));
