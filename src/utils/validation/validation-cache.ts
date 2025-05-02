
import { ValidationResult } from './types';

// Uma classe simples para gerenciar cache de validações
export class ValidationCache {
  private static instance: ValidationCache;
  private cache: Map<string, {validation: ValidationResult, timestamp: number}>;
  private readonly CACHE_TTL = 1000 * 60 * 60; // 1 hora
  
  private constructor() {
    this.cache = new Map();
  }
  
  public static getInstance(): ValidationCache {
    if (!ValidationCache.instance) {
      ValidationCache.instance = new ValidationCache();
    }
    return ValidationCache.instance;
  }
  
  public set(scriptId: string, validation: ValidationResult): void {
    this.cache.set(scriptId, {
      validation,
      timestamp: Date.now()
    });
  }
  
  public get(scriptId: string): ValidationResult | null {
    const cached = this.cache.get(scriptId);
    
    if (!cached) {
      return null;
    }
    
    // Verificar se o cache expirou
    if (Date.now() - cached.timestamp > this.CACHE_TTL) {
      this.cache.delete(scriptId);
      return null;
    }
    
    return cached.validation;
  }
  
  public clear(scriptId?: string): void {
    if (scriptId) {
      this.cache.delete(scriptId);
    } else {
      this.cache.clear();
    }
  }
}
