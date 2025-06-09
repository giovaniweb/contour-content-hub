
// Utility functions for parsing diagnostic sections
export const extractDiagnosticSections = (text: string) => {
  const sections = {
    estrategico: '',
    conteudo: '',
    planoAcao: '',
    marca: '',
    enigma: '',
    insights: ''
  };

  // Regex patterns for each required section with exact titles
  const patterns = {
    estrategico: /## 📊 Diagnóstico Estratégico da Clínica[\s\S]*?(?=## 💡|$)/,
    conteudo: /## 💡 Sugestões de Conteúdo Personalizado[\s\S]*?(?=## 📅|$)/,
    planoAcao: /## 📅 Plano de Ação Semanal[\s\S]*?(?=## 🎨|$)/,
    marca: /## 🎨 Avaliação de Marca e Atendimento[\s\S]*?(?=## 🧩|$)/,
    enigma: /## 🧩 Enigma do Mentor[\s\S]*?(?=## 📈|$)/,
    insights: /## 📈 Insights Estratégicos Fluida[\s\S]*?$/
  };

  console.log('🔍 Extracting diagnostic sections...');

  // Extract each section
  Object.entries(patterns).forEach(([key, pattern]) => {
    const match = text.match(pattern);
    if (match) {
      sections[key as keyof typeof sections] = match[0].trim();
      console.log(`✅ Section ${key} found`);
    } else {
      console.log(`❌ Section ${key} not found`);
    }
  });

  return sections;
};

export const formatSectionContent = (content: string) => {
  if (!content) return [];

  return content.split('\n').map((line, index) => {
    if (line.trim() === '') return { type: 'break', content: '', key: index };
    
    // Headers
    if (line.startsWith('##')) {
      return {
        type: 'header',
        content: line.replace('##', '').trim(),
        key: index
      };
    }
    
    // Lista com bullet points
    if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
      return {
        type: 'bullet',
        content: line.replace(/^[•\-*]\s*/, '').trim(),
        key: index
      };
    }
    
    // Semanas do plano de ação
    if (line.includes('Semana')) {
      return {
        type: 'week',
        content: line.trim(),
        key: index
      };
    }
    
    // Parágrafo normal
    return {
      type: 'paragraph',
      content: line.trim(),
      key: index
    };
  }).filter(item => item.content !== '');
};
