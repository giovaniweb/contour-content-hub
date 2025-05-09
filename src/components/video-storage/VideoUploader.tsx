import React, { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useQueue } from '@/hooks/useQueue';
import { Equipment } from '@/types/equipment';
import { useEquipments } from '@/hooks/useEquipments';
import { VideoUploadProgress } from '@/types/video-storage';

const VideoUploader: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<VideoUploadProgress>({ loaded: 0, total: 0, percentage: 0 });
  const [isUploading, setIsUploading] = useState(false);
  const [duration, setDuration] = useState<string>('');
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const { toast } = useToast();
  const { equipments } = useEquipments();
  const { updateVideoQueue } = useQueue();

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      tags: [],
      equipmentId: '',
      equipmentName: ''
    },
    validationSchema: Yup.object({
      title: Yup.string().required('O título é obrigatório'),
      description: Yup.string(),
      tags: Yup.array().of(Yup.string()),
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
    setSelectedFile(file);
    formik.setFieldValue('title', file.name.split('.')[0]);
  }, [formik]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': []
    }
  });

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      formik.setFieldValue('title', file.name.split('.')[0]);
    }
  };

  const handleRemoveSelectedFile = () => {
    setSelectedFile(null);
    setUploadProgress({ loaded: 0, total: 0, percentage: 0 });
  };

  const handleSelectEquipment = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
    formik.setFieldValue('equipmentId', equipment.id);
    formik.setFieldValue('equipmentName', equipment.nome);
  };

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setUploadProgress({ loaded: 0, total: file.size, percentage: 0, status: 'queued', fileName: file.name });

    const videoId = uuidv4();
    updateVideoQueue(file.name, {
      status: 'uploading',
      progress: 0,
      fileName: file.name,
      loaded: 0,
      total: file.size,
      percentage: 0,
      videoId
    });

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `videos/${fileName}`;

      const { data, error } = await supabase.storage
        .from('videos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw error;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('videos')
        .getPublicUrl(filePath);

      updateVideoQueue(file.name, {
        status: 'processing',
        progress: 50,
        fileName: file.name,
        message: 'Processando vídeo...',
        loaded: file.size,
        total: file.size,
        percentage: 50,
        videoId
      });

      setUploadProgress({ loaded: file.size, total: file.size, percentage: 100, status: 'complete' });
      await handleUploadComplete(file, videoId);
    } catch (err: any) {
      console.error('Error uploading video:', err);
      updateVideoQueue(file.name, {
        status: 'error',
        progress: 0,
        fileName: file.name,
        message: 'Erro ao enviar vídeo.',
        error: err.message,
        loaded: 0,
        total: file.size,
        percentage: 0,
        videoId
      });

      toast({
        variant: 'destructive',
        title: 'Erro no upload',
        description: 'Não foi possível enviar o vídeo. Tente novamente.',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadComplete = async (file: File, videoId: string) => {
  try {
    // Prepare metadata
    const metadata = {
      equipment_id: selectedEquipment?.id || '',
      equipment_name: selectedEquipment?.nome || '',
      processing_progress: 'completed',
      duration: duration || '',
      fileSize: file.size,
      dimensions: {
        width: 0,
        height: 0
      },
      original_filename: file.name
    };

    // Update the video with metadata
    const { error } = await supabase
      .from('videos_storage')
      .update({ 
        metadata: metadata as any, // Type assertion to satisfy Json type
        title: formik.values.title || file.name.split('.')[0],
        description: formik.values.description,
        tags: formik.values.tags
      })
      .eq('id', videoId);

    if (error) throw error;

    // Update the video queue state
    updateVideoQueue(file.name, {
      status: 'complete',
      videoId,
      progress: 100,
      loaded: file.size,
      total: file.size,
      percentage: 100
    });

    toast({
      title: 'Upload completo',
      description: `O vídeo ${file.name} foi enviado com sucesso.`,
    });

    // Reset the form
    formik.resetForm();
    setSelectedFile(null);
    setDuration('');
    setSelectedEquipment(null);
  } catch (error) {
    console.error('Error completing upload:', error);
    toast({
      variant: 'destructive',
      title: 'Erro ao completar upload',
      description: 'Não foi possível completar o upload do vídeo. Tente novamente.',
    });
  }
};

  const handleDuration = (duration: string) => {
    setDuration(duration);
  };

  return (
    <div className="container mx-auto py-10">
      <h2 className="text-2xl font-semibold mb-5">Envio de Vídeo</h2>

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        {/* Dropzone or File Input */}
        <div {...getRootProps()} className={`border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center ${isDragActive ? 'border-primary' : 'border-muted-foreground'}`}>
          <input {...getInputProps()} onChange={handleFileInputChange} />
          {selectedFile ? (
            <div className="flex flex-col items-center justify-center">
              <Video className="h-10 w-10 text-primary mb-2" />
              <p className="text-sm text-muted-foreground">{selectedFile.name}</p>
              <Button type="button" variant="ghost" size="sm" onClick={handleRemoveSelectedFile}>
                Remover
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <Upload className="h-10 w-10 text-primary mb-2" />
              <p className="text-sm text-muted-foreground">Arraste e solte um vídeo aqui ou clique para selecionar</p>
            </div>
          )}
        </div>

        {/* Title Input */}
        <div>
          <Label htmlFor="title">Título</Label>
          <Input
            type="text"
            id="title"
            placeholder="Título do vídeo"
            {...formik.getFieldProps('title')}
          />
          {formik.touched.title && formik.errors.title ? (
            <p className="text-red-500 text-sm">{formik.errors.title}</p>
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
            placeholder="Tags"
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
              <SelectValue placeholder="Selecione um equipamento" defaultValue={selectedEquipment?.nome} />
            </SelectTrigger>
            <SelectContent>
              {equipments.map((equipment) => (
                <SelectItem key={equipment.id} value={equipment.id}>
                  {equipment.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Video Duration Input (Hidden) */}
        <input type="hidden" id="duration" value={duration} />

        {/* Upload Progress */}
        {isUploading && uploadProgress.status !== 'complete' && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              {uploadProgress.fileName} - {uploadProgress.status} ({uploadProgress.percentage}%)
            </p>
            <Progress value={uploadProgress.percentage} />
          </div>
        )}

        {/* Submit Button */}
        <Button type="submit" disabled={isUploading || !selectedFile} className="w-full">
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
