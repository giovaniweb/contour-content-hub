
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Film, Upload, Check, X, ArrowLeft, FileVideo, Camera } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import ContentLayout from '@/components/layout/ContentLayout';
import GlassContainer from '@/components/ui/GlassContainer';
import { ROUTES } from '@/routes';

// Mock data para equipamentos disponíveis
const equipmentOptions = [
  { id: 'equip-1', nome: 'Canon EOS R5' },
  { id: 'equip-2', nome: 'Sony A7IV' },
  { id: 'equip-3', nome: 'iPhone 14 Pro' },
  { id: 'equip-4', nome: 'DJI Pocket 3' },
];

const VideoCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [equipment, setEquipment] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Handle drag events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  // Handle drop event
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('video/')) {
        setSelectedFile(file);
      } else {
        toast({
          variant: "destructive",
          title: "Formato inválido",
          description: "Por favor, selecione apenas arquivos de vídeo."
        });
      }
    }
  };
  
  // Handle file selection via input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('video/')) {
        setSelectedFile(file);
      } else {
        toast({
          variant: "destructive",
          title: "Formato inválido",
          description: "Por favor, selecione apenas arquivos de vídeo."
        });
      }
    }
  };
  
  // Clear selected file
  const handleClearFile = () => {
    setSelectedFile(null);
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        variant: "destructive",
        title: "Campo obrigatório",
        description: "O título do vídeo é obrigatório."
      });
      return;
    }
    
    if (!selectedFile) {
      toast({
        variant: "destructive",
        title: "Arquivo não selecionado",
        description: "Por favor, selecione um arquivo de vídeo para enviar."
      });
      return;
    }
    
    try {
      setIsUploading(true);
      
      // Simular um upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Vídeo enviado com sucesso",
        description: "Seu vídeo está sendo processado e ficará disponível em breve.",
      });
      
      navigate(ROUTES.VIDEOS.ROOT);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao enviar vídeo",
        description: "Ocorreu um erro ao enviar seu vídeo. Por favor, tente novamente."
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <ContentLayout
      title="Criar Novo Vídeo"
      subtitle="Adicione um vídeo à sua biblioteca de conteúdo"
      actions={
        <Button 
          variant="outline" 
          onClick={() => navigate(ROUTES.VIDEOS.ROOT)}
          className="flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
      }
    >
      <GlassContainer className="max-w-3xl mx-auto p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Título do vídeo <span className="text-red-500">*</span></Label>
            <Input
              id="title"
              placeholder="Digite um título descritivo"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              placeholder="Descreva o conteúdo do seu vídeo"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
              <Input
                id="tags"
                placeholder="Ex: tutorial, maquiagem, pele"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="equipment">Equipamento utilizado</Label>
              <Select value={equipment} onValueChange={setEquipment}>
                <SelectTrigger id="equipment">
                  <SelectValue placeholder="Selecione um equipamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Nenhum equipamento</SelectItem>
                  {equipmentOptions.map((equip) => (
                    <SelectItem key={equip.id} value={equip.id}>
                      {equip.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Arquivo de vídeo <span className="text-red-500">*</span></Label>
            
            {!selectedFile ? (
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center ${
                  dragActive ? 'border-primary bg-primary/5' : 'border-gray-300'
                }`}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center justify-center py-4">
                  <Upload className="h-12 w-12 text-muted-foreground mb-2" />
                  <p className="text-lg font-medium">Arraste seu arquivo aqui</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    ou clique para selecionar um arquivo
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Formatos suportados: MP4, MOV, AVI (máx. 1GB)
                  </p>
                  <Input
                    type="file"
                    className="hidden"
                    id="video-upload"
                    accept="video/*"
                    onChange={handleFileChange}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-4"
                    onClick={() => document.getElementById('video-upload')?.click()}
                  >
                    <FileVideo className="mr-2 h-4 w-4" />
                    Selecionar arquivo
                  </Button>
                </div>
              </div>
            ) : (
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-50 rounded-full mr-3">
                      <Film className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="font-medium">{selectedFile.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={handleClearFile}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          <div className="pt-4 flex justify-end">
            <Button
              type="submit"
              className="bg-gradient-to-r from-[#0094fb] to-[#f300fc] hover:opacity-90 text-white"
              disabled={isUploading || !selectedFile}
            >
              {isUploading ? (
                <>
                  <span className="animate-spin mr-2">
                    <svg className="h-4 w-4" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  </span>
                  Enviando...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Enviar Vídeo
                </>
              )}
            </Button>
          </div>
        </form>
      </GlassContainer>
      
      <GlassContainer className="mt-8 max-w-3xl mx-auto p-6">
        <h3 className="text-lg font-medium flex items-center">
          <Camera className="mr-2 h-5 w-5 text-blue-600" />
          Sugestões para gravação de vídeos
        </h3>
        <ul className="mt-4 space-y-2 text-sm">
          <li className="flex items-center">
            <div className="bg-blue-100 rounded-full p-1 mr-2">
              <Check className="h-3 w-3 text-blue-700" />
            </div>
            Escolha um ambiente bem iluminado, preferencialmente com luz natural
          </li>
          <li className="flex items-center">
            <div className="bg-blue-100 rounded-full p-1 mr-2">
              <Check className="h-3 w-3 text-blue-700" />
            </div>
            Verifique se o áudio está claro e sem ruídos de fundo
          </li>
          <li className="flex items-center">
            <div className="bg-blue-100 rounded-full p-1 mr-2">
              <Check className="h-3 w-3 text-blue-700" />
            </div>
            Grave na horizontal para melhor aproveitamento nas plataformas
          </li>
          <li className="flex items-center">
            <div className="bg-blue-100 rounded-full p-1 mr-2">
              <Check className="h-3 w-3 text-blue-700" />
            </div>
            Mantenha o equipamento estável, usando tripé sempre que possível
          </li>
          <li className="flex items-center">
            <div className="bg-blue-100 rounded-full p-1 mr-2">
              <Check className="h-3 w-3 text-blue-700" />
            </div>
            Prefira formatos de alta qualidade (1080p ou superior)
          </li>
        </ul>
      </GlassContainer>
    </ContentLayout>
  );
};

export default VideoCreatePage;
