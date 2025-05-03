
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./useArticleForm";

interface ArticleFormFieldsProps {
  form: UseFormReturn<FormValues>;
  equipments: {id: string, nome: string}[];
  fileUrl: string | null;
  file: File | null;
}

const ArticleFormFields: React.FC<ArticleFormFieldsProps> = ({
  form,
  equipments,
  fileUrl,
  file
}) => {
  return (
    <>
      {/* Title field */}
      <FormField
        control={form.control}
        name="titulo"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Título do Artigo*</FormLabel>
            <FormControl>
              <Input placeholder="Título do artigo científico" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Equipment field */}
      <FormField
        control={form.control}
        name="equipamento_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Equipamento</FormLabel>
            <Select 
              value={field.value || ""} 
              onValueChange={field.onChange}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um equipamento" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="none">Nenhum equipamento</SelectItem>
                {equipments.map((equip) => (
                  <SelectItem key={equip.id} value={equip.id}>
                    {equip.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Description field */}
      <FormField
        control={form.control}
        name="descricao"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descrição</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Descrição ou resumo do artigo" 
                className="resize-y min-h-[100px]"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Language field */}
      <FormField
        control={form.control}
        name="idioma_original"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Idioma Original</FormLabel>
            <Select 
              value={field.value || "pt"} 
              onValueChange={field.onChange}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o idioma" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="pt">Português</SelectItem>
                <SelectItem value="en">Inglês</SelectItem>
                <SelectItem value="es">Espanhol</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* External link field */}
      {(!file && !fileUrl) && (
        <FormField
          control={form.control}
          name="link_dropbox"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link Externo (Dropbox, Google Drive, etc.)</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </>
  );
};

export default ArticleFormFields;
