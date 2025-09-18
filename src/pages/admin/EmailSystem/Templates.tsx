import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Plus, 
  Edit, 
  Eye, 
  Trash2, 
  Search, 
  Filter,
  Save,
  Code,
  Palette
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface EmailTemplate {
  id: string;
  template_type: string;
  subject: string;
  html_content: string;
  text_content?: string;
  variables: any;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const EmailTemplates: React.FC = () => {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [newTemplate, setNewTemplate] = useState<Partial<EmailTemplate>>({
    template_type: '',
    subject: '',
    html_content: '',
    text_content: '',
    variables: {},
    is_active: true
  });

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('academy_email_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar templates",
        description: "Não foi possível carregar os templates de email."
      });
    } finally {
      setLoading(false);
    }
  };

  const saveTemplate = async () => {
    try {
      if (selectedTemplate) {
        // Update existing template
        const { error } = await supabase
          .from('academy_email_templates')
          .update({
            subject: selectedTemplate.subject,
            html_content: selectedTemplate.html_content,
            text_content: selectedTemplate.text_content,
            variables: selectedTemplate.variables,
            is_active: selectedTemplate.is_active
          })
          .eq('id', selectedTemplate.id);

        if (error) throw error;
        
        toast({
          title: "Template atualizado",
          description: "O template foi atualizado com sucesso."
        });
      } else {
        // Create new template
        const { error } = await supabase
          .from('academy_email_templates')
          .insert({
            template_type: newTemplate.template_type,
            subject: newTemplate.subject,
            html_content: newTemplate.html_content,
            text_content: newTemplate.text_content,
            variables: newTemplate.variables || {},
            is_active: newTemplate.is_active
          });

        if (error) throw error;
        
        toast({
          title: "Template criado",
          description: "O novo template foi criado com sucesso."
        });
      }
      
      loadTemplates();
      setEditMode(false);
      setSelectedTemplate(null);
      setNewTemplate({
        template_type: '',
        subject: '',
        html_content: '',
        text_content: '',
        variables: {},
        is_active: true
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Não foi possível salvar o template."
      });
    }
  };

  const deleteTemplate = async (templateId: string) => {
    if (!confirm('Tem certeza que deseja excluir este template?')) return;

    try {
      const { error } = await supabase
        .from('academy_email_templates')
        .delete()
        .eq('id', templateId);

      if (error) throw error;
      
      toast({
        title: "Template excluído",
        description: "O template foi excluído com sucesso."
      });
      
      loadTemplates();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao excluir",
        description: "Não foi possível excluir o template."
      });
    }
  };

  const filteredTemplates = templates.filter(template =>
    template.template_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const templateTypes = [
    { value: 'welcome', label: 'Boas-vindas' },
    { value: 'newsletter', label: 'Newsletter' },
    { value: 'course_invitation', label: 'Convite Curso' },
    { value: 'course_completion', label: 'Conclusão Curso' },
    { value: 'password_reset', label: 'Reset Senha' },
    { value: 'notification', label: 'Notificação' },
    { value: 'promotion', label: 'Promoção' },
    { value: 'reminder', label: 'Lembrete' }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light aurora-text-gradient">
            Templates de Email
          </h1>
          <p className="text-slate-400 aurora-body mt-2">
            Gerencie templates para emails automáticos
          </p>
        </div>
        <Button 
          onClick={() => setEditMode(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Novo Template
        </Button>
      </div>

      {/* Search and Filter */}
      <Card className="aurora-card">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Buscar templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Templates List */}
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="aurora-loading-enhanced rounded-full h-8 w-8 border-b-2 border-aurora-electric-purple animate-spin mx-auto"></div>
              <p className="text-slate-400 mt-2">Carregando templates...</p>
            </div>
          ) : (
            filteredTemplates.map((template) => (
              <Card key={template.id} className="aurora-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{template.subject}</h3>
                        <Badge 
                          variant={template.is_active ? "default" : "secondary"}
                          className={template.is_active ? "bg-aurora-emerald" : ""}
                        >
                          {template.is_active ? 'Ativo' : 'Inativo'}
                        </Badge>
                        <Badge variant="outline">
                          {templateTypes.find(t => t.value === template.template_type)?.label || template.template_type}
                        </Badge>
                      </div>
                      <div className="text-sm text-slate-400">
                        Atualizado em {new Date(template.updated_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedTemplate(template);
                          setEditMode(false);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedTemplate(template);
                          setEditMode(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteTemplate(template.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Template Editor/Viewer */}
        <div className="space-y-6">
          <Card className="aurora-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {editMode ? (
                  <>
                    <Edit className="h-5 w-5 text-aurora-electric-purple" />
                    {selectedTemplate ? 'Editar Template' : 'Novo Template'}
                  </>
                ) : (
                  <>
                    <Eye className="h-5 w-5 text-aurora-neon-blue" />
                    Preview do Template
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {editMode ? (
                <>
                  {/* Template Type */}
                  <div className="space-y-2">
                    <Label>Tipo de Template</Label>
                    <select
                      className="w-full p-2 rounded border bg-background"
                      value={selectedTemplate?.template_type || newTemplate.template_type}
                      onChange={(e) => {
                        if (selectedTemplate) {
                          setSelectedTemplate({ ...selectedTemplate, template_type: e.target.value });
                        } else {
                          setNewTemplate({ ...newTemplate, template_type: e.target.value });
                        }
                      }}
                    >
                      <option value="">Selecione o tipo</option>
                      {templateTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Subject */}
                  <div className="space-y-2">
                    <Label>Assunto</Label>
                    <Input
                      value={selectedTemplate?.subject || newTemplate.subject}
                      onChange={(e) => {
                        if (selectedTemplate) {
                          setSelectedTemplate({ ...selectedTemplate, subject: e.target.value });
                        } else {
                          setNewTemplate({ ...newTemplate, subject: e.target.value });
                        }
                      }}
                      placeholder="Assunto do email"
                    />
                  </div>

                  {/* HTML Content */}
                  <div className="space-y-2">
                    <Label>Conteúdo HTML</Label>
                    <Textarea
                      value={selectedTemplate?.html_content || newTemplate.html_content}
                      onChange={(e) => {
                        if (selectedTemplate) {
                          setSelectedTemplate({ ...selectedTemplate, html_content: e.target.value });
                        } else {
                          setNewTemplate({ ...newTemplate, html_content: e.target.value });
                        }
                      }}
                      placeholder="<h1>Olá {{ user.name }}!</h1><p>Bem-vindo...</p>"
                      rows={8}
                      className="font-mono"
                    />
                  </div>

                  {/* Text Content */}
                  <div className="space-y-2">
                    <Label>Conteúdo Texto (Fallback)</Label>
                    <Textarea
                      value={selectedTemplate?.text_content || newTemplate.text_content || ''}
                      onChange={(e) => {
                        if (selectedTemplate) {
                          setSelectedTemplate({ ...selectedTemplate, text_content: e.target.value });
                        } else {
                          setNewTemplate({ ...newTemplate, text_content: e.target.value });
                        }
                      }}
                      placeholder="Olá {{ user.name }}! Bem-vindo..."
                      rows={4}
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={saveTemplate}
                      className="flex items-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      Salvar
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditMode(false);
                        setSelectedTemplate(null);
                        setNewTemplate({
                          template_type: '',
                          subject: '',
                          html_content: '',
                          text_content: '',
                          variables: {},
                          is_active: true
                        });
                      }}
                    >
                      Cancelar
                    </Button>
                  </div>
                </>
              ) : selectedTemplate ? (
                <>
                  {/* Template Preview */}
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">Assunto:</Label>
                      <p className="text-sm mt-1">{selectedTemplate.subject}</p>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Tipo:</Label>
                      <Badge variant="outline" className="ml-2">
                        {templateTypes.find(t => t.value === selectedTemplate.template_type)?.label || selectedTemplate.template_type}
                      </Badge>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Conteúdo HTML:</Label>
                      <div className="bg-slate-900 p-3 rounded mt-1 max-h-32 overflow-y-auto">
                        <code className="text-xs text-slate-300 whitespace-pre-wrap">
                          {selectedTemplate.html_content}
                        </code>
                      </div>
                    </div>

                    {selectedTemplate.text_content && (
                      <div>
                        <Label className="text-sm font-medium">Conteúdo Texto:</Label>
                        <div className="bg-slate-900 p-3 rounded mt-1 max-h-20 overflow-y-auto">
                          <code className="text-xs text-slate-300 whitespace-pre-wrap">
                            {selectedTemplate.text_content}
                          </code>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-slate-400">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Selecione um template para visualizar ou editar</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Variables Helper */}
          <Card className="aurora-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5 text-aurora-neon-blue" />
                Variáveis Disponíveis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div><code>{'{{ user.name }}'}</code> - Nome do usuário</div>
              <div><code>{'{{ user.email }}'}</code> - Email do usuário</div>
              <div><code>{'{{ user.role }}'}</code> - Papel do usuário</div>
              <div><code>{'{{ course.name }}'}</code> - Nome do curso</div>
              <div><code>{'{{ invite.token }}'}</code> - Token de convite</div>
              <div><code>{'{{ company.name }}'}</code> - Nome da empresa</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmailTemplates;