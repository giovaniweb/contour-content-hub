
export interface EquipmentData {
  id: string;
  nome: string;
  tecnologia: string;
  indicacoes: string;
  beneficios: string;
  diferenciais: string;
  categoria: string;
}

export class EquipmentFetcher {
  static async fetchEquipmentDetails(supabase: any, equipmentNames: string[]): Promise<EquipmentData[]> {
    if (!equipmentNames || equipmentNames.length === 0) {
      return [];
    }

    console.log('🔍 [EquipmentFetcher] Buscando equipamentos:', equipmentNames);

    try {
      const { data: equipments, error } = await supabase
        .from('equipamentos')
        .select('id, nome, tecnologia, indicacoes, beneficios, diferenciais, categoria')
        .in('nome', equipmentNames)
        .eq('ativo', true);

      if (error) {
        console.error('❌ [EquipmentFetcher] Erro ao buscar equipamentos:', error);
        return [];
      }

      if (!equipments || equipments.length === 0) {
        console.warn('⚠️ [EquipmentFetcher] Nenhum equipamento encontrado para:', equipmentNames);
        return [];
      }

      console.log('✅ [EquipmentFetcher] Equipamentos encontrados:', equipments.length);
      equipments.forEach(eq => {
        console.log(`📋 [EquipmentFetcher] ${eq.nome}: ${eq.tecnologia}`);
      });

      return equipments;
    } catch (fetchError) {
      console.error('❌ [EquipmentFetcher] Erro crítico:', fetchError);
      return [];
    }
  }

  static buildEquipmentPromptSection(equipments: EquipmentData[]): string {
    if (equipments.length === 0) {
      return `
🚨 REGRA DE EQUIPAMENTOS:
- NENHUM equipamento específico selecionado
- NÃO mencione equipamentos específicos
- Use termos genéricos como "nossos tratamentos"
      `;
    }

    const equipmentList = equipments.map(eq => `
📋 ${eq.nome}:
- Tecnologia: ${eq.tecnologia}
- Indicações: ${eq.indicacoes}
- Benefícios: ${eq.beneficios}
- Diferenciais: ${eq.diferenciais}
    `).join('\n');

    const equipmentNames = equipments.map(eq => eq.nome).join(', ');

    return `
🚨 REGRA CRÍTICA DE EQUIPAMENTOS:
- OBRIGATÓRIO: Mencione TODOS os equipamentos listados: ${equipmentNames}
- Use os nomes EXATOS dos equipamentos (nomes reais)
- Integre as tecnologias e benefícios específicos
- NUNCA substitua por outros equipamentos
- NUNCA use termos genéricos se equipamentos específicos foram selecionados

📋 EQUIPAMENTOS DISPONÍVEIS:
${equipmentList}

⚠️ VALIDAÇÃO: Se você não mencionar os equipamentos listados, o roteiro será rejeitado.
    `;
  }
}
