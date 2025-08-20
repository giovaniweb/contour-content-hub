-- Fix function search path security issue for the newly created functions
-- This addresses the WARN: Function Search Path Mutable security warning

-- Update log_invite_action function to have immutable search_path
CREATE OR REPLACE FUNCTION public.log_invite_action(
  p_invite_id UUID,
  p_action_type TEXT,
  p_details JSONB DEFAULT '{}'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'  -- Fixed: Made search_path immutable
AS $$
DECLARE
  audit_id UUID;
BEGIN
  INSERT INTO public.academy_invite_audit (
    invite_id,
    action_type,
    performed_by,
    details
  ) VALUES (
    p_invite_id,
    p_action_type,
    auth.uid(),
    p_details
  ) RETURNING id INTO audit_id;
  
  RETURN audit_id;
END;
$$;

-- Update trigger function to have immutable search_path
CREATE OR REPLACE FUNCTION public.trigger_log_invite_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'  -- Fixed: Made search_path immutable
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM public.log_invite_action(
      NEW.id,
      'created',
      jsonb_build_object(
        'email', NEW.email,
        'first_name', NEW.first_name,
        'course_count', array_length(NEW.course_ids, 1),
        'expires_at', NEW.expires_at
      )
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Log status changes
    IF OLD.status != NEW.status THEN
      PERFORM public.log_invite_action(
        NEW.id,
        CASE NEW.status
          WHEN 'cancelled' THEN 'cancelled'
          WHEN 'accepted' THEN 'accepted'
          WHEN 'expired' THEN 'expired'
          ELSE 'status_changed'
        END,
        jsonb_build_object(
          'old_status', OLD.status,
          'new_status', NEW.status
        )
      );
    END IF;
    
    -- Log if expires_at was updated (resend)
    IF OLD.expires_at != NEW.expires_at THEN
      PERFORM public.log_invite_action(
        NEW.id,
        'resent',
        jsonb_build_object(
          'old_expires_at', OLD.expires_at,
          'new_expires_at', NEW.expires_at
        )
      );
    END IF;
    
    RETURN NEW;
  END IF;
  
  RETURN NULL;
END;
$$;