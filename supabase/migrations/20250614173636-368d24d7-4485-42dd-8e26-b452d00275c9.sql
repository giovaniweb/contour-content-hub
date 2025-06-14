
-- 1. ATIVAR RLS EM TABELAS PRINCIPAIS (caso ainda não esteja ativado)

-- Ativar RLS nas tabelas principais (videos, roteiros, equipamentos, user_usage, user_gamification)
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roteiros ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_gamification ENABLE ROW LEVEL SECURITY;

-- 2. CRIAR POLÍTICAS BÁSICAS PARA QUE USUÁRIOS ACESSEM APENAS SEUS DADOS

-- Videos: usuário só vê e modifica seus próprios vídeos
CREATE POLICY "User can view own videos"
  ON public.videos
  FOR SELECT
  USING (true); -- Ajuste se houver coluna de user_id

-- Roteiros: apenas usuário dono pode visualizar e alterar
CREATE POLICY "User can view/edit own roteiros"
  ON public.roteiros
  FOR ALL
  USING (usuario_id = auth.uid());

-- Equipamentos: manter público, mas somente admins podem alterar (exemplo)
CREATE POLICY "Public can view equipamentos"
  ON public.equipamentos
  FOR SELECT
  USING (true);

-- user_usage e user_gamification: acesso restrito ao próprio usuário
CREATE POLICY "User can view/update own usage"
  ON public.user_usage
  FOR ALL
  USING (user_id = auth.uid());

CREATE POLICY "User can view/update own gamification"
  ON public.user_gamification
  FOR ALL
  USING (user_id = auth.uid());

-- 3. REMOVER SEGREDOS/VARIÁVEIS DE INTEGRAÇÃO NÃO MAIS USADAS (Ex: Vimeo)
-- (Esse passo é manual ou via painel, só documentar aqui como lembrete)
-- Exemplo: Apagar variáveis VIMEO_CLIENT_ID e VIMEO_CLIENT_SECRET do painel Supabase, se já não existirem

