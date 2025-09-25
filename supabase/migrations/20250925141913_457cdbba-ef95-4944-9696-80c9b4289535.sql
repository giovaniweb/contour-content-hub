-- Add missing default permissions for user giovani.g2008@gmail.com
INSERT INTO public.user_feature_permissions (user_id, feature, enabled, expires_at)
VALUES 
  ('d0d1d33b-14bd-4b3f-9766-59a77c66964d', 'fotos', true, NULL),
  ('d0d1d33b-14bd-4b3f-9766-59a77c66964d', 'artes', true, NULL)
ON CONFLICT (user_id, feature) DO UPDATE SET 
  enabled = EXCLUDED.enabled;