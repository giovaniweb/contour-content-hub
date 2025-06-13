
export interface PostEstaticoData {
  roteiro: string;
  texto_imagem: string;
  legenda: string;
  sugestao_visual: string;
}

// Função para limpar o conteúdo do texto
const cleanContent = (content: string): string => {
  return content
    .replace(/\n\n+/g, ' ') // Remove múltiplas quebras de linha
    .replace(/\n/g, ' ') // Remove quebras de linha simples
    .replace(/\s+/g, ' ') // Remove espaços múltiplos
    .trim(); // Remove espaços nas extremidades
};

export const parsePostEstatico = (roteiro: string): PostEstaticoData | null => {
  console.log('🔍 [PostEstaticoParser] Iniciando parse do roteiro:', roteiro);
  
  try {
    // Tentar parsear como JSON primeiro
    const parsed = JSON.parse(roteiro);
    
    if (parsed.formato === 'post_estatico') {
      const data: PostEstaticoData = {
        roteiro: cleanContent(parsed.roteiro || ''),
        texto_imagem: cleanContent(parsed.texto_imagem || ''),
        legenda: cleanContent(parsed.legenda || ''),
        sugestao_visual: cleanContent(parsed.sugestao_visual || '')
      };
      
      console.log('✅ [PostEstaticoParser] Parse JSON bem-sucedido:', data);
      return data;
    }
  } catch (error) {
    console.warn('⚠️ [PostEstaticoParser] Não é JSON válido, tentando parse manual');
  }

  // Fallback: parse manual por padrões de texto
  const data: PostEstaticoData = {
    roteiro: '',
    texto_imagem: '',
    legenda: '',
    sugestao_visual: ''
  };

  // Padrões para identificar seções
  const textoImagemMatch = roteiro.match(/texto[_\s](?:da\s)?imagem[:\s]+(.*?)(?=\n|legenda|sugest[aã]o|$)/is);
  const legendaMatch = roteiro.match(/legenda[:\s]+(.*?)(?=\n|sugest[aã]o|texto|$)/is);
  const sugestaoMatch = roteiro.match(/sugest[aã]o[_\s]visual[:\s]+(.*?)(?=\n|legenda|texto|$)/is);

  if (textoImagemMatch) {
    data.texto_imagem = cleanContent(textoImagemMatch[1]);
  }
  
  if (legendaMatch) {
    data.legenda = cleanContent(legendaMatch[1]);
  }
  
  if (sugestaoMatch) {
    data.sugestao_visual = cleanContent(sugestaoMatch[1]);
  }

  // Se não encontrou nada específico, usar todo o roteiro como legenda
  if (!data.texto_imagem && !data.legenda && !data.sugestao_visual) {
    data.roteiro = cleanContent(roteiro);
    data.legenda = cleanContent(roteiro);
    console.warn('⚠️ [PostEstaticoParser] Usando roteiro completo como legenda');
  }

  console.log('✅ [PostEstaticoParser] Parse manual concluído:', data);
  return data;
};

// Utilitário para validar dados do post estático
export const validatePostEstatico = (data: PostEstaticoData): {
  isValid: boolean;
  issues: string[];
  score: number;
} => {
  const issues: string[] = [];
  let score = 0;

  // Validar texto da imagem
  if (!data.texto_imagem || data.texto_imagem.trim() === '') {
    issues.push('Texto da imagem está vazio');
  } else if (data.texto_imagem.length > 50) {
    issues.push('Texto da imagem muito longo (máximo 8 palavras recomendado)');
  } else {
    score += 30;
  }

  // Validar legenda
  if (!data.legenda || data.legenda.trim() === '') {
    issues.push('Legenda está vazia');
  } else if (data.legenda.length < 20) {
    issues.push('Legenda muito curta (mínimo 20 caracteres)');
  } else {
    score += 40;
  }

  // Validar sugestão visual
  if (!data.sugestao_visual || data.sugestao_visual.trim() === '') {
    issues.push('Sugestão visual está vazia');
  } else {
    score += 30;
  }

  return {
    isValid: issues.length === 0,
    issues,
    score: Math.min(score, 100)
  };
};
