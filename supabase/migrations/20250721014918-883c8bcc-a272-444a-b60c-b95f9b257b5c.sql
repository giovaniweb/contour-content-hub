-- Criar tabela para tracking de ações dos usuários
CREATE TABLE IF NOT EXISTS public.user_actions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    action_type TEXT NOT NULL, -- 'video_watch', 'video_download', 'diagnostic_complete', 'article_view', etc
    target_id UUID, -- id do vídeo, equipamento, artigo, etc
    target_type TEXT, -- 'video', 'equipment', 'article', etc
    metadata JSONB DEFAULT '{}',
    xp_awarded INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela expandida de gamificação
CREATE TABLE IF NOT EXISTS public.user_gamification (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE,
    xp_total INTEGER DEFAULT 0,
    level_current TEXT DEFAULT 'Bronze',
    badges JSONB DEFAULT '[]',
    videos_watched INTEGER DEFAULT 0,
    videos_downloaded INTEGER DEFAULT 0,
    diagnostics_completed INTEGER DEFAULT 0,
    articles_viewed INTEGER DEFAULT 0,
    photos_uploaded INTEGER DEFAULT 0,
    consecutive_days INTEGER DEFAULT 0,
    last_activity_date DATE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para scoring de probabilidade de compra
CREATE TABLE IF NOT EXISTS public.user_purchase_scores (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE,
    engagement_score INTEGER DEFAULT 0, -- 0-100 baseado na atividade
    interest_score INTEGER DEFAULT 0, -- 0-100 baseado nos equipamentos visualizados
    behavior_score INTEGER DEFAULT 0, -- 0-100 baseado no comportamento
    final_score INTEGER DEFAULT 0, -- 0-100 score final
    probability_tier TEXT DEFAULT 'cold', -- 'cold', 'warm', 'hot', 'very_hot'
    last_equipment_interest UUID, -- último equipamento que mostrou interesse
    hot_lead_alert BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.user_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_gamification ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_purchase_scores ENABLE ROW LEVEL SECURITY;

-- Políticas para user_actions
CREATE POLICY "Users can insert their own actions" ON public.user_actions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own actions" ON public.user_actions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all actions" ON public.user_actions
    FOR SELECT USING (
        auth.uid() IN (
            SELECT id FROM public.perfis WHERE role = 'admin'
        )
    );

-- Políticas para user_gamification
CREATE POLICY "Users can manage their own gamification" ON public.user_gamification
    FOR ALL USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all gamification" ON public.user_gamification
    FOR SELECT USING (
        auth.uid() IN (
            SELECT id FROM public.perfis WHERE role = 'admin'
        )
    );

-- Políticas para user_purchase_scores
CREATE POLICY "Users can view their own scores" ON public.user_purchase_scores
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all scores" ON public.user_purchase_scores
    FOR ALL USING (
        auth.uid() IN (
            SELECT id FROM public.perfis WHERE role = 'admin'
        )
    );

-- Função para atualizar score de engajamento automaticamente
CREATE OR REPLACE FUNCTION public.update_user_engagement_score()
RETURNS TRIGGER AS $$
DECLARE
    current_score INTEGER;
    xp_bonus INTEGER := 0;
BEGIN
    -- Definir XP baseado na ação
    CASE NEW.action_type
        WHEN 'video_watch' THEN xp_bonus := 10;
        WHEN 'video_download' THEN xp_bonus := 5;
        WHEN 'diagnostic_complete' THEN xp_bonus := 50;
        WHEN 'article_view' THEN xp_bonus := 15;
        WHEN 'photo_upload' THEN xp_bonus := 25;
        WHEN 'equipment_view' THEN xp_bonus := 3;
        ELSE xp_bonus := 1;
    END CASE;

    -- Atualizar XP na tabela user_actions
    NEW.xp_awarded = xp_bonus;

    -- Atualizar gamificação
    INSERT INTO public.user_gamification (user_id, xp_total, last_activity_date)
    VALUES (NEW.user_id, xp_bonus, CURRENT_DATE)
    ON CONFLICT (user_id) DO UPDATE SET
        xp_total = user_gamification.xp_total + xp_bonus,
        last_activity_date = CURRENT_DATE,
        updated_at = now(),
        videos_watched = CASE WHEN NEW.action_type = 'video_watch' THEN user_gamification.videos_watched + 1 ELSE user_gamification.videos_watched END,
        videos_downloaded = CASE WHEN NEW.action_type = 'video_download' THEN user_gamification.videos_downloaded + 1 ELSE user_gamification.videos_downloaded END,
        diagnostics_completed = CASE WHEN NEW.action_type = 'diagnostic_complete' THEN user_gamification.diagnostics_completed + 1 ELSE user_gamification.diagnostics_completed END,
        articles_viewed = CASE WHEN NEW.action_type = 'article_view' THEN user_gamification.articles_viewed + 1 ELSE user_gamification.articles_viewed END,
        photos_uploaded = CASE WHEN NEW.action_type = 'photo_upload' THEN user_gamification.photos_uploaded + 1 ELSE user_gamification.photos_uploaded END;

    -- Atualizar score de compra
    INSERT INTO public.user_purchase_scores (user_id)
    VALUES (NEW.user_id)
    ON CONFLICT (user_id) DO UPDATE SET
        engagement_score = LEAST(100, user_purchase_scores.engagement_score + CASE 
            WHEN NEW.action_type IN ('video_watch', 'video_download') THEN 2
            WHEN NEW.action_type = 'diagnostic_complete' THEN 15
            WHEN NEW.action_type = 'photo_upload' THEN 10
            ELSE 1
        END),
        last_equipment_interest = CASE WHEN NEW.target_type = 'equipment' THEN NEW.target_id ELSE user_purchase_scores.last_equipment_interest END,
        updated_at = now();

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para atualizar scores automaticamente
CREATE TRIGGER trigger_update_engagement_score
    BEFORE INSERT ON public.user_actions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_user_engagement_score();

-- Função para calcular score final de compra
CREATE OR REPLACE FUNCTION public.calculate_final_purchase_score(user_id_param UUID)
RETURNS VOID AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_user_actions_user_id ON public.user_actions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_actions_type_date ON public.user_actions(action_type, created_at);
CREATE INDEX IF NOT EXISTS idx_user_gamification_xp ON public.user_gamification(xp_total DESC);
CREATE INDEX IF NOT EXISTS idx_purchase_scores_tier ON public.user_purchase_scores(probability_tier);