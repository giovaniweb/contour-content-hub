
import { ScriptGenerationData, GeneratedContent } from '@/components/smart-script-generator/types';
import { getMentorName, getSuggestionsForType } from './utils';

export const generateMockContent = (data: ScriptGenerationData): GeneratedContent => {
  let mockContent = '';
  
  switch (data.contentType) {
    case 'bigIdea':
      mockContent = `1. ${data.theme}: A verdade que ninguém te conta
2. 3 erros fatais sobre ${data.theme.toLowerCase()} que estão sabotando seus resultados  
3. Por que ${data.theme.toLowerCase()} não funciona para 90% das pessoas
4. O método secreto dos profissionais para ${data.theme.toLowerCase()}
5. ${data.theme}: Antes vs Depois - transformação real em 30 dias`;
      break;
      
    case 'carousel':
      mockContent = `SLIDE 1 - CAPA:
${data.theme}
"A transformação que você precisa ver"

SLIDE 2 - PROBLEMA:
"Você já tentou de tudo e nada funcionou?"

SLIDE 3 - SOLUÇÃO:
"Descobri o método que realmente funciona"

SLIDE 4 - BENEFÍCIOS:
"Resultados reais em [tempo]"

SLIDE 5 - CTA:
"Quer saber como? Manda DM que eu explico!"`;
      break;
      
    case 'image':
      mockContent = `TÍTULO PRINCIPAL:
${data.theme}

SUBTÍTULO:
A solução definitiva que você estava procurando

TEXTO PRINCIPAL:
Descubra o método que já transformou milhares de vidas

CTA:
👆 Toque para mais informações
📩 Envie DM para saber mais

HASHTAGS:
#${data.theme.toLowerCase().replace(/\s+/g, '')} #resultados #transformacao #sucesso #dicas`;
      break;
      
    case 'video':
      mockContent = `🎬 Gancho:
"Se você ainda não conseguiu [resultado desejado], é porque ninguém te contou isso..."

🎯 Conflito:
"A maioria das pessoas tenta [método comum] e falha porque não sabem do segredo que vou revelar agora."

🔁 Virada:
"O verdadeiro segredo do ${data.theme.toLowerCase()} é [solução específica]. Quando descobri isso, tudo mudou."

📣 CTA:
"Manda DM que eu te explico o passo a passo completo!"`;
      break;
      
    case 'stories':
      mockContent = `STORIES 1:
"Você sabia que..."
[Gancho sobre o tema]

STORIES 2:
"Eu descobri que..."
[Revelação interessante]

STORIES 3:
"E o resultado foi..."
[Demonstração do benefício]

STORIES 4:
"Quer saber mais?"
[CTA para DM ou link]`;
      break;
      
    default:
      mockContent = `Conteúdo ${data.contentType} sobre ${data.theme} no estilo ${getMentorName(data.selectedMentor)}`;
  }
  
  return {
    type: data.contentType,
    content: mockContent,
    mentor: getMentorName(data.selectedMentor),
    suggestions: getSuggestionsForType(data.contentType)
  };
};
