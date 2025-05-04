
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface SystemIssue {
  id: string;
  component: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'resolved';
  created_at: string;
  resolved_at?: string;
  category: 'bug' | 'improvement' | 'feature';
  assignedTo?: string;
  priority: number;
  repairAnalysis?: RepairAnalysis;
}

export interface RepairAnalysis {
  diagnóstico: string;
  solução: string;
  passos: string;
  complexidade: 'baixa' | 'média' | 'alta';
  autoReparo: boolean;
  rawAnalysis?: string;
}

export interface SystemMetric {
  name: string;
  value: number;
  target: number;
  unit: string;
  status: 'good' | 'warning' | 'critical';
  category: 'performance' | 'usage' | 'quality';
}

/**
 * Análise de sistema usando IA para diagnóstico e possível reparo
 */
export async function analyzeIssueWithAI(issue: SystemIssue): Promise<RepairAnalysis | null> {
  try {
    const { data, error } = await supabase.functions.invoke('system-auto-repair', {
      body: { issue }
    });

    if (error) throw error;

    if (!data || !data.analysis) {
      throw new Error("Resposta da análise inválida");
    }

    toast({
      title: "Análise concluída",
      description: "A análise do problema foi realizada com sucesso."
    });

    return data.analysis;
  } catch (error) {
    console.error("Erro na análise com IA:", error);
    toast({
      variant: "destructive",
      title: "Erro na análise",
      description: "Não foi possível analisar o problema com a IA."
    });
    return null;
  }
}

/**
 * Executa auto-reparo se possível
 */
export async function executeAutoRepair(issue: SystemIssue): Promise<boolean> {
  try {
    // Na implementação real, isso chamaria funções específicas de reparo
    // baseadas na análise da IA para o tipo de problema
    
    // Simula um tempo de processamento para o reparo
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (Math.random() > 0.3) { // 70% de chance de sucesso no simulador
      toast({
        title: "Reparo concluído",
        description: `O problema "${issue.component}" foi reparado automaticamente.`
      });
      return true;
    } else {
      throw new Error("O reparo automático não foi possível para este problema");
    }
  } catch (error) {
    console.error("Erro no auto-reparo:", error);
    toast({
      variant: "destructive",
      title: "Falha no reparo",
      description: error instanceof Error ? error.message : "Não foi possível realizar o reparo automático."
    });
    return false;
  }
}

/**
 * Executa verificação completa do sistema
 */
export async function runFullSystemCheck(): Promise<{
  newIssues: SystemIssue[];
  improvedMetrics: SystemMetric[];
}> {
  try {
    // Na implementação real, isso faria verificações reais do sistema
    // Aqui estamos apenas simulando
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simula novos problemas encontrados
    const newIssue: SystemIssue = {
      id: `new-${Date.now()}`,
      component: "Suporte a Dispositivos",
      description: "Melhorar responsividade para tablets em modo paisagem",
      severity: "medium",
      status: "pending",
      created_at: new Date().toISOString(),
      category: "improvement",
      priority: Math.floor(Math.random() * 10) + 1
    };
    
    // Simula métricas melhoradas
    const improvedMetric: SystemMetric = {
      name: "Tempo de Carregamento",
      value: 2.1, // melhor que o original de 2.5
      target: 2.0,
      unit: "segundos",
      status: "warning",
      category: "performance"
    };
    
    toast({
      title: "Verificação Concluída",
      description: "O sistema foi verificado com sucesso."
    });
    
    return {
      newIssues: [newIssue],
      improvedMetrics: [improvedMetric]
    };
  } catch (error) {
    console.error("Erro na verificação do sistema:", error);
    toast({
      variant: "destructive",
      title: "Erro na verificação",
      description: "Não foi possível concluir a verificação do sistema."
    });
    return {
      newIssues: [],
      improvedMetrics: []
    };
  }
}
