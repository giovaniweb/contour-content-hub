
// Utilitário para parsing e limpeza de scripts
export interface ParsedScript {
  roteiro: string;
  formato: string;
  emocao_central: string;
  intencao: string;
  objetivo: string;
  mentor: string;
}

export const parseScriptContent = (content: string): ParsedScript | null => {
  console.log('🔍 [ScriptParser] Parsing content:', content.substring(0, 100));
  
  try {
    // Remover markdown JSON wrapper se existir
    let cleanContent = content.replace(/```json\s*|\s*```/g, '').trim();
    
    // Tentar parse direto primeiro
    let parsed: any;
    try {
      parsed = JSON.parse(cleanContent);
    } catch (e) {
      // Se falhar, procurar por JSON dentro do texto
      const jsonMatch = cleanContent.match(/\{.*\}/s);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Nenhum JSON válido encontrado');
      }
    }
    
    // Se o JSON tem um campo "roteiro" aninhado, extrair
    if (parsed.roteiro && typeof parsed.roteiro === 'object') {
      parsed = parsed.roteiro;
    }
    
    console.log('✅ [ScriptParser] Parsed successfully:', parsed);
    
    return {
      roteiro: parsed.roteiro || content,
      formato: parsed.formato || 'video',
      emocao_central: parsed.emocao_central || 'engajamento',
      intencao: parsed.intencao || 'atrair',
      objetivo: parsed.objetivo || 'Engajar audiência',
      mentor: parsed.mentor || 'Especialista'
    };
    
  } catch (error) {
    console.warn('⚠️ [ScriptParser] Parse failed, using raw content:', error);
    
    // Fallback: usar conteúdo bruto
    return {
      roteiro: content,
      formato: 'video',
      emocao_central: 'engajamento',
      intencao: 'atrair',
      objetivo: 'Engajar audiência',
      mentor: 'Especialista'
    };
  }
};

export const formatMentorName = (mentor: string): string => {
  const mentorMap: Record<string, string> = {
    'Camila Porto': '👩‍⚕️ Dra. Camila Porto',
    'camila_porto': '👩‍⚕️ Dra. Camila Porto',
    'Paulo Cuenca': '🎯 Paulo Cuenca',
    'paulo_cuenca': '🎯 Paulo Cuenca',
    'Walt Disney': '✨ Walt Disney 1928',
    'disney': '✨ Walt Disney 1928'
  };
  
  return mentorMap[mentor] || `🎨 ${mentor}`;
};

export const formatScriptSections = (roteiro: string): Array<{title: string, content: string, icon: string}> => {
  const sections = [];
  
  // Detectar seções por palavras-chave
  const gancho = roteiro.match(/(?:Gancho|Hook):\s*([^.]*(?:\.[^.]*)*)/i);
  const conflito = roteiro.match(/(?:Conflito|Problema|Problem):\s*([^.]*(?:\.[^.]*)*)/i);
  const virada = roteiro.match(/(?:Virada|Solução|Solution):\s*([^.]*(?:\.[^.]*)*)/i);
  const cta = roteiro.match(/(?:CTA|Call to Action):\s*([^.]*(?:\.[^.]*)*)/i);
  
  if (gancho) {
    sections.push({
      title: 'Gancho',
      content: gancho[1].trim(),
      icon: '🎣'
    });
  }
  
  if (conflito) {
    sections.push({
      title: 'Conflito/Problema',
      content: conflito[1].trim(),
      icon: '⚡'
    });
  }
  
  if (virada) {
    sections.push({
      title: 'Virada/Solução',
      content: virada[1].trim(),
      icon: '💡'
    });
  }
  
  if (cta) {
    sections.push({
      title: 'Call to Action',
      content: cta[1].trim(),
      icon: '🚀'
    });
  }
  
  // Se não encontrou seções estruturadas, retornar conteúdo completo
  if (sections.length === 0) {
    sections.push({
      title: 'Roteiro Completo',
      content: roteiro,
      icon: '📝'
    });
  }
  
  return sections;
};
