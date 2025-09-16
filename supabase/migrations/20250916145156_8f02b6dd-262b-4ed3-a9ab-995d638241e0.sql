-- Create enum for application features
CREATE TYPE app_feature AS ENUM (
  'mestre_beleza',
  'consultor_mkt', 
  'fluida_roteirista',
  'videos',
  'fotos',
  'artes',
  'artigos_cientificos',
  'academia',
  'equipamentos',
  'fotos_antes_depois',
  'reports',
  'planner',
  'ideas'
);

-- Table for user feature permissions
CREATE TABLE user_feature_permissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  feature app_feature NOT NULL,
  enabled BOOLEAN DEFAULT false,
  expires_at TIMESTAMPTZ,
  granted_at TIMESTAMPTZ DEFAULT now(),
  granted_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, feature)
);

-- Table for feature notifications (new access alerts)
CREATE TABLE feature_notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  feature app_feature NOT NULL,
  notification_type TEXT DEFAULT 'new_access',
  title TEXT NOT NULL,
  message TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ DEFAULT (now() + interval '30 days')
);

-- Enable RLS
ALTER TABLE user_feature_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_feature_permissions
CREATE POLICY "Users can view own permissions" 
ON user_feature_permissions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all permissions" 
ON user_feature_permissions 
FOR ALL 
USING (is_current_user_admin());

-- RLS Policies for feature_notifications
CREATE POLICY "Users can view own notifications" 
ON feature_notifications 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" 
ON feature_notifications 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can create notifications" 
ON feature_notifications 
FOR INSERT 
WITH CHECK (is_current_user_admin());

-- Trigger to update updated_at timestamp
CREATE TRIGGER update_user_feature_permissions_updated_at
BEFORE UPDATE ON user_feature_permissions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();