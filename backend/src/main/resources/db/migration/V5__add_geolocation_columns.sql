-- V5: Add geolocation columns (latitude, longitude) to institutions table

ALTER TABLE institutions
ADD COLUMN latitude DOUBLE PRECISION,
ADD COLUMN longitude DOUBLE PRECISION;

-- Add comment for documentation
COMMENT ON COLUMN institutions.latitude IS 'Geographic latitude of the institution';
COMMENT ON COLUMN institutions.longitude IS 'Geographic longitude of the institution';
