-- =====================================================
-- Fee Structure Enhancement Migration
-- Run this SQL directly in your PostgreSQL database
-- =====================================================

-- Add purpose column to fee_structures table
ALTER TABLE fee_structures 
ADD COLUMN IF NOT EXISTS purpose VARCHAR(50) 
DEFAULT 'tuition' 
CHECK (purpose IN ('admission', 'tuition', 'examination', 'event', 'transport', 'hostel', 'library', 'lab', 'sports', 'other'));

COMMENT ON COLUMN fee_structures.purpose IS 'Purpose/type of this fee structure';

-- Add isTemplate column to fee_structures table
ALTER TABLE fee_structures 
ADD COLUMN IF NOT EXISTS "isTemplate" BOOLEAN 
DEFAULT false;

COMMENT ON COLUMN fee_structures."isTemplate" IS 'Whether this is a template for cloning';

-- Add clonedFrom column to fee_structures table
ALTER TABLE fee_structures 
ADD COLUMN IF NOT EXISTS "clonedFrom" INTEGER 
DEFAULT NULL;

COMMENT ON COLUMN fee_structures."clonedFrom" IS 'ID of the template this was cloned from';

-- Create index for purpose column for better query performance
CREATE INDEX IF NOT EXISTS idx_fee_structures_purpose ON fee_structures(purpose);

-- Create index for isTemplate column
CREATE INDEX IF NOT EXISTS idx_fee_structures_template ON fee_structures("isTemplate");

-- Update existing records to have default purpose 'tuition'
UPDATE fee_structures 
SET purpose = 'tuition' 
WHERE purpose IS NULL;

-- Make purpose NOT NULL after setting defaults
ALTER TABLE fee_structures 
ALTER COLUMN purpose SET NOT NULL;

-- Display results
SELECT 
    'Migration completed successfully!' AS status,
    COUNT(*) AS total_structures,
    COUNT(*) FILTER (WHERE "isTemplate" = true) AS templates,
    COUNT(*) FILTER (WHERE purpose = 'tuition') AS tuition_fees,
    COUNT(*) FILTER (WHERE purpose = 'examination') AS exam_fees
FROM fee_structures;
