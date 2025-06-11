
-- Adicionar novos campos à tabela equipamentos
ALTER TABLE public.equipamentos 
ADD COLUMN thumbnail_url text,
ADD COLUMN area_aplicacao text[] DEFAULT '{}',
ADD COLUMN tipo_acao text,
ADD COLUMN possui_consumiveis boolean DEFAULT false,
ADD COLUMN contraindicacoes text[] DEFAULT '{}',
ADD COLUMN perfil_ideal_paciente text[] DEFAULT '{}',
ADD COLUMN nivel_investimento text,
ADD COLUMN akinator_enabled boolean DEFAULT true,
ADD COLUMN categoria text DEFAULT 'estetico';

-- Criar tabela para ponteiras
CREATE TABLE public.equipment_applicators (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  equipment_id uuid REFERENCES public.equipamentos(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  technology text,
  description text,
  image_url text,
  active boolean DEFAULT true,
  order_index integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Índices para melhor performance
CREATE INDEX idx_equipment_applicators_equipment_id ON public.equipment_applicators(equipment_id);
CREATE INDEX idx_equipment_applicators_active ON public.equipment_applicators(active);

-- RLS para ponteiras (usuários podem ver e editar suas próprias ponteiras)
ALTER TABLE public.equipment_applicators ENABLE ROW LEVEL SECURITY;

-- Policies básicas para ponteiras (ajustar conforme necessário)
CREATE POLICY "Users can view applicators" ON public.equipment_applicators FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert applicators" ON public.equipment_applicators FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can update applicators" ON public.equipment_applicators FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Users can delete applicators" ON public.equipment_applicators FOR DELETE TO authenticated USING (true);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_equipment_applicators_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_equipment_applicators_updated_at
  BEFORE UPDATE ON public.equipment_applicators
  FOR EACH ROW EXECUTE PROCEDURE update_equipment_applicators_updated_at();
