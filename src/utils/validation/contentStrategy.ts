
import { ContentStrategyItem, ContentCategory, ContentFormat, ContentObjective, ContentPriority, ContentStatus, ContentDistribution } from "@/types/content-strategy";

/**
 * Transforma os dados brutos do Supabase em um objeto ContentStrategyItem tipado
 */
export function transformToContentStrategyItem(data: any): ContentStrategyItem {
  const estrategiaItem: ContentStrategyItem = {
    id: data.id,
    linha: data.linha,
    equipamento_id: data.equipamento_id,
    equipamento_nome: data.equipamento?.nome || null,
    categoria: data.categoria as ContentCategory,
    formato: data.formato as ContentFormat,
    responsavel_id: data.responsavel_id,
    responsavel_nome: data.responsavel?.nome || null,
    previsao: data.previsao,
    conteudo: data.conteudo,
    objetivo: data.objetivo as ContentObjective,
    prioridade: data.prioridade as ContentPriority,
    status: data.status as ContentStatus,
    distribuicao: 'distribuicao' in data ? data.distribuicao as ContentDistribution : 'Instagram',
    impedimento: data.impedimento,
    created_at: data.created_at,
    updated_at: data.updated_at,
    created_by: data.created_by
  };

  return estrategiaItem;
}

/**
 * Prepara os dados antes de enviar para o Supabase
 */
export function prepareContentStrategyData(item: Partial<ContentStrategyItem>): Record<string, any> {
  // Processa equipamento_id - converte string vazia para null
  const equipamento_id = item.equipamento_id === '_none' || !item.equipamento_id ? null : item.equipamento_id;
  
  // Processa responsavel_id - converte string vazia para null
  const responsavel_id = item.responsavel_id === '_none' || !item.responsavel_id ? null : item.responsavel_id;
  
  return {
    equipamento_id: equipamento_id,
    categoria: item.categoria,
    formato: item.formato,
    responsavel_id: responsavel_id,
    previsao: item.previsao || null,
    conteudo: item.conteudo || null,
    objetivo: item.objetivo,
    prioridade: item.prioridade || 'Média',
    status: item.status || 'Planejado',
    distribuicao: item.distribuicao || 'Instagram',
    impedimento: item.impedimento || null,
  };
}
