import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TagInput } from "@/components/ui/tag-input";
import ApplicatorsTab from "./ApplicatorsTab";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { 
  Equipment, 
  EquipmentApplicator,
  validateEquipment, 
  hasValidationErrors,
  saveEquipmentDraft,
  getEquipmentDraft,
  clearEquipmentDraft,
  convertStringToArray
} from '@/types/equipment';
import { AlertCircle, CheckCircle2, Upload, X, Loader2, Image as ImageIcon, Save, HelpCircle } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export interface EquipmentFormProps {
  equipment?: Equipment;
  onSave: (equipment: Equipment) => Promise<void>;
  onCancel: () => void;
}

const EquipmentForm: React.FC<EquipmentFormProps> = ({ equipment, onSave, onCancel }) => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(equipment?.image_url || null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(equipment?.thumbnail_url || null);
  const [hasDraft, setHasDraft] = useState(false);
  const [draftTimestamp, setDraftTimestamp] = useState<string | null>(null);
  const [applicators, setApplicators] = useState<EquipmentApplicator[]>([]);
  const [activeTab, setActiveTab] = useState('basic');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  
  // Initialize form with equipment data or default values
  const form = useForm<Equipment>({
    defaultValues: equipment || {
      id: 'new',
      nome: '',
      tecnologia: '',
      indicacoes: [],
      beneficios: '',
      diferenciais: '',
      linguagem: '',
      image_url: '',
      ativo: true,
      efeito: '',
      categoria: 'estetico',
      thumbnail_url: '',
      area_aplicacao: [],
      tipo_acao: undefined,
      possui_consumiveis: false,
      contraindicacoes: [],
      perfil_ideal_paciente: [],
      nivel_investimento: undefined,
      akinator_enabled: true,
    } as Equipment
  });

  // Check for draft on component mount
  useEffect(() => {
    // Only check for draft if we're creating a new equipment (not editing)
    if (!equipment) {
      const draft = getEquipmentDraft();
      if (draft) {
        setHasDraft(true);
        setDraftTimestamp(draft.timestamp);
        
        // If there's an image URL in the draft, set the preview
        if (draft.data.image_url) {
          setImagePreview(draft.data.image_url as string);
        }
      }
    }
  }, [equipment]);

  // Save draft as user types - use debounce to avoid saving too frequently
  useEffect(() => {
    if (!equipment) { // Only save drafts for new equipment, not when editing
      const saveTimeout = setTimeout(() => {
        const currentValues = form.getValues();
        if (currentValues.nome || currentValues.tecnologia || currentValues.beneficios) {
          saveEquipmentDraft(currentValues);
          setHasDraft(true);
          setDraftTimestamp(new Date().toISOString());
        }
      }, 1000); // Save after 1 second of inactivity
      
      return () => clearTimeout(saveTimeout);
    }
  }, [form.watch(), equipment]);

  // Function to load saved draft
  const loadDraft = () => {
    const draft = getEquipmentDraft();
    if (draft) {
      // Reset form with draft data
      form.reset({
        id: 'new', // Add dummy ID for type safety
        nome: draft.data.nome as string || '',
        tecnologia: draft.data.tecnologia as string || '',
        indicacoes: convertStringToArray(draft.data.indicacoes),
        beneficios: draft.data.beneficios as string || '',
        diferenciais: draft.data.diferenciais as string || '',
        linguagem: draft.data.linguagem as string || '',
        image_url: draft.data.image_url as string || '',
        ativo: true,
        efeito: draft.data.efeito as string || '',
        categoria: draft.data.categoria as string || 'estetico'
      } as Equipment);
      
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
    form.reset({
      id: 'new', // Add dummy ID for type safety
      nome: '',
      tecnologia: '',
      indicacoes: [],
      beneficios: '',
      diferenciais: '',
      linguagem: '',
      image_url: '',
      ativo: true,
      efeito: '',
      categoria: 'estetico'
    } as Equipment);
    setImagePreview(null);
    
    toast({
      title: "Rascunho descartado",
      description: "O formulário foi limpo."
    });
  };

  // Function to handle image upload (generic)
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'main' | 'thumbnail') => {
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
        if (type === 'main') {
          setImagePreview(reader.result as string);
        } else {
          setThumbnailPreview(reader.result as string);
        }
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

      // Update form with image URL
      if (type === 'main') {
        form.setValue('image_url', publicUrl);
      } else {
        form.setValue('thumbnail_url', publicUrl);
      }
      
      toast({
        title: "Imagem enviada",
        description: `A ${type === 'main' ? 'imagem principal' : 'imagem de capa'} foi carregada com sucesso.`
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

  // Function to remove images
  const handleRemoveImage = (type: 'main' | 'thumbnail') => {
    if (type === 'main') {
      setImagePreview(null);
      form.setValue('image_url', '');
    } else {
      setThumbnailPreview(null);
      form.setValue('thumbnail_url', '');
    }
  };

  const handleSubmit = async (data: Equipment) => {
    try {
      // Validação manual adicional
      const validationErrors = validateEquipment(data);
      if (hasValidationErrors(validationErrors)) {
        // Exibir erros de validação
        for (const [field, message] of Object.entries(validationErrors)) {
          form.setError(field as any, { 
            type: "manual", 
            message 
          });
        }
        return;
      }

      setIsSaving(true);
      
      // Convert indicacoes to array if it's a string
      if (typeof data.indicacoes === 'string') {
        data.indicacoes = convertStringToArray(data.indicacoes);
      }
      
      await onSave(data);
      
      if (!equipment) {
        // Clear draft after successful new equipment creation
        clearEquipmentDraft();
        setHasDraft(false);
      }
      
      toast({
        title: equipment ? "Equipamento atualizado" : "Equipamento cadastrado",
        description: `${data.nome} foi ${equipment ? "atualizado" : "cadastrado"} com sucesso.`
      });
    } catch (error) {
      console.error(`Erro ao ${equipment ? "atualizar" : "cadastrar"} equipamento:`, error);
      toast({
        variant: "destructive",
        title: `Erro ao ${equipment ? "atualizar" : "cadastrar"} equipamento`,
        description: `Não foi possível ${equipment ? "atualizar" : "adicionar"} o equipamento.`
      });
    } finally {
      setIsSaving(false);
    }
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

  return (
    <TooltipProvider>
      <Form {...form}>
        {/* Show draft notification if available */}
        {!equipment && hasDraft && (
          <Alert className="mb-4 bg-slate-800/50 border-slate-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <AlertDescription className="text-white">
                Existe um rascunho salvo em {draftTimestamp && formatTimestamp(draftTimestamp)}. Deseja recuperá-lo?
              </AlertDescription>
              <div className="flex gap-2 ml-auto">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={discardDraft}
                  className="border-slate-600 hover:bg-slate-700 text-white"
                >
                  Descartar
                </Button>
                <Button 
                  type="button" 
                  variant="default" 
                  size="sm"
                  onClick={loadDraft}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Recuperar
                </Button>
              </div>
            </div>
          </Alert>
        )}
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 border-slate-700">
            <TabsTrigger value="basic" className="text-white data-[state=active]:bg-slate-700 data-[state=active]:text-white">
              Informações Básicas
            </TabsTrigger>
            <TabsTrigger value="applicators" className="text-white data-[state=active]:bg-slate-700 data-[state=active]:text-white">
              Configurações Avançadas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6 mt-6">
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="nome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Nome do Equipamento*</FormLabel>
                        <FormControl>
                          <Input 
                            required 
                            {...field} 
                            placeholder="Ex: Hipro" 
                            className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                          />
                        </FormControl>
                        <FormMessage className="text-red-300" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="categoria"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Categoria*</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                              <SelectValue placeholder="Selecione a categoria" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-slate-800 border-slate-700">
                            <SelectItem value="estetico" className="text-white hover:bg-slate-700">🌟 Estético</SelectItem>
                            <SelectItem value="medico" className="text-white hover:bg-slate-700">🏥 Médico</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-red-300" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="efeito"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Efeito (Frase de efeito/Tagline)</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="Ex: Supremacia tecnológica para tratamentos corporais e faciais" 
                            className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                          />
                        </FormControl>
                        <FormMessage className="text-red-300" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tecnologia"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Tecnologia*</FormLabel>
                        <FormControl>
                          <Textarea 
                            required 
                            {...field} 
                            placeholder="Ex: HIFU – Ultrassom Focalizado de Alta Intensidade" 
                            rows={2}
                            className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                          />
                        </FormControl>
                        <FormMessage className="text-red-300" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="indicacoes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Indicações*</FormLabel>
                        <FormControl>
                          <Textarea 
                            required 
                            {...field} 
                            placeholder="Ex: Lifting facial não-cirúrgico; Redução de rugas profundas" 
                            rows={3}
                            className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                          />
                        </FormControl>
                        <FormMessage className="text-red-300" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  {/* Thumbnail Upload Section */}
                  <div>
                    <Label className="flex items-center gap-2 text-white">
                      Imagem de Capa / Thumbnail
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-4 w-4 text-slate-400" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-slate-800 border-slate-700">
                          <p className="text-white">Imagem usada como miniatura nas listagens e no Fluida Akinator</p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <div className="mt-2">
                      <input 
                        ref={thumbnailInputRef}
                        type="file" 
                        onChange={(e) => handleImageUpload(e, 'thumbnail')}
                        accept="image/*"
                        className="hidden"
                      />

                      {!thumbnailPreview ? (
                        <div 
                          onClick={() => thumbnailInputRef.current?.click()}
                          className="border-2 border-dashed border-slate-600 bg-slate-700/50 rounded-md p-4 flex flex-col items-center justify-center cursor-pointer hover:border-slate-500 transition-colors h-32"
                        >
                          <ImageIcon className="h-8 w-8 text-slate-400 mb-2" />
                          <p className="text-sm text-white text-center">Clique para enviar thumbnail</p>
                          <p className="text-xs text-slate-400 mt-1">JPG, PNG (máximo 5MB)</p>
                        </div>
                      ) : (
                        <div className="relative border border-slate-600 bg-slate-700/50 rounded-md overflow-hidden">
                          <img 
                            src={thumbnailPreview} 
                            alt="Preview do thumbnail" 
                            className="w-full h-32 object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage('thumbnail')}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Main Image Upload Section */}
                  <div>
                    <Label className="text-white">Imagem Principal do Equipamento</Label>
                    <div className="mt-2">
                      <input 
                        ref={fileInputRef}
                        type="file" 
                        onChange={(e) => handleImageUpload(e, 'main')}
                        accept="image/*"
                        className="hidden"
                      />

                      {!imagePreview ? (
                        <div 
                          onClick={() => fileInputRef.current?.click()}
                          className="border-2 border-dashed border-slate-600 bg-slate-700/50 rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:border-slate-500 transition-colors"
                        >
                          <ImageIcon className="h-10 w-10 text-slate-400 mb-2" />
                          <p className="text-sm text-white text-center">Clique para fazer upload da imagem principal</p>
                          <p className="text-xs text-slate-400 mt-1">JPG, PNG ou GIF (máximo 5MB)</p>
                        </div>
                      ) : (
                        <div className="relative border border-slate-600 bg-slate-700/50 rounded-md overflow-hidden">
                          <img 
                            src={imagePreview} 
                            alt="Preview da imagem" 
                            className="w-full h-40 object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage('main')}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="beneficios"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Benefícios*</FormLabel>
                        <FormControl>
                          <Textarea 
                            required 
                            {...field} 
                            placeholder="Ex: Efeito lifting visível sem cortes ou agulhas" 
                            rows={3}
                            className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                          />
                        </FormControl>
                        <FormMessage className="text-red-300" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="diferenciais"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Diferenciais*</FormLabel>
                        <FormControl>
                          <Textarea 
                            required 
                            {...field} 
                            placeholder="Ex: Focaliza energia ultrassônica em pontos profundos precisos" 
                            rows={3}
                            className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                          />
                        </FormControl>
                        <FormMessage className="text-red-300" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name="linguagem"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Linguagem Recomendada*</FormLabel>
                    <FormControl>
                      <Textarea 
                        required 
                        {...field} 
                        placeholder="Ex: Convincente e elegante, passando segurança sobre obter rejuvenescimento sem cirurgia" 
                        rows={2}
                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                      />
                    </FormControl>
                    <FormMessage className="text-red-300" />
                  </FormItem>
                )}
              />

              {/* Configurações Avançadas */}
              <div className="border-t border-slate-700 pt-6">
                <h3 className="text-lg font-medium mb-4 flex items-center gap-2 text-white">
                  Configurações Avançadas
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-slate-400" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-slate-800 border-slate-700">
                      <p className="text-white">Dados utilizados pela IA para sugestões e recomendações</p>
                    </TooltipContent>
                  </Tooltip>
                </h3>

                <FormField
                  control={form.control}
                  name="area_aplicacao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Área de Aplicação</FormLabel>
                      <FormDescription className="text-slate-400">Selecione onde o equipamento pode ser aplicado</FormDescription>
                      <div className="space-y-2">
                        {['Rosto', 'Corpo', 'Ambos'].map((area) => (
                          <div key={area} className="flex items-center space-x-2">
                            <Checkbox
                              id={`area-${area}`}
                              checked={field.value?.includes(area) || false}
                              onCheckedChange={(checked) => {
                                const current = field.value || [];
                                if (checked) {
                                  field.onChange([...current, area]);
                                } else {
                                  field.onChange(current.filter(item => item !== area));
                                }
                              }}
                            />
                            <Label htmlFor={`area-${area}`} className="text-white">{area}</Label>
                          </div>
                        ))}
                      </div>
                      <FormMessage className="text-red-300" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tipo_acao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Tipo de Ação</FormLabel>
                      <FormDescription className="text-slate-400">Classifica o nível de intervenção do tratamento</FormDescription>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                            <SelectValue placeholder="Selecione o tipo de ação" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="Não invasivo" className="text-white hover:bg-slate-700">Não invasivo</SelectItem>
                          <SelectItem value="Minimante invasivo" className="text-white hover:bg-slate-700">Minimante invasivo</SelectItem>
                          <SelectItem value="Invasivo" className="text-white hover:bg-slate-700">Invasivo</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-300" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nivel_investimento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Nível de Investimento</FormLabel>
                      <FormDescription className="text-slate-400">Estimativa de faixa de investimento</FormDescription>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                            <SelectValue placeholder="Selecione o nível" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="Alto" className="text-white hover:bg-slate-700">Alto</SelectItem>
                          <SelectItem value="Médio" className="text-white hover:bg-slate-700">Médio</SelectItem>
                          <SelectItem value="Baixo" className="text-white hover:bg-slate-700">Baixo</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-300" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contraindicacoes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Contraindicações</FormLabel>
                      <FormDescription className="text-slate-400">Ex: gestantes, marca-passo, problemas circulatórios</FormDescription>
                      <FormControl>
                        <TagInput
                          value={field.value || []}
                          onChange={field.onChange}
                          placeholder="Digite e pressione Enter"
                          className="text-white"
                        />
                      </FormControl>
                      <FormMessage className="text-red-300" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="perfil_ideal_paciente"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Perfil Ideal do Paciente</FormLabel>
                      <FormDescription className="text-slate-400">Ex: Mulheres 35+, Pós-parto, Flacidez</FormDescription>
                      <FormControl>
                        <TagInput
                          value={field.value || []}
                          onChange={field.onChange}
                          placeholder="Digite e pressione Enter"
                          className="text-white"
                        />
                      </FormControl>
                      <FormMessage className="text-red-300" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="possui_consumiveis"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border border-slate-700 bg-slate-800/50 p-4 mt-6">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base text-white">Possui Consumíveis?</FormLabel>
                        <FormDescription className="text-slate-400">
                          Indica se o equipamento exige consumíveis
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="akinator_enabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border border-slate-700 bg-slate-800/50 p-4 mt-6">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base flex items-center gap-2 text-white">
                          Fluida Akinator
                          <Tooltip>
                            <TooltipTrigger>
                              <HelpCircle className="h-4 w-4 text-slate-400" />
                            </TooltipTrigger>
                            <TooltipContent className="bg-slate-800 border-slate-700">
                              <p className="text-white">Ativa ou desativa esse equipamento nas sugestões inteligentes</p>
                            </TooltipContent>
                          </Tooltip>
                        </FormLabel>
                        <FormDescription className="text-slate-400">
                          Pode ser recomendado pelo Akinator?
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="ativo"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border border-slate-700 bg-slate-800/50 p-4 mt-6">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base text-white">Equipamento Ativo</FormLabel>
                      <FormDescription className="text-slate-400">
                        Determina se este equipamento está disponível para seleção nos roteiros
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {isUploading && (
                <div className="flex items-center justify-center mt-2 text-sm text-white">
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  <span>Enviando imagem...</span>
                </div>
              )}

              <div className="flex justify-between gap-2 pt-4">
                {/* Manual save draft button for new equipment */}
                {!equipment && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      saveEquipmentDraft(form.getValues());
                      setHasDraft(true);
                      setDraftTimestamp(new Date().toISOString());
                      toast({
                        title: "Rascunho salvo",
                        description: "Seu progresso foi salvo como rascunho."
                      });
                    }}
                    disabled={isSaving || isUploading}
                    className="flex items-center gap-2 border-slate-600 hover:bg-slate-700 text-white"
                  >
                    <Save className="h-4 w-4" />
                    Salvar rascunho
                  </Button>
                )}
                
                <div className="flex ml-auto gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={onCancel} 
                    disabled={isSaving || isUploading}
                    className="border-slate-600 hover:bg-slate-700 text-white"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSaving || isUploading}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        {equipment ? "Atualizar" : "Cadastrar"}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="applicators" className="mt-6">
            <ApplicatorsTab
              applicators={applicators}
              onApplicatorsChange={setApplicators}
            />
          </TabsContent>
        </Tabs>
      </Form>
    </TooltipProvider>
  );
};

export default EquipmentForm;
