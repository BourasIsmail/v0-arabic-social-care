-- Add parent_contribution_amount column to financings table
-- This column stores the monthly amount for parent subscriptions when operatingParentContributions is true

ALTER TABLE financings
ADD COLUMN IF NOT EXISTS parent_contribution_amount DECIMAL(15, 2) DEFAULT NULL;

-- Add comment for documentation
ALTER TABLE financings
MODIFY COLUMN parent_contribution_amount DECIMAL(15, 2) COMMENT 'Monthly parent contribution amount in MAD (shown when operatingParentContributions is true)';
