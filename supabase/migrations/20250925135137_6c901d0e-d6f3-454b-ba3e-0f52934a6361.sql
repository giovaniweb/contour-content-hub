-- Robust cleanup: keep only admins, remove specific Giovanni accounts and all non-admins
DO $$
DECLARE
  rec RECORD;
  tbl RECORD;
  del_count INTEGER := 0;
BEGIN
  -- 1) Create a temp table with user ids to delete (all non-admins + specific emails)
  CREATE TEMP TABLE tmp_user_ids_to_delete(id uuid PRIMARY KEY);
  
  -- Add all non-admin users
  INSERT INTO tmp_user_ids_to_delete(id)
  SELECT id FROM perfis WHERE role NOT IN ('admin','superadmin');
  
  -- Ensure specific emails are included even if admin (explicit request)
  INSERT INTO tmp_user_ids_to_delete(id)
  SELECT id FROM perfis WHERE email IN ('giovani@contourline.com.br', 'giovani.g2008@gmail.com')
  ON CONFLICT DO NOTHING;
  
  -- If those emails exist in auth.users without a profile, include them too
  INSERT INTO tmp_user_ids_to_delete(id)
  SELECT id FROM auth.users 
  WHERE email IN ('giovani@contourline.com.br', 'giovani.g2008@gmail.com')
    AND id NOT IN (SELECT id FROM perfis)
  ON CONFLICT DO NOTHING;

  -- If nothing to delete, exit gracefully
  IF (SELECT COUNT(*) FROM tmp_user_ids_to_delete) = 0 THEN
    RAISE NOTICE 'No users to delete.';
    RETURN;
  END IF;

  -- 2) Delete rows from all public tables that have a user_id column
  FOR tbl IN 
    SELECT table_schema, table_name
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND column_name = 'user_id'
  LOOP
    EXECUTE format('DELETE FROM %I.%I WHERE user_id = ANY (SELECT id FROM tmp_user_ids_to_delete);', tbl.table_schema, tbl.table_name);
  END LOOP;

  -- 3) Delete rows from all public tables that have a usuario_id column
  FOR tbl IN 
    SELECT table_schema, table_name
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND column_name = 'usuario_id'
  LOOP
    EXECUTE format('DELETE FROM %I.%I WHERE usuario_id = ANY (SELECT id FROM tmp_user_ids_to_delete);', tbl.table_schema, tbl.table_name);
  END LOOP;

  -- 4) Delete rows from all public tables that have a target_user_id column (audit/relations)
  FOR tbl IN 
    SELECT table_schema, table_name
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND column_name = 'target_user_id'
  LOOP
    EXECUTE format('DELETE FROM %I.%I WHERE target_user_id = ANY (SELECT id FROM tmp_user_ids_to_delete);', tbl.table_schema, tbl.table_name);
  END LOOP;

  -- 5) Finally delete auth.users (will cascade to perfis via FK)
  DELETE FROM auth.users WHERE id = ANY (SELECT id FROM tmp_user_ids_to_delete);

  -- 6) Safety: remove any remaining profiles without auth users
  DELETE FROM perfis p WHERE NOT EXISTS (SELECT 1 FROM auth.users u WHERE u.id = p.id);

  RAISE NOTICE 'Cleanup complete. Deleted users: %', (SELECT COUNT(*) FROM tmp_user_ids_to_delete);
END $$;