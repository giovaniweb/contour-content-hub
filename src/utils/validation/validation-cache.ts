
import { ValidationResult, CacheEntry } from './types';

/**
 * Classe singleton para gerenciar cache de validações de roteiros
 * Evita múltiplas requisições para o mesmo roteiro
 */
export class ValidationCache {
  private static instance: ValidationCache;
  private cache: Map<string, CacheEntry> = new Map();
  private readonly CACHE_DURATION_MS = 15 * 60 * 1000; // 15 minutos
  
  private constructor() {
    // Singleton
  }
  
  public static getInstance(): ValidationCache {
    if (!ValidationCache.instance) {
      ValidationCache.instance = new ValidationCache();
    }
    return ValidationCache.instance;
  }
  
  /**
   * Obtém uma validação em cache se existir e não estiver expirada
   */
  public get(id: string): ValidationResult | undefined {
    const cached = this.cache.get(id);
    if (!cached) return undefined;
    
    // Verificar se o cache expirou
    if (Date.now() - cached.timestamp > this.CACHE_DURATION_MS) {
      this.cache.delete(id);
      return undefined;
    }
    
    // Remover campo timestamp ao retornar
    const { timestamp, ...result } = cached;
    return result;
  }
  
  /**
   * Armazena uma validação em cache
   */
  public set(id: string, data: ValidationResult): void {
    // Criar entrada de cache com timestamp
    const cacheEntry: CacheEntry = {
      ...data,
      timestamp: Date.now()
    };
    
    this.cache.set(id, cacheEntry);
  }
  
  /**
   * Limpa o cache de validações
   */
  public clear(): void {
    this.cache.clear();
  }
  
  /**
   * Remove um item específico do cache
   */
  public remove(id: string): void {
    this.cache.delete(id);
  }
  
  /**
   * Retorna o número de itens em cache
   */
  public size(): number {
    return this.cache.size;
  }
}
