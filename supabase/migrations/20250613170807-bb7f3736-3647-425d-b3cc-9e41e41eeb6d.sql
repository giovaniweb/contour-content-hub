
-- Adicionar campo técnicas à tabela mentores
ALTER TABLE mentores 
ADD COLUMN IF NOT EXISTS tecnicas JSONB DEFAULT '[]'::jsonb;

-- Inserir a técnica Stories 10x (Estendido) para Leandro Ladeira
UPDATE mentores 
SET tecnicas = jsonb_build_array(
  jsonb_build_object(
    'nome', 'Stories 10x (Estendido)',
    'formatos', jsonb_build_array('stories', 'ads_stories'),
    'prompt', '🎯 PROMPT: Criação de roteiro estilo Stories 10x com base na metodologia de Leandro Ladeira

Objetivo: Criar uma sequência de Stories que aumente engajamento, gere comunidade e potencialize compartilhamentos, seguindo os princípios explicados no episódio "Ep. 26 - A estratégia do Stories 10x".

🧠 Referência-base:
- Criado com Kátia Damasceno.
- Funciona mesmo sem aparecer (só com texto e storytelling).
- Sequência > Story solto. Crie narrativa.
- Use pelo menos 3 dispositivos de engajamento entre: curiosidade, reciprocidade, antecipação, enquetes, efeitos trailer, CTA visual.

⚙️ Instruções:
1. Tema: [TEMA_INSERIDO]
2. Tom: leve, conversado, sem linguagem de professor.
3. Estrutura:
- Story 1: Gancho + enquete ou pergunta
- Story 2: Contexto + história pessoal ou de cliente
- Story 3: Dilema ou ponto de virada (emoção ou surpresa)
- Story 4: Conclusão + CTA (comentário, emoji, compartilhar)
- Extra: Bônus, curiosidade ou promessa

💡 Exemplos de frases:
- "Você já passou por isso aqui?"
- "Se isso te ajudou, manda pra alguém."
- "Quer o resto? Me manda 🔥 que eu libero!"

🧪 Saída esperada:
Roteiro com até 5 Stories, numerados, com falas curtas, adaptadas para celular. Use interações (enquete, caixa de texto) e finalize com CTA que incentive ação social.

✍️ Exemplo de estrutura:
Story 1: "Você também trava quando liga a câmera? 😳 // [Enquete: Sim / MUITO]"
Story 2: "Eu travava tanto que apaguei um vídeo só porque gaguejei no início 😅"
Story 3: "Mas aí descobri um truque: finge que tá explicando pra um amigo, não pra ''internet''"
Story 4: "Se te ajudou, manda esse story pra quem vive falando ''não nasci pra câmera'' 🎥❤️"
Story 5: "Quer a parte 2? Me manda 🔥 que eu libero!"

FORMATO DE SAÍDA OBRIGATÓRIO:
{
  "roteiro": "Story 1: [Gancho + enquete/pergunta]\\n\\nStory 2: [Contexto + história pessoal]\\n\\nStory 3: [Dilema/virada emocional]\\n\\nStory 4: [Conclusão + CTA social]\\n\\nStory 5: [Bônus/antecipação]",
  "formato": "stories_10x_estendido",
  "metodologia": "leandro_ladeira_10x",
  "stories_total": 5,
  "tempo_estimado": "50s",
  "dispositivos_engajamento": ["curiosidade", "reciprocidade", "antecipacao", "enquete", "cta_visual"],
  "tom_narrativo": "conversacional_leve"
}',
    'condicoes_ativacao', jsonb_build_object(
      'formatos', jsonb_build_array('stories', 'ads_stories'),
      'objetivos', jsonb_build_array('atrair', 'conectar', 'engajar'),
      'prioridade', 1
    )
  )
)
WHERE nome = 'Leandro Ladeira';
