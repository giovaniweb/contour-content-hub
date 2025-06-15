
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook dinâmico para buscar conteúdos do banco Mestre da Beleza por palavra-chave.
 * Retorna artigos científicos, roteiros aprovados e equipamentos do supabase que "batem" com o termo buscado.
 * Pronto para uso: useConteudoDinamicoMestre("lipedema")
 */

type ArtigoCientifico = {
  id: string;
  titulo: string;
  conteudo_extraido?: string;
  descricao?: string;
};

type RoteiroAprovado = {
  id: string;
  titulo: string | null;
  script_content: string;
  approved_at?: string;
  approval_status?: string;
};

type Equipamento = {
  id: string;
  nome: string;
  tecnologia: string;
  indicacoes: string;
  beneficios?: string;
  diferenciais?: string;
  area_aplicacao?: string[];
  categoria?: string;
};

type MdbConteudo = {
  artigos: ArtigoCientifico[];
  roteiros: RoteiroAprovado[];
  equipamentos: Equipamento[];
  loading: boolean;
  error: string | null;
};

export function useConteudoDinamicoMestre(keyword: string) {
  const [conteudo, setConteudo] = useState<MdbConteudo>({
    artigos: [],
    roteiros: [],
    equipamentos: [],
    loading: false,
    error: null
  });

  const fetchConteudo = useCallback(async () => {
    setConteudo((prev) => ({ ...prev, loading: true, error: null }));
    try {
      // Buscar artigos científicos
      const { data: artigosData, error: artigosErr } = await supabase
        .from("documentos_tecnicos")
        .select("id, titulo, conteudo_extraido, descricao")
        .ilike("titulo", `%${keyword}%`);

      // Buscar roteiros aprovados (coluna correta é 'title', não 'titulo')
      const { data: roteirosData, error: roteirosErr } = await supabase
        .from("approved_scripts")
        .select("id, title, script_content, approved_at, approval_status")
        .ilike("script_content", `%${keyword}%`);

      // Mapear roteiros para o formato esperado com 'titulo'
      const roteiros: RoteiroAprovado[] =
        roteirosData?.map((r: any) => ({
          id: r.id,
          titulo: r.title ?? null,
          script_content: r.script_content,
          approved_at: r.approved_at,
          approval_status: r.approval_status
        })) ?? [];

      // Buscar equipamentos
      const { data: equipamentosData, error: equipamentosErr } = await supabase
        .from("equipamentos")
        .select("id, nome, tecnologia, indicacoes, beneficios, diferenciais, area_aplicacao, categoria")
        .or([
          `nome.ilike.%${keyword}%`,
          `tecnologia.ilike.%${keyword}%`,
          `indicacoes.ilike.%${keyword}%`
        ].join(","));

      setConteudo({
        artigos: artigosData || [],
        roteiros,
        equipamentos: equipamentosData || [],
        loading: false,
        error: artigosErr?.message || roteirosErr?.message || equipamentosErr?.message || null,
      });
    } catch (error: any) {
      setConteudo({
        artigos: [],
        roteiros: [],
        equipamentos: [],
        loading: false,
        error: error.message || "Erro desconhecido"
      });
    }
  }, [keyword]);

  useEffect(() => {
    if (!keyword || keyword.trim().length < 2) {
      setConteudo((prev) => ({
        ...prev, artigos: [], roteiros: [], equipamentos: [], loading: false, error: null
      }));
      return;
    }
    fetchConteudo();
  }, [keyword, fetchConteudo]);

  return conteudo;
}

/**
 * Exemplo de uso do hook:
 * 
 * const { artigos, roteiros, equipamentos, loading, error } = useConteudoDinamicoMestre("lipedema");
 * 
 * // artigos: lista de artigos científicos sobre lipedema
 * // roteiros: lista de roteiros aprovados que mencionam lipedema
 * // equipamentos: lista de equipamentos pertinentes ao tema/lipedema
 * 
 * // Pode ser usado para sugerir perguntas automáticas, diagnósticos, sugestões dinâmicas!
 */
