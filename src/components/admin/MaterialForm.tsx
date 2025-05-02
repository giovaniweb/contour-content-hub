
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

interface MaterialFormProps {
  materialId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const MaterialForm: React.FC<MaterialFormProps> = ({ materialId, onSuccess, onCancel }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const [materialTypes] = useState([
    "PDF",
    "PSD",
    "Logomarca",
    "Imagem"
  ]);
  
  const [categoryOptions] = useState([
    "Folder",
    "Branding",
    "Arte Pronta",
    "Template",
    "Outro"
  ]);

  const [formData, setFormData] = useState({
    nome: "",
    tipo: "",
    categoria: "",
    outro_categoria: "",
    preview_url: "",
    arquivo_url: "",
    tags: [] as string[]
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const fetchMaterial = async (id: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('materiais')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      if (data) {
        setFormData({
          nome: data.nome || "",
          tipo: data.tipo || "",
          categoria: data.categoria || "",
          outro_categoria: "",
          preview_url: data.preview_url || "",
          arquivo_url: data.arquivo_url || "",
          tags: data.tags || []
        });
      }
    } catch (error) {
      console.error('Error fetching material:', error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar material",
        description: "Não foi possível carregar os dados do material."
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (materialId) {
      fetchMaterial(materialId);
    }
  }, [materialId]);

  const handleTagClick = (tag: string) => {
    if (formData.tags.includes(tag)) {
      setFormData({
        ...formData,
        tags: formData.tags.filter(t => t !== tag)
      });
    } else {
      setFormData({
        ...formData,
        tags: [...formData.tags, tag]
      });
    }
  };

  const handleAddCustomTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && (e.target as HTMLInputElement).value.trim()) {
      const newTag = (e.target as HTMLInputElement).value.trim();
      if (!formData.tags.includes(newTag)) {
        setFormData({
          ...formData,
          tags: [...formData.tags, newTag]
        });
      }
      (e.target as HTMLInputElement).value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      // Prepare data for submission
      const materialData = {
        nome: formData.nome,
        tipo: formData.tipo,
        categoria: formData.categoria === "Outro" ? formData.outro_categoria : formData.categoria,
        preview_url: formData.preview_url,
        arquivo_url: formData.arquivo_url,
        tags: formData.tags
      };

      // Create new tags if they don't exist
      const tagPromises = formData.tags.map(async (tag) => {
        const { error } = await supabase
          .from('tags')
          .upsert({ nome: tag }, { onConflict: 'nome' });
        
        if (error) {
          console.error(`Error creating tag ${tag}:`, error);
        }
      });

      await Promise.all(tagPromises);

      if (materialId) {
        // Update existing material
        const { error } = await supabase
          .from('materiais')
          .update(materialData)
          .eq('id', materialId);
          
        if (error) throw error;

        toast({
          title: "Material atualizado",
          description: "O material foi atualizado com sucesso."
        });
      } else {
        // Create new material
        const { error } = await supabase
          .from('materiais')
          .insert([materialData]);
          
        if (error) throw error;

        toast({
          title: "Material criado",
          description: "O novo material foi adicionado com sucesso."
        });
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving material:', error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar material",
        description: "Não foi possível salvar o material. Por favor, tente novamente."
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && materialId) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="nome">Nome do Material *</Label>
          <Input
            id="nome"
            name="nome"
            placeholder="Digite o nome do material"
            value={formData.nome}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tipo">Tipo de Material *</Label>
          <Select 
            value={formData.tipo} 
            onValueChange={(value) => handleSelectChange("tipo", value)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo de material" />
            </SelectTrigger>
            <SelectContent>
              {materialTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="categoria">Categoria *</Label>
          <Select 
            value={formData.categoria} 
            onValueChange={(value) => handleSelectChange("categoria", value)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a categoria" />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {formData.categoria === "Outro" && (
            <Input
              name="outro_categoria"
              placeholder="Digite a categoria"
              value={formData.outro_categoria}
              onChange={handleInputChange}
              className="mt-2"
              required
            />
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="preview_url">Link da Imagem de Preview *</Label>
          <Input
            id="preview_url"
            name="preview_url"
            placeholder="Cole o link da imagem de preview"
            value={formData.preview_url}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="arquivo_url">Link para Download (Dropbox) *</Label>
          <Input
            id="arquivo_url"
            name="arquivo_url"
            placeholder="Cole o link para download do arquivo"
            value={formData.arquivo_url}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      <div className="space-y-4">
        <Label>Tags</Label>
        <div className="space-y-4">
          <div>
            <Label className="text-sm text-muted-foreground">Tags Selecionadas</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.tags.length > 0 ? (
                formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => handleTagClick(tag)}>
                    {tag} ✕
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">Nenhuma tag selecionada</span>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="custom-tag" className="text-sm text-muted-foreground">Adicionar Tag</Label>
            <Input
              id="custom-tag"
              placeholder="Digite uma tag e pressione Enter"
              onKeyPress={handleAddCustomTag}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {materialId ? "Salvar Alterações" : "Adicionar Material"}
        </Button>
      </div>
    </form>
  );
};

export default MaterialForm;
