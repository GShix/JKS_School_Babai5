-- Migration: Make feeAllocationId nullable for flexible fee collection
-- Date: 2026-02-20
-- Purpose: Allow fee transactions without allocations for flexible collection

-- Make feeAllocationId nullable
ALTER TABLE fee_transactions 
ALTER COLUMN "feeAllocationId" DROP NOT NULL;

-- Add comment
COMMENT ON COLUMN fee_transactions."feeAllocationId" 
IS 'Reference to the fee allocation (nullable for flexible collection)';
