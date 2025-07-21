-- Fix Security Definer View issue - Remove the problematic view

-- Drop the existing security definer view that's causing the security issue
DROP VIEW IF EXISTS public.database_documentation;

-- The database_documentation table already exists as a regular table, 
-- so we don't need to recreate it. The security issue was with a view, not the table.