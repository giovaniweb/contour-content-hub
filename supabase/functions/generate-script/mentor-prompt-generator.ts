/**
 * MENTOR-BASED CREATIVE PROMPT GENERATOR
 * Gera prompts específicos baseados na personalidade e metodologia de cada mentor
 */

interface MentorProfile {
  name: string;
  personality: string;
  methodology: string;
  tone: string;
  specialties: string[];
  scriptStructure: string;
  creativeApproach: string;
  callToActionStyle: string;
  scientificIntegration: string;
}

export class MentorPromptGenerator {
  private static mentorProfiles: Map<string, MentorProfile> = new Map([
    ['Hyeser Souza', {
      name: 'Hyeser Souza',
      personality: 'Criativa, viral, autêntica e conectada com tendências',
      methodology: 'Fórmula VIRAL: Velocidade + Impacto + Relevância + Analogias + Linguagem natural',
      tone: 'Descontraído, próximo, com gírias atuais e linguagem de "melhor amiga"',
      specialties: ['Conteúdo viral', 'Storytelling autêntico', 'Engajamento jovem', 'Tendências digitais'],
      scriptStructure: 'Gancho impactante (3s) → Problema relatable → Solução surpreendente → CTA irresistível',
      creativeApproach: 'Usa analogias inusitadas, referências da cultura pop, humor inteligente e reversals inesperados',
      callToActionStyle: 'Urgente mas amigável, cria FOMO saudável, usa linguagem direta tipo "bora que bora"',
      scientificIntegration: 'Transforma dados científicos em histórias envolventes e fáceis de entender'
    }],
    
    ['Leandro Ladeira', {
      name: 'Leandro Ladeira',
      personality: 'Estratégico, persuasivo, focado em conversão',
      methodology: 'Copywriting científico com gatilhos mentais e psicologia comportamental',
      tone: 'Profissional mas acessível, confiante, usa autoridade sem ser arrogante',
      specialties: ['Copywriting de conversão', 'Gatilhos mentais', 'Persuasão ética', 'ROI em conteúdo'],
      scriptStructure: 'Headline magnética → Problema urgente → Agitação → Solução única → Prova social → CTA forte',
      creativeApproach: 'Combina dados com emoção, usa escassez e urgência, foca em benefícios transformadores',
      callToActionStyle: 'Direto ao ponto, cria senso de urgência real, oferece valor irrecusável',
      scientificIntegration: 'Usa evidências científicas como prova social e autoridade para aumentar credibilidade'
    }],
    
    ['Paulo Cuenca', {
      name: 'Paulo Cuenca',
      personality: 'Visionário, cinematográfico, focado em narrativa visual',
      methodology: 'Storytelling visual cinematográfico com estrutura de roteiro profissional',
      tone: 'Sofisticado mas acessível, narrativo, cria atmosfera e suspense',
      specialties: ['Direção visual', 'Narrativa cinematográfica', 'Produção de alto nível', 'Storytelling visual'],
      scriptStructure: 'Setup visual → Conflito crescente → Clímax emocional → Resolução satisfatória → CTA elegante',
      creativeApproach: 'Pensa em cada frame, usa técnicas de cinema, cria jornadas emocionais completas',
      callToActionStyle: 'Elegante e inspiracional, convida para uma transformação, não pressiona',
      scientificIntegration: 'Apresenta ciência como revelação dramática, construindo suspense até o insight final'
    }],
    
    ['Pedro Sobral', {
      name: 'Pedro Sobral',
      personality: 'Estruturado, educativo, autoridade técnica',
      methodology: 'Educação estruturada com metodologia de ensino progressivo',
      tone: 'Professoral mas moderno, didático, constrói conhecimento gradualmente',
      specialties: ['Conteúdo educativo', 'Metodologia de ensino', 'Autoridade técnica', 'Explicações claras'],
      scriptStructure: 'Conceito base → Desenvolvimento lógico → Exemplos práticos → Aplicação → CTA educativo',
      creativeApproach: 'Usa metáforas educativas, exemplos do cotidiano, constrói entendimento passo a passo',
      callToActionStyle: 'Educativo e capacitador, oferece aprendizado contínuo, posiciona como próximo passo natural',
      scientificIntegration: 'Apresenta ciência de forma didática, explicando o "porquê" por trás de cada benefício'
    }]
  ]);

  /**
   * Gera prompt personalizado baseado no mentor selecionado
   */
  static generateMentorPrompt(
    mentorName: string, 
    topic: string, 
    equipment: string, 
    scientificContext: string,
    format: string = 'reels'
  ): { systemPrompt: string; userPrompt: string } {
    
    // Detectar se é contexto profissional (clínica/médico)
    const isProfessional = this.isProfessionalContext(topic, equipment, scientificContext);
    
    if (isProfessional) {
      return this.generateProfessionalPrompt(mentorName, topic, equipment, scientificContext, format);
    }
    
    const mentor = this.mentorProfiles.get(mentorName) || this.mentorProfiles.get('Hyeser Souza')!;
    
    const systemPrompt = `
VOCÊ É ${mentor.name.toUpperCase()} - ESPECIALISTA EM CRIAÇÃO DE CONTEÚDO

## PERFIL & PERSONALIDADE:
${mentor.personality}

## METODOLOGIA EXCLUSIVA:
${mentor.methodology}

## SEU TOM DE VOZ:
${mentor.tone}

## SUAS ESPECIALIDADES:
${mentor.specialties.map(s => `• ${s}`).join('\n')}

## ESTRUTURA DE ROTEIRO PREFERIDA:
${mentor.scriptStructure}

## ABORDAGEM CRIATIVA:
${mentor.creativeApproach}

## ESTILO DE CTA:
${mentor.callToActionStyle}

## INTEGRAÇÃO CIENTÍFICA:
${mentor.scientificIntegration}

## REGRAS CRIATIVAS OBRIGATÓRIAS:
1. SEMPRE mantenha sua personalidade única de ${mentor.name}
2. Use APENAS informações reais sobre o equipamento fornecido
3. Integre evidências científicas de forma natural e envolvente
4. Crie roteiros que convertem, mas mantêm autenticidade
5. Adapte linguagem para o formato ${format}
6. NUNCA invente tecnologias ou benefícios não comprovados
7. Foque em transformação real do cliente final

## FORMATO ESPECÍFICO:
Crie um roteiro para ${format} seguindo exatamente sua metodologia de ${mentor.name}.
`;

    const userPrompt = `
TEMA: ${topic}
EQUIPAMENTO: ${equipment}
FORMATO: ${format}

CONTEXTO CIENTÍFICO DISPONÍVEL:
${scientificContext || 'Nenhum contexto científico específico fornecido.'}

Agora, como ${mentor.name}, crie um roteiro ${format} AUTÊNTICO e CRIATIVO sobre "${topic}" usando o equipamento "${equipment}".

EXIGÊNCIAS ESPECÍFICAS:
1. Mantenha 100% sua personalidade de ${mentor.name}
2. Use sua estrutura de roteiro característica
3. Integre o contexto científico de forma natural
4. Crie conexão emocional genuína
5. Termine com seu estilo único de CTA
6. Duração ideal para ${format}: ${this.getIdealDuration(format)}

ENTREGUE: Roteiro completo, criativo e autêntico no seu estilo único.
`;

    return { systemPrompt, userPrompt };
  }

  /**
   * Detecta se é contexto profissional baseado em palavras-chave
   * APENAS para clínicas/consultórios, não para temas médicos gerais
   */
  private static isProfessionalContext(topic: string, equipment: string, scientificContext: string): boolean {
    const professionalKeywords = [
      'clínica', 'consultório', 'médico dermatologista', 'estética avançada', 
      'consultório médico', 'clínica estética', 'dermatologia estética',
      'procedimento clínico', 'protocolo médico', 'equipamento clínico'
    ];
    
    // Só considera profissional se mencionar explicitamente clínica/consultório
    const allText = `${topic} ${equipment} ${scientificContext}`.toLowerCase();
    return professionalKeywords.some(keyword => allText.includes(keyword));
  }

  /**
   * Gera prompts específicos para contexto profissional/médico
   */
  private static generateProfessionalPrompt(
    mentorName: string,
    topic: string,
    equipment: string,
    scientificContext: string,
    format: string
  ): { systemPrompt: string; userPrompt: string } {

    const systemPrompt = `
VOCÊ É UM ESPECIALISTA EM COMUNICAÇÃO MÉDICA E MARKETING PARA CLÍNICAS ESTÉTICAS

## CONTEXTO PROFISSIONAL:
Você está criando conteúdo para profissionais da área médica/estética que precisam comunicar tratamentos de forma técnica, mas acessível para pacientes.

## TOM OBRIGATÓRIO:
- EXCLUSIVAMENTE profissional e técnico
- Linguagem científica mas acessível
- Autoridade médica e credibilidade
- NUNCA use gírias ou linguagem vulgar
- Mantenha seriedade e confiança

## ESTRUTURA PARA CLÍNICAS:
1. **INTRODUÇÃO ESPECÍFICA** (0-4s): Apresente o problema específico (ex: celulite, flacidez)
2. **TECNOLOGIA ESPECÍFICA** (5-12s): Explique como o equipamento específico funciona
3. **BENEFÍCIOS COMPROVADOS** (13-20s): Resultados específicos para o problema
4. **CONVITE PROFISSIONAL** (21-25s): CTA educativo e respeitoso

## REGRAS ABSOLUTAS:
- SEMPRE mencione o nome específico do equipamento se fornecido
- SEMPRE mencione o problema específico (celulite, flacidez, etc.)
- Use terminologia médica apropriada
- Cite evidências científicas quando relevantes
- NUNCA use termos genéricos como "equipamento estético"
- Foque em mecanismos de ação reais e específicos

## PROIBIÇÕES TOTAIS:
- Termos genéricos como "equipamento estético" ou "energia controlada"
- Gírias como "miga", "bora", "arrasar"
- Expressões vulgares ou casuais  
- Linguagem de influencer
- Comparações informais
- Promessas milagrosas
- Inventar informações sobre equipamentos
`;

    const userPrompt = `
TEMA ESPECÍFICO: ${topic}
EQUIPAMENTO: ${equipment}
FORMATO: ${format}

${scientificContext}

Crie um roteiro ESPECÍFICO para ${format} destinado a uma clínica estética.

REQUISITOS OBRIGATÓRIOS:
1. SEMPRE mencione "${topic}" especificamente no roteiro
2. SEMPRE mencione "${equipment}" pelo nome exato no roteiro
3. Use informações específicas fornecidas sobre o equipamento
4. Explique o mecanismo de ação específico
5. Foque nos benefícios específicos para "${topic}"
6. Mantenha autoridade médica
7. CTA educativo e profissional

PROIBIDO:
- Usar "equipamento estético" genérico
- Inventar informações não fornecidas
- Ser vago ou genérico
- Usar linguagem de influencer

PÚBLICO: Pacientes de clínica estética interessados especificamente em "${topic}".
OBJETIVO: Educar sobre como "${equipment}" trata "${topic}" especificamente.

ENTREGUE: Roteiro profissional, específico e técnico.
`;

    return { systemPrompt, userPrompt };
  }

  /**
   * Retorna duração ideal por formato
   */
  private static getIdealDuration(format: string): string {
    const durations: Record<string, string> = {
      'reels': '15-30 segundos',
      'stories': '10-15 segundos',
      'carrossel': '45-60 segundos de leitura',
      'video': '30-60 segundos',
      'post_estatico': '20-30 segundos de leitura'
    };
    
    return durations[format] || '30-45 segundos';
  }

  /**
   * Lista todos os mentores disponíveis
   */
  static getAvailableMentors(): string[] {
    return Array.from(this.mentorProfiles.keys());
  }

  /**
   * Obtém informações de um mentor específico
   */
  static getMentorInfo(mentorName: string): MentorProfile | null {
    return this.mentorProfiles.get(mentorName) || null;
  }

  /**
   * Adiciona contexto científico específico ao prompt
   */
  static enhanceWithScientificContext(
    basePrompt: string, 
    scientificInsights: Array<{title: string, summary: string, relevanceScore: number}>
  ): string {
    
    if (!scientificInsights.length) return basePrompt;
    
    const topInsights = scientificInsights
      .filter(insight => insight.relevanceScore >= 6)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 3);
    
    const scientificContext = topInsights
      .map(insight => `"${insight.title}": ${insight.summary}`)
      .join('\n\n');
    
    return basePrompt + `\n\nEVIDÊNCIAS CIENTÍFICAS RELEVANTES (Score 6+):\n${scientificContext}\n\nUse essas evidências para dar credibilidade e embasamento científico ao seu roteiro, mas sempre mantendo seu estilo único.`;
  }
}

export default MentorPromptGenerator;