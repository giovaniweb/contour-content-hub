
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SaveIcon, RefreshCw, Code } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface PromptTemplate {
  id: string;
  nome: string;
  tipo: string;
  modelo: string;
  prompt: string;
}

interface PromptEditorProps {
  scriptType?: string;
  onPromptSelect?: (prompt: string) => void;
}

const PromptEditor: React.FC<PromptEditorProps> = ({ 
  scriptType = 'videoScript',
  onPromptSelect 
}) => {
  const [templates, setTemplates] = useState<PromptTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [name, setName] = useState<string>('');
  const [promptContent, setPromptContent] = useState<string>('');
  const [modelName, setModelName] = useState<string>('gpt-4o-mini');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  
  // Buscar templates de prompt quando o componente monta
  useEffect(() => {
    fetchTemplates();
  }, [scriptType]);

  // Buscar templates de prompt do banco de dados
  const fetchTemplates = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('gpt_config')
        .select('*')
        .eq('tipo', scriptType)
        .order('data_configuracao', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      setTemplates(data || []);
      
      // Selecionar o template ativo por padrão
      const activeTemplate = data?.find(template => template.ativo);
      if (activeTemplate) {
        setSelectedTemplateId(activeTemplate.id);
        setName(activeTemplate.nome || '');
        setPromptContent(activeTemplate.prompt || '');
        setModelName(activeTemplate.modelo || 'gpt-4o-mini');
        
        if (onPromptSelect) {
          onPromptSelect(activeTemplate.prompt || '');
        }
      } else if (data && data.length > 0) {
        setSelectedTemplateId(data[0].id);
        setName(data[0].nome || '');
        setPromptContent(data[0].prompt || '');
        setModelName(data[0].modelo || 'gpt-4o-mini');
        
        if (onPromptSelect) {
          onPromptSelect(data[0].prompt || '');
        }
      }
      
    } catch (error) {
      console.error('Erro ao buscar templates de prompt:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os templates de prompt',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Selecionar um template
  const handleSelectTemplate = (id: string) => {
    const template = templates.find(t => t.id === id);
    if (template) {
      setSelectedTemplateId(id);
      setName(template.nome || '');
      setPromptContent(template.prompt || '');
      setModelName(template.modelo || 'gpt-4o-mini');
      
      if (onPromptSelect) {
        onPromptSelect(template.prompt || '');
      }
    }
  };

  // Salvar o template atual
  const handleSaveTemplate = async () => {
    try {
      if (!name.trim()) {
        toast({
          title: 'Nome necessário',
          description: 'Por favor, forneça um nome para o template',
          variant: 'destructive'
        });
        return;
      }

      setIsSaving(true);
      
      let operation;
      if (selectedTemplateId) {
        // Atualizar template existente
        operation = supabase
          .from('gpt_config')
          .update({
            nome: name,
            prompt: promptContent,
            modelo: modelName
          })
          .eq('id', selectedTemplateId);
      } else {
        // Criar novo template
        operation = supabase
          .from('gpt_config')
          .insert({
            nome: name,
            tipo: scriptType,
            prompt: promptContent,
            modelo: modelName
          });
      }
      
      const { error } = await operation;
      
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Sucesso',
        description: selectedTemplateId 
          ? 'Template atualizado com sucesso'
          : 'Novo template criado com sucesso'
      });
      
      fetchTemplates(); // Atualizar a lista
      
    } catch (error) {
      console.error('Erro ao salvar template:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar o template',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Criar um novo template
  const handleNewTemplate = () => {
    setSelectedTemplateId(null);
    setName('');
    setPromptContent(
`Você é um avaliador especialista em marketing digital e copywriting.
Avalie o roteiro fornecido utilizando o método de encantamento Disney:

1. Gancho (Hook): Avalie se o início captura atenção rapidamente e é envolvente.
2. Conflito: Analise se apresenta claramente um problema ou desafio para o público.
3. Virada: Verifique se oferece uma solução convincente para o problema apresentado.
4. CTA (Call to Action): Avalie se finaliza com um chamado à ação claro e persuasivo.

Formato esperado:
{
  "blocos": [
    {
      "tipo": "gancho/conflito/virada/cta",
      "nota": número de 0 a 10,
      "texto": "Trecho relevante",
      "sugestao": "Sugestão de melhoria"
    }
  ],
  "nota_geral": número de 0 a 10,
  "sugestoes_gerais": ["Sugestão 1", "Sugestão 2"],
  "gancho": número de 0 a 10,
  "clareza": número de 0 a 10,
  "cta": número de 0 a 10,
  "emocao": número de 0 a 10,
  "total": número de 0 a 10,
  "sugestoes": "Resumo das principais sugestões"
}`
    );
    setModelName('gpt-4o-mini');
  };

  // Definir um template como ativo (padrão)
  const handleSetActive = async (id: string) => {
    try {
      setIsLoading(true);
      
      // Primeiro, desativa todos
      await supabase
        .from('gpt_config')
        .update({ ativo: false })
        .eq('tipo', scriptType);
      
      // Depois, ativa o selecionado
      const { error } = await supabase
        .from('gpt_config')
        .update({ ativo: true })
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Sucesso',
        description: 'Template definido como padrão'
      });
      
      fetchTemplates(); // Atualizar a lista
      
    } catch (error) {
      console.error('Erro ao definir template ativo:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível definir o template como padrão',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Templates de Prompt</h3>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleNewTemplate}
          >
            Novo Template
          </Button>
        </div>
        
        {templates.length > 0 ? (
          <div>
            <Select 
              value={selectedTemplateId || undefined} 
              onValueChange={handleSelectTemplate}
              disabled={isLoading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione um template" />
              </SelectTrigger>
              <SelectContent>
                {templates.map((template) => (
                  <SelectItem 
                    key={template.id} 
                    value={template.id}
                  >
                    {template.nome} {template.ativo ? '(Ativo)' : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {selectedTemplateId && (
              <div className="mt-2 flex justify-end">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleSetActive(selectedTemplateId)}
                  disabled={isLoading || templates.find(t => t.id === selectedTemplateId)?.ativo}
                >
                  Definir como Padrão
                </Button>
              </div>
            )}
          </div>
        ) : (
          !isLoading && (
            <Card>
              <CardContent className="p-4">
                <p className="text-center text-muted-foreground">
                  Nenhum template encontrado. Crie um novo template.
                </p>
              </CardContent>
            </Card>
          )
        )}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            {selectedTemplateId ? 'Editar Template' : 'Novo Template'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nome do Template</label>
            <Input 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Ex: Avaliação Método Disney"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Modelo da IA</label>
            <Select 
              value={modelName} 
              onValueChange={setModelName}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4o-mini">GPT-4o Mini (Rápido)</SelectItem>
                <SelectItem value="gpt-4o">GPT-4o (Melhor Qualidade)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Conteúdo do Prompt</label>
            <Textarea 
              value={promptContent} 
              onChange={(e) => setPromptContent(e.target.value)} 
              className="min-h-[300px] font-mono text-sm"
              placeholder="Insira o prompt para a IA..."
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button 
            onClick={handleSaveTemplate} 
            disabled={isSaving || !name.trim()}
          >
            {isSaving ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <SaveIcon className="h-4 w-4 mr-2" />
                Salvar Template
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PromptEditor;
