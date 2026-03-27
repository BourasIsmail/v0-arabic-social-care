-- Add region_id and prefecture_id columns to users table
ALTER TABLE users ADD COLUMN region_id BIGINT NULL;
ALTER TABLE users ADD COLUMN prefecture_id BIGINT NULL;

-- Add foreign key constraints
ALTER TABLE users ADD CONSTRAINT fk_users_region FOREIGN KEY (region_id) REFERENCES regions(id);
ALTER TABLE users ADD CONSTRAINT fk_users_prefecture FOREIGN KEY (prefecture_id) REFERENCES prefectures(id);
