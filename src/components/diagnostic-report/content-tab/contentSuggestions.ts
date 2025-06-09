
import { Instagram, Camera, Video } from "lucide-react";

export const generateContentSuggestions = (mainSpecialty: string) => [
  {
    type: "Post Instagram",
    title: `5 Benefícios de ${mainSpecialty}`,
    description: "Post educativo com carrossel explicando os principais benefícios",
    platform: "Instagram",
    format: "Carrossel",
    icon: Instagram,
    engagement: "Alto",
    content: `🌟 5 Benefícios Incríveis de ${mainSpecialty}

1️⃣ Melhora da autoestima e confiança
2️⃣ Resultados naturais e duradouros  
3️⃣ Procedimentos minimamente invasivos
4️⃣ Recuperação rápida e segura
5️⃣ Acompanhamento profissional especializado

✨ Agende sua consulta e descubra como podemos ajudar você!

#${mainSpecialty.toLowerCase()} #beleza #autoestima #saude`
  },
  {
    type: "Stories",
    title: "Antes e Depois - Transformações",
    description: "Stories mostrando resultados reais de pacientes",
    platform: "Instagram",
    format: "Stories",
    icon: Camera,
    engagement: "Muito Alto",
    content: `📸 Stories Antes e Depois

• Mostre transformações reais (com autorização)
• Use enquetes: "Qual resultado mais te impressiona?"
• Adicione depoimentos dos pacientes
• Termine com call-to-action para agendamento

🎥 Dica: Use música trending para maior alcance!`
  },
  {
    type: "Vídeo",
    title: "Explicando o Procedimento",
    description: "Vídeo educativo sobre como funciona o tratamento",
    platform: "YouTube/Instagram",
    format: "Vídeo curto",
    icon: Video,
    engagement: "Alto",
    content: `🎬 Roteiro: Explicando ${mainSpecialty}

Abertura (0-5s):
"Você tem dúvidas sobre [procedimento]? Vou explicar tudo!"

Desenvolvimento (5-45s):
• O que é o procedimento
• Como funciona
• Tempo de duração
• Cuidados pós-tratamento

Fechamento (45-60s):
• Benefícios principais
• Call-to-action para agendamento`
  }
];

export const contentIdeas = [
  "Dicas de cuidados pós-tratamento",
  "Mitos e verdades sobre o procedimento",
  "Depoimentos de pacientes satisfeitos",
  "Tour pela clínica e equipamentos",
  "Dicas de preparação pré-consulta",
  "Comparativo: diferentes tipos de tratamento"
];
