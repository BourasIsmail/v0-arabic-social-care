-- Migration V4: Add orphans and disabled tracking columns to housing_meals table

ALTER TABLE housing_meals ADD COLUMN season_2324_orphans INT DEFAULT 0;
ALTER TABLE housing_meals ADD COLUMN season_2324_disabled INT DEFAULT 0;
ALTER TABLE housing_meals ADD COLUMN season_2425_orphans INT DEFAULT 0;
ALTER TABLE housing_meals ADD COLUMN season_2425_disabled INT DEFAULT 0;
ALTER TABLE housing_meals ADD COLUMN season_2526_orphans INT DEFAULT 0;
ALTER TABLE housing_meals ADD COLUMN season_2526_disabled INT DEFAULT 0;
