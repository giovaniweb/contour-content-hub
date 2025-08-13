-- Corrigir a função calculate_final_purchase_score sem search_path
CREATE OR REPLACE FUNCTION public.calculate_final_purchase_score(user_id_param uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    engagement INTEGER;
    interest INTEGER;
    behavior INTEGER;
    final INTEGER;
    tier TEXT;
BEGIN
    -- Buscar scores atuais
    SELECT engagement_score, interest_score, behavior_score
    INTO engagement, interest, behavior
    FROM public.user_purchase_scores
    WHERE user_id = user_id_param;

    -- Calcular score final (média ponderada)
    final := (engagement * 0.4 + interest * 0.4 + behavior * 0.2)::INTEGER;

    -- Determinar tier
    IF final >= 80 THEN tier := 'very_hot';
    ELSIF final >= 60 THEN tier := 'hot';
    ELSIF final >= 40 THEN tier := 'warm';
    ELSE tier := 'cold';
    END IF;

    -- Atualizar na tabela
    UPDATE public.user_purchase_scores
    SET final_score = final,
        probability_tier = tier,
        hot_lead_alert = CASE WHEN tier IN ('hot', 'very_hot') THEN true ELSE false END,
        updated_at = now()
    WHERE user_id = user_id_param;
END;
$$;