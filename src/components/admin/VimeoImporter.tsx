
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from 'react-hook-form';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, Loader2 } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useEquipments } from "@/hooks/useEquipments";
import { Equipment } from '@/types/equipment';

// Prop interface
export interface VimeoImporterProps {
  onCompleteImport: (importedData: any) => void;
  selectedEquipmentId?: string;
}

const formSchema = z.object({
  title: z.string().min(2, {
    message: "O título deve ter pelo menos 2 caracteres.",
  }),
  description: z.string().optional(),
  vimeoUrl: z.string().url({ message: "Por favor, insira uma URL válida." }),
  equipment: z.string().min(1, { message: "Selecione um equipamento." }),
  bodyArea: z.string().min(1, { message: "Selecione uma área do corpo." }),
  purpose: z.string().min(1, { message: "Selecione uma finalidade." }),
  isFavorite: z.boolean().default(false),
});

const VimeoImporter: React.FC<VimeoImporterProps> = ({ onCompleteImport, selectedEquipmentId }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { equipments, loading: equipmentsLoading } = useEquipments();
  const [bodyAreas, setBodyAreas] = useState([
    { value: "face", label: "Face" },
    { value: "corpo", label: "Corpo" },
  ]);
  const [purposes, setPurposes] = useState([
    { value: "rugas", label: "Rugas" },
    { value: "flacidez", label: "Flacidez" },
  ]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      vimeoUrl: "",
      equipment: selectedEquipmentId || "",
      bodyArea: "",
      purpose: "",
      isFavorite: false,
    },
  });

  useEffect(() => {
    if (selectedEquipmentId) {
      form.setValue("equipment", selectedEquipmentId);
    }
  }, [selectedEquipmentId, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      // Extract the Vimeo video ID from the URL
      const videoId = values.vimeoUrl.match(/(\d+)(?=[^\d]*$)/)?.[1];
      if (!videoId) {
        throw new Error("Não foi possível extrair o ID do vídeo do Vimeo.");
      }

      // Simulate Vimeo API response
      const vimeoData = {
        name: values.title,
        description: values.description,
        link: values.vimeoUrl,
        pictures: { 
          sizes: [{ link: 'https://i.vimeocdn.com/video/0000000_300x200.jpg' }]
        },
        duration: 180,
      };

      // Check if the video already exists for the selected equipment and body area
      const { data: existingVideos, error: selectError } = await supabase
        .from('videos')
        .select('*')
        .eq('equipamentos', [values.equipment])
        .eq('area_corpo', values.bodyArea);

      if (selectError) {
        throw new Error(`Erro ao verificar vídeos existentes: ${selectError.message}`);
      }

      // If a video already exists for the selected equipment and body area, show an error
      if (existingVideos && existingVideos.length > 0) {
        const equipment = equipments.find(eq => eq.id === values.equipment);
        const bodyArea = bodyAreas.find(area => area.value === values.bodyArea);

        if (equipment && bodyArea) {
          toast({
            variant: "destructive",
            title: "Vídeo já cadastrado",
            description: `Já existe um vídeo cadastrado para o equipamento "${equipment.nome}" e área do corpo "${bodyArea.label}".`,
          });
        } else {
          toast({
            variant: "destructive",
            title: "Vídeo já cadastrado",
            description: "Já existe um vídeo cadastrado para o equipamento e área do corpo selecionados.",
          });
        }
        return;
      }

      // Get the equipment data
      const equipment = equipments.find(eq => eq.id === values.equipment);
      if (!equipment) {
        throw new Error("Equipamento não encontrado.");
      }

      // Prepare imported data
      const importedData = {
        titulo: vimeoData.name,
        descricao_curta: vimeoData.description,
        url_video: vimeoData.link,
        preview_url: vimeoData.pictures.sizes[0].link,
        duracao: vimeoData.duration.toString(),
        equipamentos: [values.equipment],
        area_corpo: values.bodyArea,
        finalidade: [values.purpose],
        tipo_video: 'video_pronto',
        data_upload: new Date().toISOString(),
      };

      // Call the onCompleteImport callback
      onCompleteImport(importedData);
      
      toast({
        title: "Vídeo importado com sucesso!",
        description: `O vídeo "${values.title}" foi importado e associado ao equipamento "${equipment.nome}".`,
      });
      form.reset();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao importar vídeo",
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título do Vídeo</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Demonstração Hipro" {...field} />
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
                  placeholder="Ex: Demonstração do equipamento Hipro"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="vimeoUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL do Vídeo no Vimeo</FormLabel>
              <FormControl>
                <Input placeholder="Ex: https://vimeo.com/123456789" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="equipment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Equipamento</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um equipamento" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {equipmentsLoading ? (
                    <SelectItem value="loading" disabled>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Carregando...
                    </SelectItem>
                  ) : (
                    equipments.map((equipment) => (
                      <SelectItem key={equipment.id} value={equipment.id}>
                        {equipment.nome}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bodyArea"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Área do Corpo</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma área do corpo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {bodyAreas.map((area) => (
                    <SelectItem key={area.value} value={area.value}>
                      {area.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="purpose"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Finalidade</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma finalidade" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {purposes.map((purpose) => (
                    <SelectItem key={purpose.value} value={purpose.value}>
                      {purpose.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isFavorite"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Vídeo Favorito</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Marque como favorito para fácil acesso
                </p>
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
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Importando...</>
          ) : (
            <><CheckCircle2 className="mr-2 h-4 w-4" /> Importar Vídeo</>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default VimeoImporter;
