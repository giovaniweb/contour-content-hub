
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import useAuth from "@/hooks/useAuth";

interface FileMetadataFormProps {
  uploadedFiles: { file: File; url: string | null }[];
  onFinish?: () => void;
}

const FileMetadataForm: React.FC<FileMetadataFormProps> = ({ uploadedFiles, onFinish }) => {
  const [formData, setFormData] = useState(
    uploadedFiles.map((up) => ({
      title: up.file.name.replace(/\.[^/.]+$/, ""),
      description: "",
      category: "",
      url: up.url,
      file_type: up.file.type.includes("video")
        ? "video"
        : up.file.type.includes("image")
        ? "image"
        : up.file.type.endsWith("pdf")
        ? "pdf"
        : "file",
      tags: "",
    }))
  );
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleChange = (idx: number, field: string, value: string) => {
    setFormData((prev) =>
      prev.map((f, i) => (i === idx ? { ...f, [field]: value } : f))
    );
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
        thumbnail_url: item.file_type === "image" ? item.url : null,
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
        toast({ title: "Arquivos cadastrados!", description: "Os arquivos foram registrados com sucesso." });
        if (onFinish) onFinish();
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {formData.map((meta, idx) => (
        <div key={idx} className="rounded border bg-muted/30 p-4 mb-2">
          <Input
            value={meta.title}
            onChange={(e) => handleChange(idx, "title", e.target.value)}
            placeholder="Título"
            className="mb-2"
          />
          <Textarea
            value={meta.description}
            onChange={(e) => handleChange(idx, "description", e.target.value)}
            placeholder="Descrição"
            className="mb-2"
          />
          <Input
            value={meta.category}
            onChange={(e) => handleChange(idx, "category", e.target.value)}
            placeholder="Categoria (opcional)"
            className="mb-2"
          />
          <Input
            value={meta.tags}
            onChange={(e) => handleChange(idx, "tags", e.target.value)}
            placeholder="Tags (separe por vírgula)"
            className="mb-2"
          />
          <span className="text-xs text-muted-foreground">Tipo: {meta.file_type}</span>
        </div>
      ))}
      <Button onClick={handleSaveAll} disabled={saving} className="w-full">
        {saving ? "Salvando..." : "Salvar todos"}
      </Button>
    </div>
  );
};

export default FileMetadataForm;
