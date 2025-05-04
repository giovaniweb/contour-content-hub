
import { ContentStrategyItem, ContentCategory, ContentFormat, ContentObjective, ContentStatus, ContentDistribution } from "@/types/content-strategy";

/**
 * Transforma os dados brutos do Supabase em um objeto ContentStrategyItem tipado
 */
export function transformToContentStrategyItem(data: any): ContentStrategyItem {
  // Checagem de segurança para garantir que distribuicao exista
  const distribuicao = data.distribuicao ? 
    data.distribuicao as ContentDistribution : 
    'Instagram';

  const estrategiaItem: ContentStrategyItem = {
    id: data.id,
    equipamento_id: data.equipamento_id,
    equipamento_nome: data.equipamento?.nome || null,
    categoria: data.categoria as ContentCategory,
    formato: data.formato as ContentFormat,
    responsavel_id: data.responsavel_id,
    responsavel_nome: data.responsavel?.nome || null,
    previsao: data.previsao,
    conteudo: data.conteudo,
    objetivo: data.objetivo as ContentObjective,
    status: data.status as ContentStatus,
    distribuicao: distribuicao,
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
  
  // Garantir que os campos obrigatórios estejam presentes
  return {
    categoria: item.categoria || 'vendas',
    formato: item.formato || 'story',
    objetivo: item.objetivo || '🟡 Atrair Atenção',
    equipamento_id: equipamento_id,
    responsavel_id: responsavel_id,
    previsao: item.previsao || null,
    conteudo: item.conteudo || null,
    status: item.status || 'Planejado',
    distribuicao: item.distribuicao || 'Instagram'
  };
}
