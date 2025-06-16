
import React, { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, XCircle, Upload, X, Video, Plus, Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useEquipments } from '@/hooks/useEquipments';
import { uploadVideo } from '@/services/videoStorage/videoUploadService';
import { validateVideoFile, formatFileSize } from '@/utils/fileUtils';
import { Equipment } from '@/types/equipment';

interface VideoUploadProgress {
  loaded: number;
  total: number;
  percentage: number;
  status?: 'uploading' | 'processing' | 'complete' | 'error';
  fileName?: string;
  message?: string;
}

const VideoUploader: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<VideoUploadProgress>({ loaded: 0, total: 0, percentage: 0 });
  const [isUploading, setIsUploading] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const { toast } = useToast();
  const { equipments } = useEquipments();

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      tags: '',
      equipmentId: '',
    },
    validationSchema: Yup.object({
      title: Yup.string().required('O título é obrigatório'),
      description: Yup.string(),
      tags: Yup.string(),
    }),
    onSubmit: async (values) => {
      if (!selectedFile) {
        toast({
          variant: 'destructive',
          title: 'Erro',
          description: 'Por favor, selecione um arquivo de vídeo.',
        });
        return;
      }

      await handleUpload(selectedFile);
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    
    // Validate file before setting
    const validation = validateVideoFile(file);
    if (!validation.valid) {
      toast({
        variant: 'destructive',
        title: 'Arquivo inválido',
        description: validation.error,
      });
      return;
    }
    
    setSelectedFile(file);
    // Auto-fill title from filename (remove extension)
    const titleFromFile = file.name.replace(/\.[^/.]+$/, "");
    formik.setFieldValue('title', titleFromFile);
  }, [formik, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.mov', '.avi', '.mkv']
    },
    multiple: false,
    maxSize: 500 * 1024 * 1024 // 500MB
  });

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file before setting
      const validation = validateVideoFile(file);
      if (!validation.valid) {
        toast({
          variant: 'destructive',
          title: 'Arquivo inválido',
          description: validation.error,
        });
        return;
      }
      
      setSelectedFile(file);
      const titleFromFile = file.name.replace(/\.[^/.]+$/, "");
      formik.setFieldValue('title', titleFromFile);
    }
  };

  const handleRemoveSelectedFile = () => {
    setSelectedFile(null);
    setUploadProgress({ loaded: 0, total: 0, percentage: 0 });
    formik.resetForm();
  };

  const handleSelectEquipment = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
    formik.setFieldValue('equipmentId', equipment.id);
  };

  const handleUpload = async (file: File) => {
    console.log('🚀 Iniciando upload:', file.name);
    setIsUploading(true);
    setUploadProgress({ 
      loaded: 0, 
      total: file.size, 
      percentage: 0, 
      status: 'uploading', 
      fileName: file.name 
    });

    try {
      // Prepare tags array
      const tagsArray = formik.values.tags 
        ? formik.values.tags.split(',').map(tag => tag.trim()).filter(Boolean)
        : [];

      console.log('📝 Metadados do upload:', {
        title: formik.values.title,
        description: formik.values.description,
        equipmentId: selectedEquipment?.id,
        tags: tagsArray
      });

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev.percentage >= 90) {
            clearInterval(progressInterval);
            return { ...prev, percentage: 90, status: 'processing', message: 'Processando vídeo...' };
          }
          return { ...prev, percentage: prev.percentage + 10 };
        });
      }, 200);

      const result = await uploadVideo(file, {
        title: formik.values.title,
        description: formik.values.description,
        equipmentId: selectedEquipment?.id,
        tags: tagsArray
      });

      clearInterval(progressInterval);

      if (result.success) {
        setUploadProgress({ 
          loaded: file.size, 
          total: file.size, 
          percentage: 100, 
          status: 'complete',
          message: 'Upload concluído com sucesso!'
        });

        toast({
          title: 'Upload completo',
          description: `O vídeo "${formik.values.title}" foi enviado com sucesso.`,
        });

        // Reset form after successful upload
        setTimeout(() => {
          handleRemoveSelectedFile();
        }, 2000);

      } else {
        throw new Error(result.error || 'Erro desconhecido no upload');
      }

    } catch (error) {
      console.error('💥 Erro no upload:', error);
      
      setUploadProgress({
        loaded: 0,
        total: file.size,
        percentage: 0,
        status: 'error',
        message: error.message || 'Erro no upload'
      });

      toast({
        variant: 'destructive',
        title: 'Erro no upload',
        description: error.message || 'Não foi possível enviar o vídeo. Tente novamente.',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h2 className="text-2xl font-semibold mb-5">Envio de Vídeo</h2>

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        {/* Dropzone or File Input */}
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center transition-colors ${
            isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground hover:border-primary/50'
          }`}
        >
          <input {...getInputProps()} onChange={handleFileInputChange} />
          {selectedFile ? (
            <div className="flex flex-col items-center justify-center space-y-2">
              <Video className="h-10 w-10 text-primary mb-2" />
              <p className="text-sm font-medium">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
              <Button type="button" variant="ghost" size="sm" onClick={handleRemoveSelectedFile}>
                <X className="h-4 w-4 mr-1" />
                Remover
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-2">
              <Upload className="h-10 w-10 text-primary mb-2" />
              <p className="text-sm text-muted-foreground text-center">
                {isDragActive 
                  ? "Solte o arquivo aqui..." 
                  : "Arraste e solte um vídeo aqui ou clique para selecionar"
                }
              </p>
              <p className="text-xs text-muted-foreground">
                MP4, MOV, AVI (máx. 500MB)
              </p>
            </div>
          )}
        </div>

        {/* Title Input */}
        <div>
          <Label htmlFor="title">Título *</Label>
          <Input
            type="text"
            id="title"
            placeholder="Título do vídeo"
            {...formik.getFieldProps('title')}
          />
          {formik.touched.title && formik.errors.title ? (
            <p className="text-red-500 text-sm mt-1">{formik.errors.title}</p>
          ) : null}
        </div>

        {/* Description Input */}
        <div>
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            placeholder="Descrição do vídeo"
            {...formik.getFieldProps('description')}
          />
        </div>

        {/* Tags Input */}
        <div>
          <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
          <Input
            type="text"
            id="tags"
            placeholder="Ex: tutorial, estética, facial"
            {...formik.getFieldProps('tags')}
          />
        </div>

        {/* Equipment Select */}
        <div>
          <Label htmlFor="equipment">Equipamento</Label>
          <Select onValueChange={(value) => {
            const selected = equipments.find(eq => eq.id === value);
            if (selected) {
              handleSelectEquipment(selected);
            }
          }}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione um equipamento (opcional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Nenhum equipamento</SelectItem>
              {equipments.map((equipment) => (
                <SelectItem key={equipment.id} value={equipment.id}>
                  {equipment.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Upload Progress */}
        {(isUploading || uploadProgress.status) && (
          <div className="space-y-2 p-4 border rounded-lg bg-muted/30">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">
                {uploadProgress.fileName || selectedFile?.name}
              </p>
              <div className="flex items-center space-x-2">
                {uploadProgress.status === 'complete' && (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                )}
                {uploadProgress.status === 'error' && (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
                {(uploadProgress.status === 'uploading' || uploadProgress.status === 'processing') && (
                  <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                )}
                <span className="text-sm text-muted-foreground">
                  {uploadProgress.percentage}%
                </span>
              </div>
            </div>
            <Progress value={uploadProgress.percentage} />
            {uploadProgress.message && (
              <p className="text-xs text-muted-foreground">
                {uploadProgress.message}
              </p>
            )}
          </div>
        )}

        {/* Submit Button */}
        <Button 
          type="submit" 
          disabled={isUploading || !selectedFile} 
          className="w-full"
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
    </div>
  );
};

export default VideoUploader;
