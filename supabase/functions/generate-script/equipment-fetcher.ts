
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
      // Buscar por nome exato ou usando ILIKE para ser case-insensitive
      let equipments = [];
      
      for (const equipmentName of equipmentNames) {
        const { data: equipment, error: equipmentError } = await supabase
          .from('equipamentos')
          .select('id, nome, tecnologia, indicacoes, beneficios, diferenciais, categoria')
          .or(`nome.eq.${equipmentName},nome.ilike.%${equipmentName}%`)
          .eq('ativo', true);
          
        if (equipment && equipment.length > 0) {
          equipments.push(...equipment);
        }
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
🚨 REGRA CRÍTICA DE EQUIPAMENTOS:
- NENHUM equipamento válido encontrado no banco de dados
- NÃO mencione equipamentos específicos que não existem
- NÃO invente informações sobre equipamentos
- Use termos genéricos como "nossos tratamentos" ou "tecnologias avançadas"
- NUNCA associe características de um equipamento a outro
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
- OBRIGATÓRIO: Mencione APENAS os equipamentos listados: ${equipmentNames}
- Use EXATAMENTE os nomes e tecnologias fornecidas
- NÃO invente características que não estão listadas
- NÃO misture informações de equipamentos diferentes
- NÃO mencione "canetas emagrecedoras" se não estiver nas especificações

📋 EQUIPAMENTOS DISPONÍVEIS:
${equipmentList}

⚠️ VALIDAÇÃO CRÍTICA: 
- Use APENAS as informações fornecidas acima
- NÃO adicione equipamentos ou tecnologias não listadas
- NÃO associe características de outros equipamentos
    `;
  }
}
