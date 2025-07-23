
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
      console.log('⚠️ [EquipmentFetcher] Nenhum equipamento fornecido para busca');
      return [];
    }

    console.log('🔍 [EquipmentFetcher] Iniciando busca de equipamentos:', equipmentNames);

    try {
      let allEquipments: EquipmentData[] = [];
      
      for (const equipmentName of equipmentNames) {
        if (!equipmentName || equipmentName.trim() === '') {
          console.log('⚠️ [EquipmentFetcher] Nome de equipamento vazio, pulando...');
          continue;
        }

        const cleanName = equipmentName.trim();
        console.log(`🔍 [EquipmentFetcher] Buscando: "${cleanName}"`);

        // Busca mais robusta - múltiplas tentativas
        const searchVariations = [
          cleanName,
          cleanName.toLowerCase(),
          cleanName.toUpperCase(),
          // Para casos como "Unyque PRO", buscar também "Unyque" 
          cleanName.split(' ')[0],
          // Remover caracteres especiais
          cleanName.replace(/[^\w\s]/gi, ''),
        ];

        for (const variation of searchVariations) {
          if (!variation || variation.length < 2) continue;

          console.log(`🔍 [EquipmentFetcher] Tentativa de busca: "${variation}"`);
          
          const { data: equipment, error: equipmentError } = await supabase
            .from('equipamentos')
            .select('id, nome, tecnologia, indicacoes, beneficios, diferenciais, categoria')
            .or(`nome.ilike.%${variation}%,tecnologia.ilike.%${variation}%`)
            .eq('ativo', true);

          if (equipmentError) {
            console.error(`❌ [EquipmentFetcher] Erro na busca para "${variation}":`, equipmentError);
            continue;
          }

          if (equipment && equipment.length > 0) {
            console.log(`✅ [EquipmentFetcher] Encontrado ${equipment.length} resultado(s) para "${variation}"`);
            equipment.forEach(eq => {
              console.log(`📋 [EquipmentFetcher] Encontrado: ${eq.nome} (${eq.tecnologia})`);
              // Evitar duplicatas
              if (!allEquipments.find(existing => existing.id === eq.id)) {
                allEquipments.push(eq);
              }
            });
            break; // Se encontrou com esta variação, não precisa testar outras
          }
        }
      }

      if (allEquipments.length === 0) {
        console.warn('⚠️ [EquipmentFetcher] NENHUM equipamento encontrado após todas as tentativas para:', equipmentNames);
        
        // Log adicional para debug - mostrar equipamentos disponíveis
        const { data: availableEquipments } = await supabase
          .from('equipamentos')
          .select('nome')
          .eq('ativo', true)
          .limit(10);
        
        console.log('📋 [EquipmentFetcher] Equipamentos disponíveis no banco (amostra):', 
          availableEquipments?.map(eq => eq.nome) || 'Nenhum');
        
        return [];
      }

      console.log(`✅ [EquipmentFetcher] SUCESSO: ${allEquipments.length} equipamento(s) encontrado(s)`);
      allEquipments.forEach(eq => {
        console.log(`📋 [EquipmentFetcher] FINAL: ${eq.nome} | Tecnologia: ${eq.tecnologia} | Indicações: ${eq.indicacoes?.substring(0, 100)}...`);
      });

      return allEquipments;
    } catch (fetchError) {
      console.error('❌ [EquipmentFetcher] Erro crítico na busca:', fetchError);
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
