
-- First, add unique constraint to the nome column
ALTER TABLE mentores ADD CONSTRAINT mentores_nome_unique UNIQUE (nome);

-- Now we can safely use ON CONFLICT with the nome column
-- Update Leandro Ladeira techniques
UPDATE mentores 
SET tecnicas = jsonb_build_array(
  -- Stories 10x (Estendido)
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
  ),
  -- Light Copy
  jsonb_build_object(
    'nome', 'Light Copy',
    'formatos', jsonb_build_array('reels', 'ads_video', 'ads_static', 'post_static'),
    'prompt', '🎯 PROMPT: Light Copy - Linguagem leve e natural para vender sem parecer venda

Objetivo: Linguagem acessível, natural e conversada, que apresenta uma oferta ou ideia sem parecer forçado. Ideal para vídeos, posts e criativos pagos que querem vender com suavidade.

🧠 Referência-base:
- Comunicação que parece um conselho, não uma venda.
- Evita jargões técnicos, exageros e "linguagem de lançamento".
- Utiliza analogias, exemplos cotidianos e tom de conversa com amigo.
- Foco na *experiência real*, não no argumento técnico.

⚙️ Instruções:
1. Tema: [TEMA_INSERIDO]
2. Estrutura:
- Gancho leve com identificação ou humor
- Problema apresentado como algo comum
- Solução explicada de forma simples (como um "jeitinho" ou "atalho")
- Oferta ou CTA apresentado naturalmente ("Se quiser, posso te mostrar como faço")

💡 Estilo sugerido:
- Frases curtas, diretas
- Uso de emojis (moderado) e expressões reais: "Já passou por isso?", "Saca só isso..."
- Tom: amigo, parceiro, não professor

🧪 Exemplo:
"Tem gente que acha que só dá certo no Insta se aparecer dançando.  
Nada contra, mas eu prefiro isso aqui ó 👇  
[mostra estratégia leve de copy]  
Se quiser um modelo igual, te mando. É só comentar ''me ensina'' que eu separo aqui nos favoritos."

FORMATO DE SAÍDA:
{
  "roteiro": "[Roteiro completo com linguagem natural e conversada]",
  "formato": "[formato_solicitado]",
  "tom": "amigavel_natural",
  "tecnica": "light_copy",
  "mentor": "leandro_ladeira"
}',
    'condicoes_ativacao', jsonb_build_object(
      'formatos', jsonb_build_array('reels', 'ads_video', 'ads_static', 'post_static'),
      'objetivos', jsonb_build_array('vender', 'atrair', 'converter'),
      'prioridade', 2
    )
  ),
  -- CPL Express
  jsonb_build_object(
    'nome', 'CPL Express',
    'formatos', jsonb_build_array('video_youtube', 'ads_video', 'reels_long'),
    'prompt', '🎯 PROMPT: CPL Express - Vídeo direto com Conteúdo, Prova e Oferta

Objetivo: Criar um vídeo com alta taxa de conversão usando a estrutura CPL (Conteúdo, Prova, Oferta), de forma enxuta e direta. Ideal para YouTube, anúncios em vídeo ou conteúdos com CTA no final.

🧠 Referência-base:
- Entrega real de valor no início (aula prática).
- Usa prova social para gerar confiança (caso, depoimento, dado).
- Finaliza com uma oferta clara, simples, sem exageros.

⚙️ Estrutura do Roteiro:
1. Abertura com Conteúdo Prático sobre [TEMA_INSERIDO]
2. Prova (resultado, print, história de aluno ou número real)
3. Oferta (solução direta, benefício claro)
4. CTA leve (convite simples para clicar, comentar ou entrar em contato)

💡 Dicas de linguagem:
- Evite empolgação forçada. Fale como especialista que quer ajudar.
- Use termos como "isso aqui é o que eu uso com meus clientes" ou "olha esse caso".

🧪 Exemplo:
Bloco 1 – Conteúdo:  
"Se você trabalha com estética e ainda não usa script de WhatsApp para venda, anota esse aqui…"

Bloco 2 – Prova:  
"Uma cliente minha aumentou as conversões em 23% só ajustando isso."

Bloco 3 – Oferta:  
"Eu criei um modelo pronto com esse script e mais 3 bônus que você pode aplicar hoje."

Bloco 4 – CTA:  
"Se quiser, comenta ''quero'' aqui que eu te mando no inbox."

FORMATO DE SAÍDA:
{
  "roteiro": "Bloco 1 - Conteúdo: [conteúdo prático]\\n\\nBloco 2 - Prova: [evidência social]\\n\\nBloco 3 - Oferta: [solução clara]\\n\\nBloco 4 - CTA: [convite simples]",
  "formato": "[formato_solicitado]",
  "estrutura": "cpl_express",
  "tempo_estimado": "45-90s",
  "mentor": "leandro_ladeira"
}',
    'condicoes_ativacao', jsonb_build_object(
      'formatos', jsonb_build_array('video_youtube', 'ads_video', 'reels_long'),
      'objetivos', jsonb_build_array('converter', 'vender', 'educar'),
      'prioridade', 2
    )
  )
)
WHERE nome = 'Leandro Ladeira';

-- Insert new mentors with techniques
INSERT INTO mentores (nome, descricao, estilo, uso_ideal, tom, exemplos, tecnicas)
VALUES 
  -- Pedro Sobral
  ('Pedro Sobral', 'Especialista em copy persuasivo e conversão direta. Conhecido por estruturas simples e eficazes que geram resultados imediatos.', 'Direto, persuasivo, sem enrolação', 'Ideal para conteúdos de conversão, vendas diretas e CTAs fortes', 'Assertivo, convincente, objetivo', ARRAY['Gancho forte', 'Conflito claro', 'Solução simples', 'CTA direto'], jsonb_build_array(jsonb_build_object('nome', 'Copy do Sobral', 'formatos', jsonb_build_array('reels', 'ads_video', 'carrossel', 'post_static'), 'prompt', '🎯 PROMPT: Copy curta para conversão estilo Pedro Sobral

Objetivo: Criar um roteiro ou post com linguagem persuasiva e direta, baseado na estrutura clássica de Sobral: Gancho → Conflito → Solução → CTA.

🧠 Referência-base:
- Ganchos fortes no início (pergunta, quebra, comparação)
- Conflito ou dor real do público-alvo
- Solução clara, com benefício visível
- CTA simples, emocional ou direto

⚙️ Estrutura sugerida:
1. Gancho – capte atenção em até 5 palavras sobre [TEMA_INSERIDO]
2. Conflito – mostre o problema que trava o público
3. Solução – traga a virada simples e possível
4. CTA – convide para ação imediata (sem enrolar)

FORMATO DE SAÍDA:
{
  "roteiro": "[Roteiro seguindo estrutura Gancho-Conflito-Solução-CTA]",
  "formato": "[formato_solicitado]",
  "estrutura": "gancho_conflito_solucao_cta",
  "tom": "direto_persuasivo",
  "mentor": "pedro_sobral"
}', 'condicoes_ativacao', jsonb_build_object('formatos', jsonb_build_array('reels', 'ads_video', 'carrossel', 'post_static'), 'objetivos', jsonb_build_array('converter', 'vender', 'atrair'), 'prioridade', 1)))),
  -- Camila Porto
  ('Camila Porto', 'Especialista em funis de conteúdo e estratégia de engajamento. Conhecida por estruturar conteúdos que guiam o público da descoberta à ação.', 'Estratégico, educativo, envolvente', 'Ideal para sequências de conteúdo, nutrição de audiência e funis educativos', 'Didático, acolhedor, estratégico', ARRAY['Funil TOFU-MOFU-BOFU', 'Conteúdo educativo', 'Engajamento estratégico'], jsonb_build_array(jsonb_build_object('nome', 'Funil do Porto', 'formatos', jsonb_build_array('post_static', 'reels', 'stories', 'carrossel'), 'prompt', '🎯 PROMPT: Criação de conteúdo estratégico baseado no Funil de Conteúdo

Objetivo: Criar um roteiro ou sequência de postagens que guiem o público do conhecimento até a ação, com base no modelo TOFU (topo), MOFU (meio) e BOFU (fundo) usado por Camila Porto.

🧠 Referência-base:
- TOFU (Topo do Funil): conteúdo inspirador, educativo, curioso
- MOFU (Meio do Funil): resolução de dores, dicas práticas, bastidores
- BOFU (Fundo do Funil): CTA, convite, oferta ou ação de engajamento

⚙️ Estrutura:
1. TOFU – Gancho leve ou dica inesperada sobre [TEMA_INSERIDO]
2. MOFU – Explicação prática ou experiência real
3. BOFU – Convite para ação direta

FORMATO DE SAÍDA:
{
  "roteiro": "TOFU: [Gancho educativo/curioso]\\n\\nMOFU: [Desenvolvimento prático]\\n\\nBOFU: [CTA direto]",
  "formato": "[formato_solicitado]",
  "estrutura": "tofu_mofu_bofu",
  "tom": "educativo_estrategico",
  "mentor": "camila_porto"
}', 'condicoes_ativacao', jsonb_build_object('formatos', jsonb_build_array('post_static', 'reels', 'stories', 'carrossel'), 'objetivos', jsonb_build_array('educar', 'engajar', 'nutrir'), 'prioridade', 1)))),
  -- Paulo Cuenca
  ('Paulo Cuenca', 'Mestre em storytelling e narrativas envolventes. Especialista em técnicas cinematográficas aplicadas ao marketing de conteúdo.', 'Narrativo, cinematográfico, envolvente', 'Ideal para conteúdos longos, vídeos e histórias que prendem atenção', 'Dramático, envolvente, emocional', ARRAY['In Medias Res', 'Storytelling cinematográfico', 'Narrativa envolvente'], jsonb_build_array(jsonb_build_object('nome', 'In Medias Res (Começar pelo Clímax)', 'formatos', jsonb_build_array('video_youtube', 'reels', 'shorts', 'tiktok'), 'prompt', '🎯 PROMPT: Storytelling estilo Paulo Cuenca com técnica In Medias Res

Objetivo: Criar um roteiro que começa diretamente no momento mais tenso, inusitado ou curioso da história, para prender a atenção e depois revelar o contexto.

⚙️ Estrutura:
1. Clímax – "Eu nunca pensei que isso fosse acontecer..."
2. Volta ao início – "Mas antes de chegar aqui, deixa eu te contar como tudo começou"
3. Desenvolvimento – obstáculos, descobertas, contexto emocional
4. Conclusão – aprendizado ou mudança, com CTA sutil

FORMATO DE SAÍDA:
{
  "roteiro": "Clímax: [Momento máximo de tensão]\\n\\nRecuo: [Como chegou até ali]\\n\\nDesenvolvimento: [Contexto e obstáculos]\\n\\nConclusão: [Aprendizado e CTA]",
  "formato": "[formato_solicitado]",
  "estrutura": "in_medias_res",
  "tom": "narrativo_envolvente",
  "mentor": "paulo_cuenca"
}', 'condicoes_ativacao', jsonb_build_object('formatos', jsonb_build_array('video_youtube', 'reels', 'shorts', 'tiktok'), 'objetivos', jsonb_build_array('engajar', 'conectar', 'inspirar'), 'prioridade', 1)))),
  -- Ícaro de Carvalho
  ('Ícaro de Carvalho', 'Especialista em conteúdo autoral e construção de marca pessoal através de vulnerabilidade estratégica e bastidores.', 'Íntimo, autêntico, vulnerável', 'Ideal para construção de marca pessoal, conexão emocional e autoridade', 'Sincero, próximo, reflexivo', ARRAY['Bastidores estratégicos', 'Vulnerabilidade autêntica', 'Marca pessoal'], jsonb_build_array(jsonb_build_object('nome', 'Storytelling de Bastidor', 'formatos', jsonb_build_array('reels', 'video_youtube', 'stories', 'post_static'), 'prompt', '🎯 PROMPT: Roteiro com bastidores estratégicos no estilo Ícaro de Carvalho

Objetivo: Criar um conteúdo que mostre os bastidores reais de uma decisão, erro, aprendizado ou processo relacionado ao [TEMA_INSERIDO].

⚙️ Estrutura:
1. Abertura sincera – "Deixa eu te contar uma coisa que quase ninguém fala..."
2. Bastidor – detalhe de decisão, processo ou erro real
3. Reforço de valor – por que isso é importante e o que você aprendeu
4. CTA emocional ou reflexão – "Você já passou por isso?"

FORMATO DE SAÍDA:
{
  "roteiro": "[Roteiro íntimo e vulnerável sobre bastidores]",
  "formato": "[formato_solicitado]",
  "estrutura": "bastidor_vulneravel",
  "tom": "intimo_autoral",
  "mentor": "icaro_de_carvalho"
}', 'condicoes_ativacao', jsonb_build_object('formatos', jsonb_build_array('reels', 'video_youtube', 'stories', 'post_static'), 'objetivos', jsonb_build_array('conectar', 'inspirar', 'construir_marca'), 'prioridade', 1)))),
  -- Hyeser Souza
  ('Hyeser Souza', 'Especialista em conteúdo viral e impacto visual. Conhecido por criar vídeos com alta retenção e engajamento através de técnicas de edição e ganchos visuais.', 'Impactante, visual, dinâmico', 'Ideal para conteúdos virais, vídeos curtos e alto engajamento', 'Energético, impactante, direto', ARRAY['Ganchos visuais', 'Microganchos', 'Efeito WOW', 'Retenção alta'], jsonb_build_array(jsonb_build_object('nome', 'Efeito WOW (Impacto Imediato)', 'formatos', jsonb_build_array('tiktok', 'reels', 'shorts', 'ads_video'), 'prompt', '🎯 PROMPT: Roteiro de impacto rápido com estilo Hyeser Souza

Objetivo: Criar um vídeo com impacto nos primeiros 2 segundos, utilizando ganchos visuais, cortes rápidos e texto em tela sobre [TEMA_INSERIDO].

⚙️ Estrutura:
1. Impacto imediato – frase de efeito, som alto ou cena incomum
2. Gancho – dúvida ou quebra de expectativa
3. Informação chave – dica, alerta ou transformação em poucas palavras
4. Encerramento – CTA visual ou promessa

FORMATO DE SAÍDA:
{
  "roteiro": "[Impacto]: [Frase de efeito]\\n[Gancho]: [Quebra de expectativa]\\n[Info-chave]: [Dica/transformação]\\n[CTA]: [Convite visual]",
  "formato": "[formato_solicitado]",
  "estrutura": "impacto_gancho_info_cta",
  "tom": "impactante_visual",
  "elementos_visuais": ["texto_em_tela", "cortes_rapidos", "efeitos_sonoros"],
  "mentor": "hyeser_souza"
}', 'condicoes_ativacao', jsonb_build_object('formatos', jsonb_build_array('tiktok', 'reels', 'shorts', 'ads_video'), 'objetivos', jsonb_build_array('viral', 'engajar', 'impactar'), 'prioridade', 1))))
ON CONFLICT (nome) DO UPDATE SET 
  tecnicas = EXCLUDED.tecnicas,
  updated_at = now();
