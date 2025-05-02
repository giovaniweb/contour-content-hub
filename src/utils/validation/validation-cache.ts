
import { ValidationResult } from './types';

/**
 * Cache em memória para armazenar validações recentes
 * Otimizado para desempenho e economia de memória
 * Implementado como singleton para garantir estado compartilhado
 */
export class ValidationCache {
  private static instance: ValidationCache;
  private cache: Map<string, ValidationResult & {timestamp: string}>;
  private maxSize: number;

  private constructor() {
    this.cache = new Map();
    this.maxSize = 10; // Reduzido para 10 para menor uso de memória
  }

  public static getInstance(): ValidationCache {
    if (!ValidationCache.instance) {
      ValidationCache.instance = new ValidationCache();
    }
    return ValidationCache.instance;
  }

  // Obter validação do cache com verificação de expiração otimizada
  public get(scriptId: string): (ValidationResult & {timestamp?: string}) | null {
    const cached = this.cache.get(scriptId);
    if (!cached) return null;
    
    // Verificação de validade mais eficiente (máximo 20 minutos)
    const maxAge = 20 * 60 * 1000; // 20 minutos em ms (reduzido de 30)
    const timestamp = new Date(cached.timestamp).getTime();
    
    if (Date.now() - timestamp > maxAge) {
      this.cache.delete(scriptId);
      return null;
    }
    
    return cached;
  }

  // Adicionar validação ao cache com gestão de memória melhorada
  public set(scriptId: string, validation: ValidationResult): void {
    // Se o cache estiver cheio, remover elementos antigos
    if (this.cache.size >= this.maxSize) {
      const oldEntries = [...this.cache.entries()]
        .sort((a, b) => new Date(a[1].timestamp).getTime() - new Date(b[1].timestamp).getTime());
      
      // Remover os 50% mais antigos para liberar espaço em bloco
      const removeCount = Math.max(1, Math.floor(this.maxSize * 0.5));
      for (let i = 0; i < removeCount; i++) {
        if (oldEntries[i]) {
          this.cache.delete(oldEntries[i][0]);
        }
      }
    }
    
    // Simplificar validação para economizar memória
    const lightValidation: ValidationResult = {
      nota_geral: validation.nota_geral,
      gancho: validation.gancho,
      clareza: validation.clareza,
      cta: validation.cta,
      emocao: validation.emocao,
      total: validation.total,
      sugestoes: validation.sugestoes,
      sugestoes_gerais: validation.sugestoes_gerais ? 
        validation.sugestoes_gerais.slice(0, 3) : [] // Limitar a 3 sugestões
    };
    
    // Processar blocos com limite de tamanho
    if (validation.blocos && validation.blocos.length > 0) {
      lightValidation.blocos = validation.blocos
        .slice(0, 10) // Limitar a 10 blocos no máximo
        .map(bloco => {
          // Limitar tamanho de texto para economia de memória
          if (bloco.texto && bloco.texto.length > 200) {
            bloco.texto = bloco.texto.substring(0, 200) + "...";
          }
          if (bloco.sugestao && bloco.sugestao.length > 200) {
            bloco.sugestao = bloco.sugestao.substring(0, 200) + "...";
          }
          return bloco;
        });
    }
    
    // Adicionar ao cache com timestamp
    this.cache.set(scriptId, {
      ...lightValidation,
      timestamp: new Date().toISOString()
    });
  }

  // Limpar todo o cache
  public clear(): void {
    this.cache.clear();
  }
  
  // Obter estatísticas do cache
  public getStats(): { size: number, maxSize: number } {
    return {
      size: this.cache.size,
      maxSize: this.maxSize
    };
  }
}
