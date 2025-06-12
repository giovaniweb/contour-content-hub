
import { useState, useEffect } from 'react';
import { ScriptTemplate, findBestTemplate, personalizeTemplate } from '../templates/scriptTemplates';

interface CachedScript {
  key: string;
  script: any;
  timestamp: number;
  isAiGenerated: boolean;
}

export const useTemplateCache = () => {
  const [cache, setCache] = useState<Map<string, CachedScript>>(new Map());

  // Carregar cache do localStorage
  useEffect(() => {
    try {
      const savedCache = localStorage.getItem('fluidaroteirista_cache');
      if (savedCache) {
        const cacheData = JSON.parse(savedCache) as [string, CachedScript][];
        const cacheMap = new Map<string, CachedScript>(cacheData);
        setCache(cacheMap);
      }
    } catch (error) {
      console.error('Erro ao carregar cache:', error);
    }
  }, []);

  // Salvar cache no localStorage
  const saveCache = (newCache: Map<string, CachedScript>) => {
    try {
      const cacheArray = Array.from(newCache.entries());
      localStorage.setItem('fluidaroteirista_cache', JSON.stringify(cacheArray));
      setCache(newCache);
    } catch (error) {
      console.error('Erro ao salvar cache:', error);
    }
  };

  // Gerar chave única para combinação de parâmetros
  const generateCacheKey = (tema: string, equipamentos?: string[], mentor?: string): string => {
    const equipamentosStr = equipamentos?.sort().join(',') || '';
    return `${tema.toLowerCase()}_${equipamentosStr}_${mentor || 'default'}`.replace(/\s+/g, '_');
  };

  // Buscar no cache
  const getCached = (tema: string, equipamentos?: string[], mentor?: string): CachedScript | null => {
    const key = generateCacheKey(tema, equipamentos, mentor);
    const cached = cache.get(key);
    
    if (!cached) return null;
    
    // Verificar se não expirou (24 horas)
    const now = Date.now();
    const expirationTime = 24 * 60 * 60 * 1000; // 24 horas
    
    if (now - cached.timestamp > expirationTime) {
      // Remover cache expirado
      const newCache = new Map(cache);
      newCache.delete(key);
      saveCache(newCache);
      return null;
    }
    
    return cached;
  };

  // Salvar no cache
  const setCached = (tema: string, script: any, isAiGenerated: boolean, equipamentos?: string[], mentor?: string) => {
    const key = generateCacheKey(tema, equipamentos, mentor);
    const cached: CachedScript = {
      key,
      script,
      timestamp: Date.now(),
      isAiGenerated
    };
    
    const newCache = new Map(cache);
    newCache.set(key, cached);
    saveCache(newCache);
  };

  // Gerar template imediato
  const generateInstantTemplate = (tema: string, equipamentos?: string[], mentor?: string): any => {
    console.log('🏃‍♂️ Gerando template instantâneo para:', tema);
    
    const template = findBestTemplate(tema, equipamentos);
    const personalizedTemplate = personalizeTemplate(template, tema, equipamentos);
    
    const script = {
      roteiro: personalizedTemplate.roteiro,
      formato: personalizedTemplate.formato,
      emocao_central: personalizedTemplate.emocao_central,
      intencao: personalizedTemplate.intencao,
      objetivo: personalizedTemplate.objetivo,
      mentor: mentor || personalizedTemplate.mentor,
      elementos_aplicados: {
        storytelling: 7,
        copywriting: 6,
        conhecimento_publico: 6,
        analises_dados: 4,
        gatilhos_mentais: 7,
        logica_argumentativa: 6,
        premissas_educativas: 6,
        mapas_empatia: 7,
        headlines: 8,
        ferramentas_especificas: 5
      },
      especialidades_aplicadas: ['Criatividade', 'Engajamento'],
      modo_usado: 'Template Instantâneo',
      is_template: true,
      ai_improving: false
    };
    
    // Salvar template no cache
    setCached(tema, script, false, equipamentos, mentor);
    
    return script;
  };

  // Limpar cache antigo
  const clearExpiredCache = () => {
    const now = Date.now();
    const expirationTime = 24 * 60 * 60 * 1000;
    const newCache = new Map();
    
    cache.forEach((cached, key) => {
      if (now - cached.timestamp <= expirationTime) {
        newCache.set(key, cached);
      }
    });
    
    saveCache(newCache);
  };

  return {
    getCached,
    setCached,
    generateInstantTemplate,
    clearExpiredCache,
    cacheSize: cache.size
  };
};
