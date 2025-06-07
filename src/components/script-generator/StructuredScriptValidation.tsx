
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface StructuredValidationProps {
  script: string;
  objective?: string;
  mentor?: {
    nome: string;
    estilo: string;
    tom: string;
    exemplos: string[];
  };
  onValidationComplete?: (result: StructuredValidationResult) => void;
}

interface StructuredValidationResult {
  estrutura: string;
  alinhamento: string;
  coerencia: string;
  sugestaoFinal: string;
  approved: boolean;
}

const StructuredScriptValidation: React.FC<StructuredValidationProps> = ({
  script,
  objective = "não especificado",
  mentor,
  onValidationComplete
}) => {
  const [isValidating, setIsValidating] = useState(false);
  const [result, setResult] = useState<StructuredValidationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleValidate = async () => {
    if (!script.trim()) {
      toast({
        title: "Erro",
        description: "Roteiro não pode estar vazio",
        variant: "destructive"
      });
      return;
    }

    setIsValidating(true);
    setError(null);

    try {
      const validationPrompt = `
Você é um especialista em roteiros curtos para redes sociais com alta performance criativa.

Receba o roteiro abaixo e valide os seguintes critérios:

---

✅ **1. Estrutura narrativa**
O roteiro possui:
- Gancho
- Conflito
- Virada
- CTA

---

🎯 **2. Alinhamento com o objetivo**
Objetivo do conteúdo: ${objective}
Avalie se a mensagem e a abordagem realmente entregam esse resultado.

---

🗣️ **3. Coerência com o mentor**
${mentor ? `
Mentor selecionado: ${mentor.nome}
Estilo esperado: ${mentor.estilo}
Tom: ${mentor.tom}
Exemplos típicos: ${mentor.exemplos.join(", ")}

O roteiro respeita esse estilo de comunicação?
` : "Nenhum mentor específico selecionado - avalie a coerência geral do tom e estilo."}

---

📌 Responda EXATAMENTE com a estrutura abaixo em formato JSON:

{
  "estrutura": "[ok ou sugestão de melhoria]",
  "alinhamento": "[ok ou sugestão]",
  "coerencia": "[ok ou sugestão]",
  "sugestaoFinal": "[resuma em 1 frase o que melhorar ou se está aprovado]",
  "approved": true ou false
}

---

Roteiro para validação:
${script}
      `;

      const { data, error } = await supabase.functions.invoke('validate-script', {
        body: {
          content: script,
          type: 'structuredValidation',
          title: 'Validação Estruturada',
          scriptId: `validation-${Date.now()}`,
          additionalContext: validationPrompt
        }
      });

      if (error) {
        throw new Error(`Erro na validação: ${error.message}`);
      }

      // Tentar extrair resultado estruturado da resposta
      let validationResult: StructuredValidationResult;
      
      if (data.sugestoes) {
        try {
          // Tentar parsear como JSON se a resposta vier estruturada
          const parsed = JSON.parse(data.sugestoes);
          validationResult = parsed;
        } catch {
          // Fallback para resposta não estruturada
          validationResult = {
            estrutura: data.gancho > 7 ? "ok" : "Melhore o gancho inicial",
            alinhamento: data.clareza > 7 ? "ok" : "Melhor alinhamento necessário",
            coerencia: data.emocao > 7 ? "ok" : "Ajuste o tom e estilo",
            sugestaoFinal: data.sugestoes || "Roteiro precisa de ajustes gerais",
            approved: data.total > 7
          };
        }
      } else {
        // Fallback baseado nas métricas numéricas
        validationResult = {
          estrutura: data.gancho > 7 ? "ok" : "Estrutura narrativa precisa ser melhorada",
          alinhamento: data.clareza > 7 ? "ok" : "Alinhamento com objetivo precisa de ajuste",
          coerencia: data.cta > 6 ? "ok" : "Coerência com mentor precisa ser revisada",
          sugestaoFinal: data.total > 7 ? "Roteiro aprovado!" : "Roteiro precisa de melhorias",
          approved: data.total > 7
        };
      }

      setResult(validationResult);
      
      if (onValidationComplete) {
        onValidationComplete(validationResult);
      }

      toast({
        title: validationResult.approved ? "Roteiro Aprovado!" : "Melhorias Necessárias",
        description: validationResult.sugestaoFinal,
        variant: validationResult.approved ? "default" : "destructive"
      });

    } catch (err) {
      console.error("Erro na validação estruturada:", err);
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido na validação";
      setError(errorMessage);
      
      toast({
        title: "Erro na Validação",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsValidating(false);
    }
  };

  const ValidationCriterion = ({ 
    icon, 
    title, 
    result: criterionResult, 
    status 
  }: { 
    icon: React.ReactNode; 
    title: string; 
    result: string; 
    status: 'ok' | 'warning' 
  }) => (
    <div className="flex items-start gap-3 p-3 border rounded-lg">
      <div className={`mt-1 ${status === 'ok' ? 'text-green-500' : 'text-amber-500'}`}>
        {icon}
      </div>
      <div className="flex-1">
        <h4 className="font-medium text-sm mb-1">{title}</h4>
        <p className="text-sm text-muted-foreground">{criterionResult}</p>
      </div>
      <Badge variant={status === 'ok' ? 'default' : 'secondary'} className={
        status === 'ok' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
      }>
        {status === 'ok' ? 'OK' : 'Atenção'}
      </Badge>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-primary" />
          Validação Estruturada
          <Badge variant="outline">Especialista</Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!result && !isValidating && (
          <div className="text-center py-4">
            <p className="text-muted-foreground mb-4">
              Clique para validar seu roteiro com critérios específicos de estrutura, objetivo e mentor.
            </p>
            <Button onClick={handleValidate} className="w-full">
              Validar Roteiro
            </Button>
          </div>
        )}

        {isValidating && (
          <div className="flex flex-col items-center justify-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-sm text-muted-foreground">
              Analisando estrutura narrativa, alinhamento e coerência...
            </p>
          </div>
        )}

        {error && (
          <div className="text-center py-4">
            <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-sm text-red-600 mb-4">{error}</p>
            <Button variant="outline" onClick={handleValidate}>
              Tentar Novamente
            </Button>
          </div>
        )}

        {result && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg">
              <div className="flex items-center gap-2">
                {result.approved ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-amber-500" />
                )}
                <span className="font-medium">
                  {result.approved ? 'Roteiro Aprovado!' : 'Melhorias Necessárias'}
                </span>
              </div>
              <Badge variant={result.approved ? 'default' : 'secondary'}>
                {result.approved ? 'Aprovado' : 'Em Revisão'}
              </Badge>
            </div>

            <div className="space-y-3">
              <ValidationCriterion
                icon={<CheckCircle className="h-4 w-4" />}
                title="✅ Estrutura Narrativa"
                result={result.estrutura}
                status={result.estrutura.toLowerCase().includes('ok') ? 'ok' : 'warning'}
              />
              
              <ValidationCriterion
                icon={<CheckCircle className="h-4 w-4" />}
                title="🎯 Alinhamento com Objetivo"
                result={result.alinhamento}
                status={result.alinhamento.toLowerCase().includes('ok') ? 'ok' : 'warning'}
              />
              
              <ValidationCriterion
                icon={<CheckCircle className="h-4 w-4" />}
                title="🗣️ Coerência com Mentor"
                result={result.coerencia}
                status={result.coerencia.toLowerCase().includes('ok') ? 'ok' : 'warning'}
              />
            </div>

            <div className="p-4 bg-slate-50 rounded-lg">
              <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                💬 Sugestão Final
              </h4>
              <p className="text-sm">{result.sugestaoFinal}</p>
            </div>

            <Button variant="outline" onClick={handleValidate} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Validar Novamente
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StructuredScriptValidation;
