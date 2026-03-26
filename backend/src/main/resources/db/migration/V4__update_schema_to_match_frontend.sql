-- Migration V4: Update schema to match frontend form data structure
-- Note: This migration adds orphans and disabled columns for beneficiary tracking

-- Add orphans and disabled columns for season 23-24
ALTER TABLE housing_meals 
    ADD COLUMN season_2324_orphans INT DEFAULT 0,
    ADD COLUMN season_2324_disabled INT DEFAULT 0;

-- Add orphans and disabled columns for season 24-25
ALTER TABLE housing_meals 
    ADD COLUMN season_2425_orphans INT DEFAULT 0,
    ADD COLUMN season_2425_disabled INT DEFAULT 0;

-- Add orphans and disabled columns for season 25-26
ALTER TABLE housing_meals 
    ADD COLUMN season_2526_orphans INT DEFAULT 0,
    ADD COLUMN season_2526_disabled INT DEFAULT 0;
