-- Migration script to update students table with new fields
-- This adds all the fields needed for the enhanced student management system
-- Run this script to add new columns to your existing students table

-- Note: This is an ALTER TABLE script, so it works with existing data
-- Existing students will have NULL values for new fields

-- Basic Information Fields
ALTER TABLE students ADD COLUMN IF NOT EXISTS "nationalIdNumber" VARCHAR(255);
ALTER TABLE students ADD COLUMN IF NOT EXISTS "firstName" VARCHAR(255);
ALTER TABLE students ADD COLUMN IF NOT EXISTS "middleName" VARCHAR(255);
ALTER TABLE students ADD COLUMN IF NOT EXISTS "lastName" VARCHAR(255);
ALTER TABLE students ADD COLUMN IF NOT EXISTS "iemisId" VARCHAR(255) UNIQUE;
ALTER TABLE students ADD COLUMN IF NOT EXISTS "contactNumber" VARCHAR(255);
ALTER TABLE students ADD COLUMN IF NOT EXISTS "isForeignStudent" BOOLEAN DEFAULT FALSE;

-- Permanent Address Fields (Nepal Administrative Structure)
ALTER TABLE students ADD COLUMN IF NOT EXISTS "permanentProvince" VARCHAR(255);
ALTER TABLE students ADD COLUMN IF NOT EXISTS "permanentDistrict" VARCHAR(255);
ALTER TABLE students ADD COLUMN IF NOT EXISTS "permanentMunicipality" VARCHAR(255);
ALTER TABLE students ADD COLUMN IF NOT EXISTS "permanentWard" VARCHAR(50);

-- Temporary/Current Address Fields
ALTER TABLE students ADD COLUMN IF NOT EXISTS "temporaryProvince" VARCHAR(255);
ALTER TABLE students ADD COLUMN IF NOT EXISTS "temporaryDistrict" VARCHAR(255);
ALTER TABLE students ADD COLUMN IF NOT EXISTS "temporaryMunicipality" VARCHAR(255);
ALTER TABLE students ADD COLUMN IF NOT EXISTS "temporaryWard" VARCHAR(50);
ALTER TABLE students ADD COLUMN IF NOT EXISTS "sameAsPermAddress" BOOLEAN DEFAULT FALSE;

-- Family Information
ALTER TABLE students ADD COLUMN IF NOT EXISTS "fatherName" VARCHAR(255);
ALTER TABLE students ADD COLUMN IF NOT EXISTS "motherName" VARCHAR(255);
ALTER TABLE students ADD COLUMN IF NOT EXISTS "guardianContactNo" VARCHAR(255);

-- Academic Information
ALTER TABLE students ADD COLUMN IF NOT EXISTS "admitYear" VARCHAR(10);
ALTER TABLE students ADD COLUMN IF NOT EXISTS "subject" VARCHAR(255);

-- Personal Details
ALTER TABLE students ADD COLUMN IF NOT EXISTS "caste" VARCHAR(100);
ALTER TABLE students ADD COLUMN IF NOT EXISTS "motherTongue" VARCHAR(100);
ALTER TABLE students ADD COLUMN IF NOT EXISTS "disabilityType" VARCHAR(100);

-- School Information
ALTER TABLE students ADD COLUMN IF NOT EXISTS "schoolingSource" VARCHAR(100);
ALTER TABLE students ADD COLUMN IF NOT EXISTS "scholarship" VARCHAR(100);

-- Photo field (for Supabase storage URLs)
ALTER TABLE students ADD COLUMN IF NOT EXISTS "photo" TEXT;

-- Update fullName for existing records if needed
-- This will combine firstName, middleName, and lastName
-- Only run this after the initial migration
-- UPDATE students 
-- SET "fullName" = CONCAT_WS(' ', "firstName", "middleName", "lastName")
-- WHERE "firstName" IS NOT NULL AND "lastName" IS NOT NULL;

-- Create index on frequently queried fields for better performance
CREATE INDEX IF NOT EXISTS idx_students_iemis_id ON students("iemisId");
CREATE INDEX IF NOT EXISTS idx_students_class ON students("class");
CREATE INDEX IF NOT EXISTS idx_students_status ON students("status");
CREATE INDEX IF NOT EXISTS idx_students_province ON students("permanentProvince");
CREATE INDEX IF NOT EXISTS idx_students_district ON students("permanentDistrict");
CREATE INDEX IF NOT EXISTS idx_students_foreign ON students("isForeignStudent");

-- Comments for documentation
COMMENT ON COLUMN students."isForeignStudent" IS 'Indicates if the student is from outside Nepal';
COMMENT ON COLUMN students."permanentProvince" IS 'Permanent address province (one of 7 provinces of Nepal)';
COMMENT ON COLUMN students."permanentDistrict" IS 'Permanent address district (77 districts of Nepal)';
COMMENT ON COLUMN students."permanentMunicipality" IS 'Permanent address local body/municipality';
COMMENT ON COLUMN students."permanentWard" IS 'Permanent address ward number';
COMMENT ON COLUMN students."sameAsPermAddress" IS 'True if temporary address is same as permanent address';
COMMENT ON COLUMN students."photo" IS 'Student photo URL from Supabase storage';
COMMENT ON COLUMN students."iemisId" IS 'Individual Education Management Information System ID';
