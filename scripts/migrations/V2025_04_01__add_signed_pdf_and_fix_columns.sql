-- Migration: Add signed_pdf_url column and fix enum column sizes
-- Date: 2026-04-01

-- Add signed_pdf_url column to institutions table
ALTER TABLE institutions ADD COLUMN IF NOT EXISTS signed_pdf_url VARCHAR(500);

-- Fix building enum columns that are too small (causing "Data truncated" errors)
-- The values like SOME_DEGRADATION (16 chars) were being truncated
ALTER TABLE buildings MODIFY COLUMN building_status VARCHAR(50);
ALTER TABLE buildings MODIFY COLUMN building_condition VARCHAR(50);
ALTER TABLE buildings MODIFY COLUMN renovation_capacity VARCHAR(50);
ALTER TABLE buildings MODIFY COLUMN owner_type VARCHAR(50);

-- Fix other enum columns that might have similar issues
ALTER TABLE institutions MODIFY COLUMN institution_type VARCHAR(50);
ALTER TABLE institutions MODIFY COLUMN milieu VARCHAR(50);
ALTER TABLE institutions MODIFY COLUMN legal_status VARCHAR(50);
ALTER TABLE institutions MODIFY COLUMN distance_to_school VARCHAR(50);
ALTER TABLE institutions MODIFY COLUMN distance_to_national_boarding_school VARCHAR(50);

ALTER TABLE targeting MODIFY COLUMN selection_body VARCHAR(50);
ALTER TABLE targeting MODIFY COLUMN tariff_type VARCHAR(50);

ALTER TABLE housing_meals MODIFY COLUMN meal_service_type VARCHAR(50);

ALTER TABLE staff_members MODIFY COLUMN staff_type VARCHAR(100);
