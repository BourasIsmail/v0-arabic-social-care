-- Migration V4: Update schema to match frontend form data structure

-- Update housing_meals table columns for season beneficiaries
-- Drop old columns and add new ones for orphans and disabled

-- Add orphans and disabled columns for each season
ALTER TABLE housing_meals ADD COLUMN IF NOT EXISTS season_2324_orphans INT DEFAULT 0;
ALTER TABLE housing_meals ADD COLUMN IF NOT EXISTS season_2324_disabled INT DEFAULT 0;
ALTER TABLE housing_meals ADD COLUMN IF NOT EXISTS season_2425_orphans INT DEFAULT 0;
ALTER TABLE housing_meals ADD COLUMN IF NOT EXISTS season_2425_disabled INT DEFAULT 0;
ALTER TABLE housing_meals ADD COLUMN IF NOT EXISTS season_2526_orphans INT DEFAULT 0;
ALTER TABLE housing_meals ADD COLUMN IF NOT EXISTS season_2526_disabled INT DEFAULT 0;

-- Rename 'other' columns to remove them (data will be migrated to new structure)
-- These may not exist if schema was created fresh
ALTER TABLE housing_meals DROP COLUMN IF EXISTS season_2324_other;
ALTER TABLE housing_meals DROP COLUMN IF EXISTS season_2425_other;
ALTER TABLE housing_meals DROP COLUMN IF EXISTS season_2526_other;
