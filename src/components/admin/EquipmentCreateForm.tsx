import React, { useState, useEffect } from 'react';
import { Equipment, EquipmentCreationProps, validateEquipment, hasValidationErrors, ValidationErrors, saveEquipmentDraft, getEquipmentDraft, clearEquipmentDraft, convertStringToArray } from '@/types/equipment';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Save, Plus, Upload, Image as ImageIcon, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface EquipmentCreateFormProps {
  onSuccess?: (equipment: Equipment) => void;
  onCancel?: () => void;
}

const EquipmentCreateForm: React.FC<EquipmentCreateFormProps> = ({ onSuccess, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const [errors, setErrors] = useState<ValidationErrors>({});
  
  const [equipment, setEquipment] = useState<EquipmentCreationProps>({
    nome: '',
    descricao: '',
    categoria: 'estetico',
    tecnologia: '',
    indicacoes: [],
    beneficios: '',
    diferenciais: '',
    linguagem: '',
    ativo: true,
    image_url: '',
    efeito: '',
    // Add new fields with default values
    thumbnail_url: '',
    area_aplicacao: [],
    tipo_acao: undefined,
    possui_consumiveis: false,
    contraindicacoes: [],
    perfil_ideal_paciente: [],
    nivel_investimento: undefined,
    akinator_enabled: true,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [hasDraft, setHasDraft] = useState(false);
  const [draftTimestamp, setDraftTimestamp] = useState<string | null>(null);

  // Check for draft on component mount
  useEffect(() => {
    const draft = getEquipmentDraft();
    if (draft) {
      setHasDraft(true);
      setDraftTimestamp(draft.timestamp);
      
      // If there's an image URL in the draft, set the preview
      if (draft.data.image_url) {
        setImagePreview(draft.data.image_url as string);
      }
    }
  }, []);

  // Save draft as user types - use debounce to avoid saving too frequently
  useEffect(() => {
    const saveTimeout = setTimeout(() => {
      if (equipment.nome || equipment.tecnologia || equipment.beneficios) {
        saveEquipmentDraft(equipment);
        setHasDraft(true);
        setDraftTimestamp(new Date().toISOString());
      }
    }, 2000); // Save after 2 seconds of inactivity
    
    return () => clearTimeout(saveTimeout);
  }, [equipment]);

  // Function to load saved draft
  const loadDraft = () => {
    const draft = getEquipmentDraft();
    if (draft) {
      // Set equipment with draft data
      setEquipment(draft.data as EquipmentCreationProps);
      
      // Set image preview if available
      if (draft.data.image_url) {
        setImagePreview(draft.data.image_url as string);
      }
      
      toast({
        title: "Rascunho carregado",
        description: "Os dados do seu último rascunho foram restaurados."
      });
    }
  };

  // Function to discard draft
  const discardDraft = () => {
    clearEquipmentDraft();
    setHasDraft(false);
    setEquipment({
      nome: '',
      descricao: '',
      categoria: 'estetico', // Reset to valid default value
      tecnologia: '',
      indicacoes: [],
      beneficios: '',
      diferenciais: '',
      linguagem: '',
      ativo: true,
      image_url: '',
      efeito: '',
      // Add new fields with default values
      thumbnail_url: '',
      area_aplicacao: [],
      tipo_acao: undefined,
      possui_consumiveis: false,
      contraindicacoes: [],
      perfil_ideal_paciente: [],
      nivel_investimento: undefined,
      akinator_enabled: true,
    });
    setImagePreview(null);
    
    toast({
      title: "Rascunho descartado",
      description: "O formulário foi limpo."
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEquipment(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user types
    if (errors[name as keyof ValidationErrors]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof ValidationErrors];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setEquipment(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user selects
    if (errors[name as keyof ValidationErrors]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof ValidationErrors];
        return newErrors;
      });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        variant: "destructive",
        title: "Formato inválido",
        description: "Por favor, envie apenas arquivos de imagem."
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "Arquivo muito grande",
        description: "O tamanho máximo permitido é de 5MB."
      });
      return;
    }

    try {
      setIsUploading(true);
      
      // Generate preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `equipment/${fileName}`;

      // Upload to Supabase storage
      const { data, error } = await supabase
        .storage
        .from('images')
        .upload(filePath, file);

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase
        .storage
        .from('images')
        .getPublicUrl(filePath);

      // Update equipment with image URL
      setEquipment(prev => ({ ...prev, image_url: publicUrl }));
      
      toast({
        title: "Imagem enviada",
        description: "A imagem foi carregada com sucesso."
      });
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      toast({
        variant: "destructive",
        title: "Erro no upload",
        description: "Não foi possível enviar a imagem. Tente novamente."
      });
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setEquipment(prev => ({ ...prev, image_url: '' }));
  };

  // Format the timestamp to a readable date/time
  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (error) {
      return 'data desconhecida';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = validateEquipment(equipment);
    if (hasValidationErrors(validationErrors)) {
      setErrors(validationErrors);
      toast({
        variant: "destructive",
        title: "Erro de validação",
        description: "Por favor, corrija os campos destacados."
      });
      return;
    }

    // Process data for creating Equipment
    const processedEquipment: Equipment = {
      id: 'new-' + Date.now(), // Temporary ID to satisfy the type
      nome: equipment.nome,
      descricao: equipment.descricao || '',
      categoria: equipment.categoria,
      tecnologia: equipment.tecnologia || '',
      indicacoes: convertStringToArray(equipment.indicacoes),
      beneficios: equipment.beneficios || '',
      diferenciais: equipment.diferenciais || '',
      linguagem: equipment.linguagem || '',
      ativo: equipment.ativo !== undefined ? equipment.ativo : true,
      image_url: equipment.image_url || '',
      efeito: equipment.efeito || '',
      data_cadastro: new Date().toISOString(),
      // Include new required fields
      thumbnail_url: equipment.thumbnail_url || '',
      area_aplicacao: equipment.area_aplicacao || [],
      tipo_acao: equipment.tipo_acao,
      possui_consumiveis: equipment.possui_consumiveis || false,
      contraindicacoes: equipment.contraindicacoes || [],
      perfil_ideal_paciente: equipment.perfil_ideal_paciente || [],
      nivel_investimento: equipment.nivel_investimento,
      akinator_enabled: equipment.akinator_enabled !== undefined ? equipment.akinator_enabled : true,
    };

    try {
      setIsSubmitting(true);
      console.log('Enviando dados do equipamento:', processedEquipment);
      
      // Simula criação de equipamento
      const newEquipment: Equipment = {
        ...processedEquipment,
        id: `new-${Date.now()}`,
        data_cadastro: new Date().toISOString()
      };
      
      // Clear draft after successful submit
      clearEquipmentDraft();
      setHasDraft(false);
      
      toast({
        title: "Equipamento cadastrado",
        description: `${newEquipment.nome} foi adicionado com sucesso.`
      });
      
      if (onSuccess) {
        onSuccess(newEquipment);
      }
    } catch (error) {
      console.error('Erro ao cadastrar equipamento:', error);
      // Save as draft automatically when error occurs
      saveEquipmentDraft(equipment);
      
      toast({
        variant: "destructive",
        title: "Erro ao cadastrar",
        description: "Não foi possível adicionar o equipamento. Seus dados foram salvos como rascunho."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Manual save draft function
  const saveDraft = () => {
    saveEquipmentDraft(equipment);
    setHasDraft(true);
    setDraftTimestamp(new Date().toISOString());
    
    toast({
      title: "Rascunho salvo",
      description: "Seus dados foram salvos como rascunho."
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <Plus className="h-5 w-5 mr-2" />
          Cadastrar Novo Equipamento
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Show draft notification if available */}
        {hasDraft && (
          <Alert className="mb-4 bg-blue-50 border-blue-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <AlertDescription className="text-blue-800">
                Existe um rascunho salvo em {draftTimestamp && formatTimestamp(draftTimestamp)}. Deseja recuperá-lo?
              </AlertDescription>
              <div className="flex gap-2 ml-auto">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={discardDraft}
                >
                  Descartar
                </Button>
                <Button 
                  type="button" 
                  variant="default" 
                  size="sm"
                  onClick={loadDraft}
                >
                  Recuperar
                </Button>
              </div>
            </div>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nome" className={errors.nome ? "text-destructive" : ""}>
              Nome do Equipamento
            </Label>
            <Input 
              id="nome"
              name="nome"
              value={equipment.nome}
              onChange={handleChange}
              placeholder="Ex: Ultralift HIFU"
              className={`mt-1 ${errors.nome ? "border-destructive" : ""}`}
            />
            {errors.nome && (
              <p className="text-destructive text-sm mt-1">{errors.nome}</p>
            )}
          </div>
          
          {/* Categoria field */}
          <div>
            <Label htmlFor="categoria" className={errors.categoria ? "text-destructive" : ""}>
              Categoria
            </Label>
            <Select 
              value={equipment.categoria} 
              onValueChange={(value) => handleSelectChange('categoria', value)}
            >
              <SelectTrigger className={`mt-1 ${errors.categoria ? "border-destructive" : ""}`}>
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="estetico">🌟 Estético</SelectItem>
                <SelectItem value="medico">🏥 Médico</SelectItem>
              </SelectContent>
            </Select>
            {errors.categoria && (
              <p className="text-destructive text-sm mt-1">{errors.categoria}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="efeito" className={errors.efeito ? "text-destructive" : ""}>
              Efeito (Frase de efeito/Tagline)
            </Label>
            <Input 
              id="efeito"
              name="efeito"
              value={equipment.efeito || ''}
              onChange={handleChange}
              placeholder="Ex: Supremacia tecnológica para tratamentos corporais e faciais"
              className={`mt-1 ${errors.efeito ? "border-destructive" : ""}`}
            />
            {errors.efeito && (
              <p className="text-destructive text-sm mt-1">{errors.efeito}</p>
            )}
          </div>
          
          <div>
            <Label>Imagem do Equipamento</Label>
            <div className="mt-2">
              {!imagePreview ? (
                <div className="border border-dashed rounded-lg p-6 flex flex-col items-center justify-center bg-muted/50">
                  <Label 
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center cursor-pointer"
                  >
                    <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground mb-1">
                      Clique para adicionar uma imagem
                    </span>
                    <span className="text-xs text-muted-foreground">
                      JPEG, PNG ou GIF (máx. 5MB)
                    </span>
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </Label>
                </div>
              ) : (
                <div className="relative">
                  <img 
                    src={imagePreview} 
                    alt="Preview da imagem do equipamento" 
                    className="max-h-60 rounded-lg object-contain border p-1"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 rounded-full"
                    onClick={removeImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              {isUploading && (
                <div className="flex items-center justify-center mt-2">
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  <span className="text-sm">Enviando imagem...</span>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <Label htmlFor="tecnologia" className={errors.tecnologia ? "text-destructive" : ""}>
              Tecnologia
            </Label>
            <Textarea 
              id="tecnologia"
              name="tecnologia"
              value={equipment.tecnologia}
              onChange={handleChange}
              placeholder="Descreva a tecnologia do equipamento..."
              className={`mt-1 h-24 ${errors.tecnologia ? "border-destructive" : ""}`}
            />
            {errors.tecnologia && (
              <p className="text-destructive text-sm mt-1">{errors.tecnologia}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="indicacoes" className={errors.indicacoes ? "text-destructive" : ""}>
              Indicações
            </Label>
            <Textarea 
              id="indicacoes"
              name="indicacoes"
              value={equipment.indicacoes}
              onChange={handleChange}
              placeholder="Liste as indicações e usos do equipamento..."
              className={`mt-1 h-24 ${errors.indicacoes ? "border-destructive" : ""}`}
            />
            {errors.indicacoes && (
              <p className="text-destructive text-sm mt-1">{errors.indicacoes}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="beneficios" className={errors.beneficios ? "text-destructive" : ""}>
              Benefícios
            </Label>
            <Textarea 
              id="beneficios"
              name="beneficios"
              value={equipment.beneficios}
              onChange={handleChange}
              placeholder="Descreva os benefícios do tratamento..."
              className={`mt-1 h-24 ${errors.beneficios ? "border-destructive" : ""}`}
            />
            {errors.beneficios && (
              <p className="text-destructive text-sm mt-1">{errors.beneficios}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="diferenciais" className={errors.diferenciais ? "text-destructive" : ""}>
              Diferenciais
            </Label>
            <Textarea 
              id="diferenciais"
              name="diferenciais"
              value={equipment.diferenciais}
              onChange={handleChange}
              placeholder="Descreva os diferenciais deste equipamento..."
              className={`mt-1 h-24 ${errors.diferenciais ? "border-destructive" : ""}`}
            />
            {errors.diferenciais && (
              <p className="text-destructive text-sm mt-1">{errors.diferenciais}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="linguagem" className={errors.linguagem ? "text-destructive" : ""}>
              Linguagem Recomendada
            </Label>
            <Textarea 
              id="linguagem"
              name="linguagem"
              value={equipment.linguagem}
              onChange={handleChange}
              placeholder="Descreva a linguagem recomendada para falar deste equipamento..."
              className={`mt-1 h-24 ${errors.linguagem ? "border-destructive" : ""}`}
            />
            {errors.linguagem && (
              <p className="text-destructive text-sm mt-1">{errors.linguagem}</p>
            )}
          </div>
          
          <div className="flex justify-between space-x-3 pt-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={saveDraft}
              disabled={isSubmitting || isUploading}
            >
              <Save className="mr-2 h-4 w-4" />
              Salvar rascunho
            </Button>
            
            <div className="flex space-x-3">
              {onCancel && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onCancel}
                  disabled={isSubmitting || isUploading}
                >
                  Cancelar
                </Button>
              )}
              <Button 
                type="submit" 
                disabled={isSubmitting || isUploading}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Cadastrando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Equipamento
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EquipmentCreateForm;
