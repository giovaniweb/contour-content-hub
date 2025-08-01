// P2-002: Testes unitários para fluxos críticos
import { describe, it, expect, vi } from 'vitest';
import { validateEquipmentTerms, sanitizeEquipmentText } from '../utils/validation/equipmentTermsValidation';
import { OptimizedPrompts, TokenConfig, truncateContext, estimateCost } from '../utils/optimizedPrompts';

// Mock do supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    functions: {
      invoke: vi.fn()
    }
  }
}));

describe('Validação de Equipamentos', () => {
  it('deve detectar termos proibidos', () => {
    const text = 'Equipamento de criofrequência para tratamento';
    const errors = validateEquipmentTerms(text);
    
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain('criofrequência');
  });

  it('deve sanitizar termos proibidos', () => {
    const text = 'Tratamento com criofrequência avançada';
    const sanitized = sanitizeEquipmentText(text);
    
    expect(sanitized).not.toContain('criofrequência');
    expect(sanitized).toContain('[TERMO_REMOVIDO]');
  });

  it('deve permitir texto sem termos proibidos', () => {
    const text = 'Equipamento de radiofrequência para estética';
    const errors = validateEquipmentTerms(text);
    
    expect(errors).toHaveLength(0);
  });
});

describe('Prompts Otimizados', () => {
  it('deve gerar prompt de usuário otimizado', () => {
    const data = {
      clinicType: 'clinica_medica',
      medicalSpecialty: 'Dermatologia',
      medicalEquipments: 'Laser CO2',
      medicalTicket: '1500_3000',
      revenueGoal: 'crescer_30',
      targetAudience: 'Mulheres 25-45'
    };

    const prompt = OptimizedPrompts.userTemplate(data);
    
    expect(prompt).toContain('Tipo: MED');
    expect(prompt).toContain('Esp: Dermatologia');
    expect(prompt).toContain('Equip: Laser CO2');
    expect(prompt.length).toBeLessThan(500); // Verificar otimização
  });

  it('deve truncar contexto longo', () => {
    const longText = 'A'.repeat(1000);
    const truncated = truncateContext(longText, 50); // ~200 chars
    
    expect(truncated.length).toBeLessThanOrEqual(200);
    expect(truncated).toMatch(/\.\.\.$/);
  });

  it('deve calcular custos corretamente', () => {
    const cost = estimateCost(1000, 500);
    
    expect(cost.inputCost).toBe(0.00250);
    expect(cost.outputCost).toBe(0.00500);
    expect(cost.totalCost).toBe(0.00750);
    expect(cost.totalTokens).toBe(1500);
  });
});

describe('Configurações de Token', () => {
  it('deve ter limites de token otimizados', () => {
    expect(TokenConfig.maxTokens.marketing).toBe(1500);
    expect(TokenConfig.maxTokens.script).toBe(800);
    expect(TokenConfig.maxTokens.validation).toBe(500);
  });

  it('deve ter temperatura adequada por tipo', () => {
    expect(TokenConfig.temperature.marketing).toBe(0.6);
    expect(TokenConfig.temperature.script).toBe(0.8);
    expect(TokenConfig.temperature.validation).toBe(0.3);
  });
});

describe('Fluxo de Geração de Roteiro', () => {
  it('deve validar parâmetros obrigatórios', () => {
    const params = {
      tema: 'Laser para manchas',
      formato: 'carrossel',
      objetivo: 'Atrair Atenção',
      mentor: 'Criativo'
    };

    const prompt = OptimizedPrompts.scriptGeneration(params);
    
    expect(prompt).toContain('Roteiro carrossel');
    expect(prompt).toContain('Tema: Laser para manchas');
    expect(prompt).toContain('Tom: Criativo');
  });
});

// Testes de integração simulados
describe('Fluxo Completo de Diagnóstico', () => {
  it('deve processar dados de clínica médica', async () => {
    const mockData = {
      clinicType: 'clinica_medica',
      medicalSpecialty: 'Dermatologia',
      medicalEquipments: 'Laser CO2, IPL',
      medicalTicket: '1500_3000'
    };

    // Simular validação de entrada
    const errors = validateEquipmentTerms(mockData.medicalEquipments);
    expect(errors).toHaveLength(0);

    // Simular geração de prompt
    const prompt = OptimizedPrompts.userTemplate(mockData);
    expect(prompt).toBeTruthy();
    expect(prompt.length).toBeLessThan(500);
  });

  it('deve processar dados de clínica estética', async () => {
    const mockData = {
      clinicType: 'clinica_estetica',
      aestheticFocus: 'Facial',
      aestheticEquipments: 'HIFU, Radiofrequência',
      aestheticTicket: '300_600'
    };

    const errors = validateEquipmentTerms(mockData.aestheticEquipments);
    expect(errors).toHaveLength(0);

    const prompt = OptimizedPrompts.userTemplate(mockData);
    expect(prompt).toContain('Tipo: EST');
    expect(prompt).toContain('Esp: Facial');
  });
});

// Testes de performance
describe('Performance e Otimização', () => {
  it('prompt system deve ser conciso', () => {
    const systemPrompt = OptimizedPrompts.system;
    
    // Verificar que o prompt foi otimizado (estimativa de tokens)
    expect(systemPrompt.length).toBeLessThan(1000); // ~250 tokens
  });

  it('deve estimar custos dentro do esperado', () => {
    // Teste com valores típicos de uso
    const cost = estimateCost(200, 800); // Prompt pequeno, resposta média
    
    expect(cost.totalCost).toBeLessThan(0.01); // Menos de 1 centavo por diagnóstico
    expect(cost.totalTokens).toBe(1000);
  });
});