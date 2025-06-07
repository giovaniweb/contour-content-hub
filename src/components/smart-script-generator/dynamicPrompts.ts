
import { ScriptIntention, MENTOR_PROFILES } from './intentionTree';

export class DynamicPromptGenerator {
  static generateMentorPrompt(intention: ScriptIntention): { systemPrompt: string; userPrompt: string } {
    const mentor = MENTOR_PROFILES[intention.mentor_inferido];
    const equipmentContext = intention.equipamento ? 
      `usando especificamente o equipamento ${intention.equipamento}` : 
      'usando nosso protocolo exclusivo da clínica';
    
    const clinicProfile = intention.perfil_clinico || 'clínica especializada em estética';
    
    const systemPrompt = `Você é ${mentor.name}, especialista em ${mentor.focus}.
Seu estilo de comunicação é: ${mentor.style}.

Contexto da clínica: ${clinicProfile}
Equipamento/protocolo: ${equipmentContext}
Tema central: ${intention.tema}
Canal de publicação: ${intention.canal}
Objetivo: ${intention.objetivo}

Crie um roteiro estruturado seguindo a metodologia:
🎬 Gancho (captura atenção nos primeiros 3 segundos)
🎯 Conflito (apresenta o problema/dor do público)
🔁 Virada (oferece a solução de forma convincente)
📣 CTA (call-to-action claro e persuasivo)

Adapte o tom e linguagem para ${intention.estilo_comunicacao}.
Se for ${intention.tipo_conteudo}, ajuste o formato adequadamente.`;

    const userPrompt = `Crie um roteiro para ${intention.tipo_conteudo} sobre: ${intention.tema}

Objetivo: ${intention.objetivo}
Canal: ${intention.canal}  
Estilo: ${intention.estilo_comunicacao}
${intention.equipamento ? `Equipamento: ${intention.equipamento}` : ''}
${intention.perfil_clinico ? `Perfil da clínica: ${intention.perfil_clinico}` : ''}

Mantenha o enigma do mentor no final: "${intention.enigma_mentor}"`;

    return { systemPrompt, userPrompt };
  }

  static generateDisneyPrompt(originalScript: string, intention: ScriptIntention): { systemPrompt: string; userPrompt: string } {
    const systemPrompt = `Você é Walt Disney em 1928, criando narrativas mágicas e emocionais.
Transform o roteiro usando a estrutura clássica Disney:

🏰 Era uma vez... (situação inicial que gera identificação)
⚡ Até que um dia... (conflito/problema que muda tudo)
✨ Então ela descobriu... (solução mágica/transformação)
🌟 E eles viveram felizes... (resultado final inspirador)

Adicione:
- Elemento Disney Único (metáfora mágica)
- Lição Universal (aprendizado inspirador)
- Assinatura Disney 1928 (frase motivacional final)

Mantenha o mesmo objetivo comercial, mas com alma emocional Disney.`;

    const userPrompt = `Roteiro original para transformar:
${originalScript}

Contexto:
- Tipo: ${intention.tipo_conteudo}
- Objetivo: ${intention.objetivo}
- Tema: ${intention.tema}
- Canal: ${intention.canal}

Transforme com a magia Disney 1928 mantendo o propósito comercial.`;

    return { systemPrompt, userPrompt };
  }

  static generateEquipmentSuggestions(equipmentName: string): string[] {
    const suggestions: Record<string, string[]> = {
      'hifu': ['Rejuvenescimento facial não invasivo', 'Lifting sem cirurgia', 'Firmeza da pele'],
      'laser': ['Remoção de manchas', 'Rejuvenescimento', 'Textura da pele'],
      'bioestimulador': ['Estímulo natural de colágeno', 'Rejuvenescimento gradual', 'Naturalidade'],
      'default': ['Protocolo exclusivo da clínica', 'Tratamento personalizado', 'Resultados comprovados']
    };

    const key = Object.keys(suggestions).find(k => 
      equipmentName.toLowerCase().includes(k)
    ) || 'default';

    return suggestions[key];
  }
}
