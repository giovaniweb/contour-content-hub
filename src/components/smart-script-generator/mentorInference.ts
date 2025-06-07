
import { ScriptIntention, INTENTION_TREE, MENTOR_ENIGMAS, MENTOR_PROFILES } from './intentionTree';

export class MentorInferenceEngine {
  static inferMentor(intention: Partial<ScriptIntention>): { mentor: string; enigma: string; confidence: number } {
    let bestMentor = 'pedro_sobral'; // default
    let bestConfidence = 0.3;

    // Aplicar regras de inferência do nó atual
    const currentNode = INTENTION_TREE.estilo;
    if (currentNode.inference_rules) {
      for (const rule of currentNode.inference_rules) {
        if (rule.condition(intention) && rule.confidence > bestConfidence) {
          bestMentor = rule.mentor;
          bestConfidence = rule.confidence;
        }
      }
    }

    // Regras adicionais baseadas em combinações complexas
    const complexRules = [
      {
        condition: () => 
          intention.tipo_conteudo === 'stories' && 
          intention.objetivo === 'engajamento' &&
          intention.estilo_comunicacao === 'humoristico',
        mentor: 'hyeser_souza',
        confidence: 0.95
      },
      {
        condition: () => 
          intention.objetivo === 'vendas' && 
          intention.canal?.includes('instagram') &&
          intention.estilo_comunicacao === 'direto',
        mentor: 'leandro_ladeira',
        confidence: 0.9
      },
      {
        condition: () => 
          intention.tipo_conteudo === 'carousel' && 
          intention.objetivo === 'ensinar',
        mentor: 'camila_porto',
        confidence: 0.85
      },
      {
        condition: () => 
          intention.tipo_conteudo === 'video' && 
          intention.estilo_comunicacao === 'criativo',
        mentor: 'paulo_cuenca',
        confidence: 0.88
      },
      {
        condition: () => 
          intention.objetivo === 'autoridade' && 
          intention.estilo_comunicacao === 'criativo',
        mentor: 'washington_olivetto',
        confidence: 0.82
      }
    ];

    // Aplicar regras complexas
    for (const rule of complexRules) {
      if (rule.condition() && rule.confidence > bestConfidence) {
        bestMentor = rule.mentor;
        bestConfidence = rule.confidence;
      }
    }

    return {
      mentor: bestMentor,
      enigma: MENTOR_ENIGMAS[bestMentor],
      confidence: bestConfidence
    };
  }

  static getMentorProfile(mentorKey: string) {
    return MENTOR_PROFILES[mentorKey] || MENTOR_PROFILES['pedro_sobral'];
  }
}
