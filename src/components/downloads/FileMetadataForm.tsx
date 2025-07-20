
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import useAuth from "@/hooks/useAuth";
import { Upload, Image, FileText, Palette, Printer } from "lucide-react";

interface FileMetadataFormProps {
  uploadedFiles: { file: File; url: string | null }[];
  onFinish?: () => void;
}

const FileMetadataForm: React.FC<FileMetadataFormProps> = ({ uploadedFiles, onFinish }) => {
  const [formData, setFormData] = useState(
    uploadedFiles.map((up) => ({
      title: up.file.name.replace(/\.[^/.]+$/, ""),
      description: "",
      category: "arte-digital", // Default category
      url: up.url,
      file_type: up.file.type.includes("video")
        ? "video"
        : up.file.type.includes("image")
        ? "image"
        : up.file.type.endsWith("pdf")
        ? "pdf"
        : "file",
      tags: "",
      thumbnail_url: up.file.type.includes("image") ? up.url : null, // Auto-set thumbnail if it's an image
      custom_thumbnail: null as string | null,
    }))
  );
  const [saving, setSaving] = useState(false);
  const [uploadingThumbnails, setUploadingThumbnails] = useState<{ [key: number]: boolean }>({});
  const { toast } = useToast();
  const { user } = useAuth();
  const thumbnailInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

  const handleChange = (idx: number, field: string, value: string) => {
    setFormData((prev) =>
      prev.map((f, i) => (i === idx ? { ...f, [field]: value } : f))
    );
  };

  const handleThumbnailUpload = async (idx: number, file: File) => {
    setUploadingThumbnails(prev => ({ ...prev, [idx]: true }));
    
    try {
      const storagePath = `thumbnails/${Date.now()}_${file.name}`;
      const { data, error } = await supabase.storage
        .from("downloads")
        .upload(storagePath, file, { upsert: false });

      if (error) {
        toast({
          variant: "destructive",
          title: "Erro no upload da thumbnail",
          description: error.message,
        });
        return;
      }

      // Update the thumbnail URL for this item
      setFormData(prev =>
        prev.map((f, i) => (i === idx ? { ...f, custom_thumbnail: data.path } : f))
      );

      toast({
        title: "Thumbnail enviada",
        description: "Thumbnail carregada com sucesso!",
      });
    } catch (error) {
      console.error('Error uploading thumbnail:', error);
      toast({
        variant: "destructive",
        title: "Erro no upload",
        description: "Falha ao enviar thumbnail.",
      });
    } finally {
      setUploadingThumbnails(prev => ({ ...prev, [idx]: false }));
    }
  };

  const handleThumbnailSelect = (idx: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleThumbnailUpload(idx, file);
    }
  };

  const handleSaveAll = async () => {
    if (!user?.id) {
      toast({
        title: "Erro de autenticação",
        description: "Você precisa estar logado para salvar os arquivos.",
        variant: "destructive",
      });
      return;
    }
    setSaving(true);
    try {
      const inserts = formData.map((item) => ({
        title: item.title,
        description: item.description,
        category: item.category,
        file_url: item.url,
        file_type: item.file_type,
        tags: item.tags
          ? item.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
          : [],
        thumbnail_url: item.custom_thumbnail || item.thumbnail_url,
        size: null,
        metadata: {},
        owner_id: user.id,
      }));

      const { error } = await supabase
        .from("downloads_storage")
        .insert(inserts);

      if (error) {
        toast({
          variant: "destructive",
          title: "Erro ao salvar dados",
          description: error.message,
        });
      } else {
        toast({ title: "Materiais cadastrados!", description: "Os materiais foram registrados com sucesso." });
        if (onFinish) onFinish();
      }
    } finally {
      setSaving(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'arte-digital':
        return <Palette className="h-4 w-4" />;
      case 'para-impressao':
        return <Printer className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'arte-digital':
        return 'Arte Digital';
      case 'para-impressao':
        return 'Para Impressão';
      default:
        return 'Outro';
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-2">Configurar Materiais</h3>
        <p className="text-white/60 text-sm">Configure as informações de cada material enviado</p>
      </div>

      {formData.map((meta, idx) => (
        <Card key={idx} className="aurora-glass border-aurora-electric-purple/30">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-white">
              <FileText className="h-5 w-5 text-aurora-electric-purple" />
              Material {idx + 1}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Thumbnail Section */}
            <div className="space-y-2">
              <Label className="text-white font-medium">Thumbnail</Label>
              <div className="flex items-center gap-4">
                {(meta.custom_thumbnail || meta.thumbnail_url) && (
                  <div className="relative">
                    <img
                      src={meta.custom_thumbnail 
                        ? `https://mksvzhgqnsjfolvskibq.supabase.co/storage/v1/object/public/downloads/${meta.custom_thumbnail}`
                        : `https://mksvzhgqnsjfolvskibq.supabase.co/storage/v1/object/public/downloads/${meta.thumbnail_url}`
                      }
                      alt="Thumbnail"
                      className="w-20 h-20 object-cover rounded-lg border border-aurora-electric-purple/30"
                    />
                    <Badge 
                      variant="secondary" 
                      className="absolute -top-2 -right-2 bg-aurora-electric-purple/20 text-aurora-electric-purple text-xs"
                    >
                      {meta.custom_thumbnail ? 'Custom' : 'Auto'}
                    </Badge>
                  </div>
                )}
                
                <div className="flex-1">
                  <input
                    type="file"
                    ref={(el) => thumbnailInputRefs.current[idx] = el}
                    onChange={(e) => handleThumbnailSelect(idx, e)}
                    accept="image/*"
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => thumbnailInputRefs.current[idx]?.click()}
                    disabled={uploadingThumbnails[idx]}
                    className="border-aurora-electric-purple/30 text-aurora-electric-purple hover:bg-aurora-electric-purple/20"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {uploadingThumbnails[idx] ? 'Enviando...' : meta.custom_thumbnail ? 'Alterar Thumbnail' : 'Enviar Thumbnail'}
                  </Button>
                  {!meta.thumbnail_url && !meta.custom_thumbnail && (
                    <p className="text-xs text-white/60 mt-1">
                      Recomendado: envie uma imagem de prévia do material
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white font-medium">Título</Label>
                <Input
                  value={meta.title}
                  onChange={(e) => handleChange(idx, "title", e.target.value)}
                  placeholder="Nome do material"
                  className="bg-slate-800/50 border-aurora-electric-purple/30 text-white placeholder:text-white/40"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white font-medium">Categoria</Label>
                <Select value={meta.category} onValueChange={(value) => handleChange(idx, "category", value)}>
                  <SelectTrigger className="bg-slate-800/50 border-aurora-electric-purple/30 text-white">
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-aurora-electric-purple/30">
                    <SelectItem value="arte-digital" className="text-white hover:bg-aurora-electric-purple/20">
                      <div className="flex items-center gap-2">
                        <Palette className="h-4 w-4 text-aurora-electric-purple" />
                        Arte Digital
                      </div>
                    </SelectItem>
                    <SelectItem value="para-impressao" className="text-white hover:bg-aurora-electric-purple/20">
                      <div className="flex items-center gap-2">
                        <Printer className="h-4 w-4 text-aurora-emerald" />
                        Para Impressão
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white font-medium">Descrição</Label>
              <Textarea
                value={meta.description}
                onChange={(e) => handleChange(idx, "description", e.target.value)}
                placeholder="Descreva o material e como ele pode ser usado"
                className="bg-slate-800/50 border-aurora-electric-purple/30 text-white placeholder:text-white/40"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white font-medium">Tags</Label>
              <Input
                value={meta.tags}
                onChange={(e) => handleChange(idx, "tags", e.target.value)}
                placeholder="social media, instagram, post, banner (separe por vírgula)"
                className="bg-slate-800/50 border-aurora-electric-purple/30 text-white placeholder:text-white/40"
              />
            </div>

            {/* Info Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-aurora-electric-purple/20">
              <div className="flex items-center gap-2">
                {getCategoryIcon(meta.category)}
                <span className="text-sm text-white/80">{getCategoryLabel(meta.category)}</span>
              </div>
              <Badge variant="outline" className="text-aurora-neon-blue border-aurora-neon-blue/30">
                {meta.file_type.toUpperCase()}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
      
      <Button 
        onClick={handleSaveAll} 
        disabled={saving} 
        className="w-full aurora-button aurora-glow hover:aurora-glow-intense h-12 text-lg"
      >
        {saving ? "Salvando materiais..." : `Salvar ${formData.length} ${formData.length === 1 ? 'Material' : 'Materiais'}`}
      </Button>
    </div>
  );
};

export default FileMetadataForm;
