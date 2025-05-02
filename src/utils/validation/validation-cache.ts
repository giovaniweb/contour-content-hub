
import { ValidationResult } from './types';

/**
 * Cache em memória para armazenar validações recentes
 * Implementado como singleton para garantir estado compartilhado
 */
export class ValidationCache {
  private static instance: ValidationCache;
  private cache: Map<string, ValidationResult & {timestamp: string}>;
  private maxSize: number;

  private constructor() {
    this.cache = new Map();
    this.maxSize = 50; // Limitar tamanho do cache para evitar vazamentos de memória
  }

  public static getInstance(): ValidationCache {
    if (!ValidationCache.instance) {
      ValidationCache.instance = new ValidationCache();
    }
    return ValidationCache.instance;
  }

  // Obter validação do cache
  public get(scriptId: string): (ValidationResult & {timestamp?: string}) | null {
    const cached = this.cache.get(scriptId);
    if (!cached) return null;
    
    // Verificar validade (máximo 60 minutos)
    const maxAge = 60 * 60 * 1000; // 1 hora em ms
    const timestamp = new Date(cached.timestamp).getTime();
    const now = Date.now();
    
    if (now - timestamp > maxAge) {
      this.cache.delete(scriptId);
      return null;
    }
    
    return cached;
  }

  // Adicionar validação ao cache
  public set(scriptId: string, validation: ValidationResult): void {
    // Se o cache estiver cheio, remover o item mais antigo
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
    
    // Adicionar ao cache com timestamp
    this.cache.set(scriptId, {
      ...validation,
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
