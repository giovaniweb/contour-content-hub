
export const parseAIDiagnostic = (diagnostic: string) => {
  console.log('🔍 Parseando diagnóstico:', diagnostic);
  
  if (!diagnostic) {
    console.log('❌ Diagnóstico vazio');
    return null;
  }

  const sections = {
    diagnostico: '',
    ideias: [],
    plano: '',
    estrategias: [],
    satira: ''
  };

  // Normalizar o texto removendo caracteres especiais e convertendo para maiúsculo para busca
  const normalizedText = diagnostic.replace(/[#*]/g, '').toUpperCase();
  
  // Extrair seção de diagnóstico - procurar por diferentes variações
  const diagnosticoPatterns = [
    /DIAGNÓSTICO ESTRATÉGICO([\s\S]*?)(?=IDEIAS DE CONTEÚDO|PLANO DE AÇÃO|💡|📅|$)/i,
    /PERFIL DA CLÍNICA([\s\S]*?)(?=IDEIAS DE CONTEÚDO|PLANO DE AÇÃO|💡|📅|$)/i,
    /DIAGNÓSTICO([\s\S]*?)(?=IDEIAS DE CONTEÚDO|PLANO DE AÇÃO|💡|📅|$)/i
  ];

  for (const pattern of diagnosticoPatterns) {
    const match = diagnostic.match(pattern);
    if (match && match[1].trim().length > 50) {
      sections.diagnostico = match[1].trim();
      console.log('✅ Diagnóstico extraído:', sections.diagnostico.substring(0, 100));
      break;
    }
  }

  // Extrair ideias de conteúdo - procurar por diferentes variações
  const ideiasPatterns = [
    /IDEIAS DE CONTEÚDO[^a-zA-Z]*PERSONALIZADAS([\s\S]*?)(?=PLANO DE AÇÃO|ESTRATÉGIAS|📅|📈|$)/i,
    /IDEIAS DE CONTEÚDO([\s\S]*?)(?=PLANO DE Ação|ESTRATÉGIAS|📅|📈|$)/i,
    /💡[^a-zA-Z]*IDEIAS([\s\S]*?)(?=PLANO DE AÇÃO|ESTRATÉGIAS|📅|📈|$)/i
  ];

  for (const pattern of ideiasPatterns) {
    const match = diagnostic.match(pattern);
    if (match && match[1]) {
      const ideiasText = match[1];
      // Extrair itens numerados ou com bullets
      const ideiasList = ideiasText.match(/(\d+\..*?(?=\d+\.|$))|([•\-].*?(?=[•\-]|$))/gs);
      if (ideiasList && ideiasList.length > 0) {
        sections.ideias = ideiasList
          .map(idea => idea.replace(/^\d+\.|^[•\-]\s*/, '').trim())
          .filter(idea => idea.length > 20)
          .slice(0, 4);
        console.log('✅ Ideias extraídas:', sections.ideias.length);
        break;
      }
    }
  }

  // Extrair plano de ação
  const planoPatterns = [
    /PLANO DE AÇÃO[^a-zA-Z]*3 SEMANAS([\s\S]*?)(?=ESTRATÉGIAS|SÁTIRA|🧩|$)/i,
    /PLANO DE AÇÃO([\s\S]*?)(?=ESTRATÉGIAS|SÁTIRA|🧩|$)/i,
    /📅[^a-zA-Z]*PLANO([\s\S]*?)(?=ESTRATÉGIAS|SÁTIRA|🧩|$)/i
  ];

  for (const pattern of planoPatterns) {
    const match = diagnostic.match(pattern);
    if (match && match[1].trim().length > 50) {
      sections.plano = match[1].trim();
      console.log('✅ Plano extraído:', sections.plano.substring(0, 100));
      break;
    }
  }

  // Extrair estratégias personalizadas
  const estrategiasPatterns = [
    /ESTRATÉGIAS PERSONALIZADAS([\s\S]*?)(?=SÁTIRA|🧩|$)/i,
    /📈[^a-zA-Z]*ESTRATÉGIAS([\s\S]*?)(?=SÁTIRA|🧩|$)/i
  ];

  for (const pattern of estrategiasPatterns) {
    const match = diagnostic.match(pattern);
    if (match && match[1]) {
      const estrategiasText = match[1];
      const estrategiasList = estrategiasText.match(/([•\-].*?(?=[•\-]|$))|(\d+\..*?(?=\d+\.|$))/gs);
      if (estrategiasList && estrategiasList.length > 0) {
        sections.estrategias = estrategiasList
          .map(estrategia => estrategia.replace(/^\d+\.|^[•\-]\s*/, '').trim())
          .filter(estrategia => estrategia.length > 20)
          .slice(0, 5);
        console.log('✅ Estratégias extraídas:', sections.estrategias.length);
        break;
      }
    }
  }

  // Se não encontrou estratégias específicas, extrair do diagnóstico geral
  if (sections.estrategias.length === 0) {
    const linhasEstrategicas = diagnostic.split('\n')
      .filter(linha => (linha.includes('•') || linha.includes('-')) && linha.length > 30)
      .filter(linha => 
        linha.toLowerCase().includes('conteúdo') ||
        linha.toLowerCase().includes('estratégia') ||
        linha.toLowerCase().includes('marketing') ||
        linha.toLowerCase().includes('autoridade') ||
        linha.toLowerCase().includes('cases') ||
        linha.toLowerCase().includes('educativo') ||
        linha.toLowerCase().includes('redes sociais')
      );
    
    sections.estrategias = linhasEstrategicas
      .map(linha => linha.replace(/[•\-]/g, '').trim())
      .slice(0, 5);
    
    console.log('🔄 Estratégias extraídas do diagnóstico geral:', sections.estrategias.length);
  }

  // Extrair sátira do mentor
  const satiraPatterns = [
    /SÁTIRA DO MENTOR([\s\S]*?)(?=---|\*Diagnóstico|$)/i,
    /🧩[^a-zA-Z]*MENTOR([\s\S]*?)(?=---|\*Diagnóstico|$)/i,
    /ENIGMA SATÍRICO([\s\S]*?)(?=---|\*Diagnóstico|$)/i
  ];

  for (const pattern of satiraPatterns) {
    const match = diagnostic.match(pattern);
    if (match && match[1]) {
      const mentorSection = match[1];
      // Procurar por texto em aspas ou texto após ":" 
      const reflexaoMatch = mentorSection.match(/"([^"]+)"|:([^.]+\.)/) || 
                           mentorSection.match(/["""']([^"""']+)["""']/);
      if (reflexaoMatch) {
        sections.satira = (reflexaoMatch[1] || reflexaoMatch[2] || '').replace(/[*"]/g, '').trim();
        console.log('✅ Sátira extraída:', sections.satira.substring(0, 100));
        break;
      }
    }
  }

  console.log('📊 Seções extraídas:', {
    diagnostico: sections.diagnostico.length > 0,
    ideias: sections.ideias.length,
    plano: sections.plano.length > 0,
    estrategias: sections.estrategias.length,
    satira: sections.satira.length > 0
  });

  return sections;
};

export const cleanText = (text: string) => {
  return text
    .replace(/\*\*/g, '') // Remove **
    .replace(/\*/g, '') // Remove *
    .replace(/^[•\-]\s*/, '') // Remove bullets no início
    .trim();
};

export const formatTitle = (text: string) => {
  // Remove asteriscos e formata títulos
  return cleanText(text);
};
