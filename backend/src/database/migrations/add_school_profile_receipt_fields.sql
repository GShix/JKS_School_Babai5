-- Add additional fields to school_profile table for receipts
-- Run this migration to add logo, PAN number, and registration details

ALTER TABLE school_profile
ADD COLUMN IF NOT EXISTS logo_url VARCHAR(500) AFTER facebook_url,
ADD COLUMN IF NOT EXISTS pan_number VARCHAR(50) AFTER logo_url,
ADD COLUMN IF NOT EXISTS registration_number VARCHAR(100) AFTER pan_number,
ADD COLUMN IF NOT EXISTS affiliation VARCHAR(255) AFTER registration_number,
ADD COLUMN IF NOT EXISTS fax VARCHAR(20) AFTER phone,
ADD COLUMN IF NOT EXISTS tax_percentage DECIMAL(5,2) DEFAULT 0.00 AFTER affiliation;

-- Update default school profile with sample data
UPDATE school_profile 
SET 
  pan_number = '301480818',
  registration_number = '345/65',
  affiliation = 'Ministry of Education, Government of Nepal',
  fax = '057-527263'
WHERE id = 1;
