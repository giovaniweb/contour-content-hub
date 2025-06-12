import { useState } from 'react';
import { toast } from 'sonner';
import { getElementosUniversaisByMentor, getEspecialidadesByMentor } from '@/utils/cadastrarMentores';

interface FluidaScriptData {
  tipo_conteudo: string;
  objetivo: string;
  canal: string;
  estilo: string;
  equipamento: string;
  tema: string;
}

export const useFluidaScript = () => {
  const [results, setResults] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateScript = async (data: FluidaScriptData) => {
    console.log('🚀 [useFluidaScript] Iniciando geração de roteiro com 10 elementos universais');
    setIsGenerating(true);
    
    try {
      // Inferir mentor baseado no estilo
      const mentorInferido = inferirMentor(data);
      const elementosUniversais = getElementosUniversaisByMentor(mentorInferido);
      const especialidades = getEspecialidadesByMentor(mentorInferido);

      console.log('🧠 [useFluidaScript] Mentor inferido:', mentorInferido);
      console.log('📊 [useFluidaScript] Elementos universais:', elementosUniversais);

      const systemPrompt = `
        Você é o FLUIDAROTEIRISTA — roteirista oficial da plataforma para clínicas estéticas e médicas.
        
        🎯 ESTRUTURA UNIVERSAL DOS 10 ELEMENTOS (Método Leandro Ladeira adaptado):
        
        ${buildElementosPrompt(elementosUniversais, mentorInferido, especialidades)}
        
        Contexto da clínica:
        - Tipo: estetico
        - Especialidade: 
        - Equipamentos: ${data.equipamento}
        - Protocolo mais vendido: 
        - Ticket médio: 
        - Público ideal: 
        - Estilo da clínica: 
        - Mentor: ${mentorInferido}
        
        ESTRUTURA OBRIGATÓRIA:
        1. Gancho (Headlines + Gatilhos Mentais)
        2. Conflito (Mapas de Empatia + Conhecimento do Público)
        3. Virada (Lógica Argumentativa + Premissas Educativas)
        4. CTA (Copywriting + Ferramentas Específicas)
        
        FORMATO: ${data.tipo_conteudo}
        
        Retorne APENAS JSON válido:
        {
          "roteiro": "Conteúdo do roteiro estruturado aplicando os 10 elementos",
          "formato": "carrossel/stories/imagem/video",
          "emocao_central": "esperança/confiança/urgência/etc",
          "intencao": "atrair/vender/educar/conectar",
          "objetivo": "Objetivo específico do post",
          "mentor": "${mentorInferido}",
          "elementos_aplicados": ${JSON.stringify(elementosUniversais)},
          "especialidades_aplicadas": ${JSON.stringify(especialidades)}
        }
      `;

      const userPrompt = `
        Tema: ${data.tema}
        Tipo de conteúdo: ${data.tipo_conteudo}
        Objetivo: ${data.objetivo}
        Canal: ${data.canal}
        Estilo: ${data.estilo}
        
        Crie um roteiro seguindo o modelo FLUIDAROTEIRISTA com os 10 elementos universais aplicados 
        conforme a intensidade específica do mentor ${mentorInferido}. Use as especialidades 
        ${especialidades.join(', ')} para dar personalidade única ao roteiro.
      `;

      const requestBody = {
        request: {
          type: 'custom',
          systemPrompt,
          userPrompt,
          topic: data.tema,
          additionalInfo: JSON.stringify({
            tipo_de_clinica: 'estetico',
            especialidade: '',
            equipamentos: data.equipamento,
            protocolo: '',
            ticket_medio: '',
            publico_ideal: '',
            estilo_clinica: '',
            estilo_linguagem: '',
            mentor_nome: mentorInferido,
            elementos_universais: elementosUniversais,
            especialidades: especialidades
          }),
          tone: data.estilo,
          marketingObjective: data.objetivo
        }
      };

      console.log('📤 [useFluidaScript] Enviando request:', requestBody);

      const response = await fetch('/api/generate-script', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('supabase.auth.token')}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ [useFluidaScript] Erro na resposta:', response.status, errorText);
        throw new Error(`Erro na API: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ [useFluidaScript] Resultado recebido:', result);

      // Tentar fazer parse do conteúdo se for JSON
      let scriptData = result;
      if (result.content) {
        try {
          const parsedContent = JSON.parse(result.content);
          scriptData = { ...result, ...parsedContent };
          console.log('🔄 [useFluidaScript] Conteúdo JSON parseado:', scriptData);
        } catch (parseError) {
          console.log('ℹ️ [useFluidaScript] Conteúdo não é JSON, usando como texto');
          scriptData = {
            ...result,
            roteiro: result.content,
            formato: data.tipo_conteudo,
            emocao_central: 'criatividade',
            intencao: data.objetivo,
            objetivo: data.tema,
            mentor: mentorInferido,
            elementos_aplicados: elementosUniversais,
            especialidades_aplicadas: especialidades
          };
        }
      }

      // Garantir que temos os campos necessários
      if (!scriptData.roteiro && !scriptData.content) {
        console.error('❌ [useFluidaScript] Roteiro vazio');
        throw new Error('Roteiro gerado está vazio');
      }

      // Adicionar elementos universais ao resultado
      scriptData.elementos_aplicados = scriptData.elementos_aplicados || elementosUniversais;
      scriptData.mentor = scriptData.mentor || mentorInferido;
      scriptData.especialidades_aplicadas = scriptData.especialidades_aplicadas || especialidades;

      setResults([scriptData]);
      console.log('✅ [useFluidaScript] Roteiro salvo nos resultados com elementos universais');
      
      toast.success('✨ Roteiro gerado com sucesso!', {
        description: `Seu roteiro FLUIDA está pronto com os 10 elementos universais aplicados pelo mentor ${mentorInferido}.`
      });

      return scriptData;

    } catch (error) {
      console.error('🔥 [useFluidaScript] Erro ao gerar roteiro:', error);
      
      toast.error('❌ Erro ao gerar roteiro', {
        description: error instanceof Error ? error.message : 'Erro desconhecido'
      });
      
      throw error;
    } finally {
      setIsGenerating(false);
      console.log('🏁 [useFluidaScript] Geração finalizada');
    }
  };

  const inferirMentor = (data: FluidaScriptData): string => {
    // Lógica de inferência baseada no estilo e objetivo
    if (data.estilo === 'direto' && data.objetivo.includes('vend')) {
      return 'Leandro Ladeira';
    }
    if (data.estilo === 'emocional' || data.objetivo.includes('conexão')) {
      return 'Ícaro de Carvalho';
    }
    if (data.estilo === 'criativo' || data.tipo_conteudo === 'video') {
      return 'Paulo Cuenca';
    }
    if (data.estilo === 'didatico' || data.objetivo.includes('educar')) {
      return 'Camila Porto';
    }
    if (data.estilo === 'humoristico' || data.canal.includes('stories')) {
      return 'Hyeser Souza';
    }
    if (data.estilo === 'publicitario' || data.objetivo.includes('branding')) {
      return 'Washington Olivetto';
    }
    
    // Default
    return 'Pedro Sobral';
  };

  const buildElementosPrompt = (elementos: any, mentor: string, especialidades: string[]): string => {
    if (!elementos) return '';

    return `
1. STORYTELLING (Intensidade: ${elementos.storytelling}/10)
   ${elementos.storytelling >= 8 ? '- Narrativas envolventes e emocionais' : elementos.storytelling >= 6 ? '- Histórias simples e diretas' : '- Elementos narrativos sutis'}

2. COPYWRITING (Intensidade: ${elementos.copywriting}/10)
   ${elementos.copywriting >= 8 ? '- Textos persuasivos e impactantes' : elementos.copywriting >= 6 ? '- Copy clara e objetiva' : '- Linguagem simples e acessível'}

3. CONHECIMENTO DO PÚBLICO-ALVO (Intensidade: ${elementos.conhecimento_publico}/10)
   ${elementos.conhecimento_publico >= 8 ? '- Segmentação precisa e personalizada' : elementos.conhecimento_publico >= 6 ? '- Perfil básico definido' : '- Público geral'}

4. ANÁLISES E DADOS (Intensidade: ${elementos.analises_dados}/10)
   ${elementos.analises_dados >= 8 ? '- Métricas detalhadas e otimização' : elementos.analises_dados >= 6 ? '- Dados básicos de performance' : '- Foco na criatividade'}

5. GATILHOS MENTAIS (Intensidade: ${elementos.gatilhos_mentais}/10)
   ${elementos.gatilhos_mentais >= 8 ? '- Escassez, urgência, prova social' : elementos.gatilhos_mentais >= 6 ? '- Gatilhos sutis' : '- Persuasão natural'}

6. LÓGICA ARGUMENTATIVA (Intensidade: ${elementos.logica_argumentativa}/10)
   ${elementos.logica_argumentativa >= 8 ? '- Argumentos estruturados e convincentes' : elementos.logica_argumentativa >= 6 ? '- Razões claras' : '- Abordagem emocional'}

7. PREMISSAS EDUCATIVAS (Intensidade: ${elementos.premissas_educativas}/10)
   ${elementos.premissas_educativas >= 8 ? '- Educação antes da oferta' : elementos.premissas_educativas >= 6 ? '- Informações básicas' : '- Foco na ação'}

8. MAPAS DE EMPATIA (Intensidade: ${elementos.mapas_empatia}/10)
   ${elementos.mapas_empatia >= 8 ? '- Perspectiva profunda do cliente' : elementos.mapas_empatia >= 6 ? '- Compreensão básica' : '- Abordagem direta'}

9. HEADLINES (Intensidade: ${elementos.headlines}/10)
   ${elementos.headlines >= 8 ? '- Títulos magnéticos e irresistíveis' : elementos.headlines >= 6 ? '- Títulos claros e atrativos' : '- Títulos simples'}

10. FERRAMENTAS ESPECÍFICAS (Intensidade: ${elementos.ferramentas_especificas}/10)
    ${elementos.ferramentas_especificas >= 8 ? '- CTAs, funis, vídeos de venda' : elementos.ferramentas_especificas >= 6 ? '- CTAs básicos' : '- Chamadas simples'}

🎨 ESPECIALIDADES DO MENTOR ${mentor}: ${especialidades.join(', ')}
    `;
  };

  const applyDisneyMagic = async (script: any) => {
    console.log('✨ [useFluidaScript] Aplicando Disney Magic com elementos universais');
    const disneyScript = {
      ...script,
      roteiro: script.roteiro.replace(/tratamento/g, 'jornada de transformação')
        .replace(/procedimento/g, 'ritual de beleza')
        .replace(/resultado/g, 'metamorfose')
        .replace(/cliente/g, 'pessoa especial'),
      emocao_central: 'encantamento',
      mentor: 'Fluida Encantadora',
      elementos_aplicados: {
        ...script.elementos_aplicados,
        storytelling: 10,
        mapas_empatia: 10,
        headlines: 10
      }
    };
    
    setResults([disneyScript]);
    toast.success('🏰 Disney Magic aplicada!', {
      description: 'Seu roteiro agora tem a magia Disney com elementos universais potencializados.'
    });
  };

  const clearResults = () => {
    console.log('🗑️ [useFluidaScript] Limpando resultados');
    setResults([]);
  };

  const generateImage = async (script: any) => {
    console.log('🖼️ [useFluidaScript] Gerando imagem para script');
    toast.info('🖼️ Geração de imagem', {
      description: 'Funcionalidade em desenvolvimento.'
    });
  };

  const generateAudio = async (script: any) => {
    console.log('🎙️ [useFluidaScript] Gerando áudio para script');
    toast.info('🎙️ Geração de áudio', {
      description: 'Funcionalidade em desenvolvimento.'
    });
  };

  return {
    results,
    isGenerating,
    generateScript,
    applyDisneyMagic,
    clearResults,
    generateImage,
    generateAudio
  };
};
