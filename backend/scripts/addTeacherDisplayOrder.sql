-- Migration: Add position column to teachers table
-- Run this SQL in your Supabase SQL Editor

ALTER TABLE teachers 
ADD COLUMN IF NOT EXISTS "position" VARCHAR(100) DEFAULT 'Teacher';
