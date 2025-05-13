
import React, { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/routes';

// Components
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { TagInput } from '@/components/ui/TagInput';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { LazyImage } from '@/components/ui/lazy-image';
import { AlertTriangle, Upload, ImagePlus, CheckCircle, Loader2, Video } from 'lucide-react';

// Schema de validação do formulário
const formSchema = z.object({
  title: z.string().min(3, 'O título deve ter pelo menos 3 caracteres'),
  description: z.string().optional(),
  tags: z.array(z.string()).default([]),
});

type FormValues = z.infer<typeof formSchema>;

const VideoCreatePage: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  // Inicializar o formulário
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      tags: [],
    },
  });

  // Manipular seleção de arquivos
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, fileType: 'video' | 'thumbnail' | 'banner') => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Criar URL do arquivo para preview
      const previewUrl = URL.createObjectURL(file);
      
      if (fileType === 'video') {
        setVideoFile(file);
        setVideoPreview(previewUrl);
        
        // Extrair o nome do arquivo para usar como título se o título estiver vazio
        if (!form.getValues('title')) {
          const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
          form.setValue('title', nameWithoutExt);
        }
      } else if (fileType === 'thumbnail') {
        setThumbnailFile(file);
        setThumbnailPreview(previewUrl);
      } else {
        setBannerFile(file);
        setBannerPreview(previewUrl);
      }
    }
  }, [form]);

  // Manipular clique nos botões de upload
  const handleUploadClick = useCallback((fileType: 'video' | 'thumbnail' | 'banner') => {
    if (fileType === 'video' && videoInputRef.current) {
      videoInputRef.current.click();
    } else if (fileType === 'thumbnail' && thumbnailInputRef.current) {
      thumbnailInputRef.current.click();
    } else if (fileType === 'banner' && bannerInputRef.current) {
      bannerInputRef.current.click();
    }
  }, []);

  // Função para fazer upload de arquivos para o bucket correto
  const uploadFileToBucket = async (file: File, bucket: string, fileName: string): Promise<string | null> => {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error(`Error uploading to ${bucket}:`, error);
        throw error;
      }

      // Obter URL pública do arquivo
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error(`Upload failed for ${bucket}:`, error);
      return null;
    }
  };

  // Enviar o formulário
  const onSubmit = async (values: FormValues) => {
    if (!videoFile) {
      toast({
        variant: 'destructive',
        title: 'Arquivo obrigatório',
        description: 'Você precisa selecionar um vídeo para upload.',
      });
      return;
    }

    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Não autenticado',
        description: 'Você precisa estar logado para fazer upload de vídeos.',
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Gerar ID único para o vídeo
      const videoId = uuidv4();
      const timestamp = Date.now();
      
      // Extensões dos arquivos
      const videoExt = videoFile.name.split('.').pop();
      const videoFileName = `${videoId}_${timestamp}.${videoExt}`;
      
      // Iniciar com 10% de progresso para feedback visual
      setUploadProgress(10);
      
      // Upload do vídeo
      const videoUrl = await uploadFileToBucket(videoFile, 'videos', videoFileName);
      if (!videoUrl) throw new Error('Falha no upload do vídeo');
      
      setUploadProgress(50);
      
      // Upload da thumbnail (se existir)
      let thumbnailUrl = null;
      if (thumbnailFile) {
        const thumbExt = thumbnailFile.name.split('.').pop();
        const thumbnailFileName = `${videoId}_${timestamp}.${thumbExt}`;
        thumbnailUrl = await uploadFileToBucket(thumbnailFile, 'videos-thumbnails', thumbnailFileName);
      }
      
      setUploadProgress(70);
      
      // Upload do banner (se existir)
      let bannerUrl = null;
      if (bannerFile) {
        const bannerExt = bannerFile.name.split('.').pop();
        const bannerFileName = `${videoId}_${timestamp}.${bannerExt}`;
        bannerUrl = await uploadFileToBucket(bannerFile, 'videos-banners', bannerFileName);
      }
      
      setUploadProgress(90);
      
      // Criar registro na tabela videos_storage
      const { data, error } = await supabase
        .from('videos_storage')
        .insert({
          id: videoId,
          title: values.title,
          description: values.description || '',
          file_urls: {
            original: videoUrl,
          },
          thumbnail_url: thumbnailUrl,
          tags: values.tags,
          status: 'processing', // O vídeo estará em processamento
          owner_id: user.id,
          size: videoFile.size,
          metadata: {
            original_filename: videoFile.name,
            banner_url: bannerUrl
          }
        })
        .select()
        .single();
      
      if (error) throw error;
      
      setUploadProgress(100);
      
      toast({
        title: 'Vídeo enviado com sucesso!',
        description: 'Seu vídeo foi enviado e está sendo processado.',
      });
      
      // Redirecionar para a página de armazenamento de vídeos
      setTimeout(() => {
        navigate(ROUTES.VIDEOS.STORAGE);
      }, 2000);
      
    } catch (error) {
      console.error('Error uploading video:', error);
      toast({
        variant: 'destructive',
        title: 'Erro no upload',
        description: 'Ocorreu um erro ao enviar o vídeo. Tente novamente.',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Layout title="Criar Vídeo">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Seção de upload de vídeo */}
                <div className="space-y-4">
                  <FormLabel>Vídeo</FormLabel>
                  <div 
                    className={`border-2 border-dashed rounded-lg ${videoFile ? 'border-primary' : 'border-gray-300'} p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors`}
                    onClick={() => handleUploadClick('video')}
                  >
                    {videoFile ? (
                      <div className="flex flex-col items-center">
                        <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
                        <p className="text-sm font-medium">{videoFile.name}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                        {videoPreview && (
                          <video 
                            className="mt-4 max-h-40 rounded" 
                            controls
                            src={videoPreview}
                          />
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <Video className="h-10 w-10 text-gray-400 mb-2" />
                        <p className="text-sm font-medium">Clique para selecionar ou arraste um vídeo</p>
                        <p className="text-xs text-gray-500 mt-1">MP4, MOV ou WEBM (máx. 500MB)</p>
                      </div>
                    )}
                    <input
                      ref={videoInputRef}
                      type="file"
                      accept="video/mp4,video/quicktime,video/webm"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, 'video')}
                      disabled={isUploading}
                    />
                  </div>
                </div>

                {/* Formulário de detalhes */}
                <Tabs defaultValue="details" className="w-full">
                  <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger value="details">Detalhes</TabsTrigger>
                    <TabsTrigger value="thumbnail">Miniatura</TabsTrigger>
                    <TabsTrigger value="banner">Banner</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="details" className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Título</FormLabel>
                          <FormControl>
                            <Input placeholder="Título do vídeo" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descrição</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Descreva o conteúdo do vídeo" 
                              className="resize-none" 
                              rows={4}
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="tags"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tags</FormLabel>
                          <FormControl>
                            <TagInput 
                              placeholder="Digite uma tag e pressione Enter" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Pressione Enter para adicionar uma tag. Máximo 10 tags.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                  
                  <TabsContent value="thumbnail" className="space-y-4">
                    <FormLabel>Miniatura do Vídeo</FormLabel>
                    <div 
                      className={`border-2 border-dashed rounded-lg ${thumbnailFile ? 'border-primary' : 'border-gray-300'} p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors`}
                      onClick={() => handleUploadClick('thumbnail')}
                    >
                      {thumbnailFile ? (
                        <div className="flex flex-col items-center">
                          {thumbnailPreview && (
                            <LazyImage 
                              src={thumbnailPreview} 
                              alt="Miniatura" 
                              className="max-h-40 object-cover rounded mb-2"
                              aspectRatio="video"
                            />
                          )}
                          <p className="text-sm font-medium">{thumbnailFile.name}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {(thumbnailFile.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <ImagePlus className="h-10 w-10 text-gray-400 mb-2" />
                          <p className="text-sm font-medium">Clique para selecionar uma miniatura</p>
                          <p className="text-xs text-gray-500 mt-1">JPG, PNG ou WEBP (recomendado: 1280x720)</p>
                        </div>
                      )}
                      <input
                        ref={thumbnailInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, 'thumbnail')}
                        disabled={isUploading}
                      />
                    </div>
                    <FormDescription>
                      A miniatura será exibida nas listagens e como capa do vídeo.
                    </FormDescription>
                  </TabsContent>
                  
                  <TabsContent value="banner" className="space-y-4">
                    <FormLabel>Banner de Destaque</FormLabel>
                    <div 
                      className={`border-2 border-dashed rounded-lg ${bannerFile ? 'border-primary' : 'border-gray-300'} p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors`}
                      onClick={() => handleUploadClick('banner')}
                    >
                      {bannerFile ? (
                        <div className="flex flex-col items-center">
                          {bannerPreview && (
                            <LazyImage 
                              src={bannerPreview} 
                              alt="Banner" 
                              className="max-h-40 object-cover rounded mb-2"
                              aspectRatio="wide"
                            />
                          )}
                          <p className="text-sm font-medium">{bannerFile.name}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {(bannerFile.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <ImagePlus className="h-10 w-10 text-gray-400 mb-2" />
                          <p className="text-sm font-medium">Clique para selecionar um banner</p>
                          <p className="text-xs text-gray-500 mt-1">JPG, PNG ou WEBP (recomendado: 1920x1080)</p>
                        </div>
                      )}
                      <input
                        ref={bannerInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, 'banner')}
                        disabled={isUploading}
                      />
                    </div>
                    <FormDescription>
                      O banner será usado em destaque em carrosséis e páginas especiais.
                    </FormDescription>
                  </TabsContent>
                </Tabs>
                
                {/* Feedback de validação */}
                {!videoFile && form.formState.isSubmitted && (
                  <div className="flex items-center text-destructive p-2 rounded bg-destructive/10">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    <span className="text-sm">O vídeo é obrigatório</span>
                  </div>
                )}

                {/* Barra de progresso */}
                {isUploading && (
                  <div className="space-y-2">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-primary h-2.5 rounded-full" 
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-sm text-center text-muted-foreground">
                      {uploadProgress < 100 ? 'Enviando...' : 'Concluído!'} ({uploadProgress}%)
                    </p>
                  </div>
                )}

                {/* Botão de envio */}
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Enviar Vídeo
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default VideoCreatePage;
