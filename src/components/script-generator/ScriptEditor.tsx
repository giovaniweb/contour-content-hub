
import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ScriptEditorProps {
  content: string;
  onChange?: (content: string) => void;
  readOnly?: boolean;
  isLoading?: boolean;
  placeholder?: string;
  minRows?: number;
}

const ScriptEditor: React.FC<ScriptEditorProps> = ({
  content,
  onChange,
  readOnly = false,
  isLoading = false,
  placeholder = "Digite seu roteiro...",
  minRows = 10,
}) => {
  const { toast } = useToast();
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Copiado!",
        description: "O conteúdo foi copiado para a área de transferência.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível copiar o texto. Tente novamente.",
      });
    }
  };
  
  const calculateRows = () => {
    if (!content) return minRows;
    const lineCount = (content.match(/\n/g) || []).length + 1;
    return Math.max(lineCount, minRows);
  };
  
  return (
    <div className="relative w-full">
      <Textarea
        value={content}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={isLoading || readOnly}
        placeholder={placeholder}
        rows={calculateRows()}
        className={`w-full font-mono text-sm resize-y min-h-[200px] ${readOnly ? 'bg-gray-50' : ''}`}
      />
      
      {readOnly && content && (
        <Button
          variant="outline"
          size="sm"
          className="absolute top-2 right-2 h-8 w-8 p-0"
          onClick={handleCopy}
          title="Copiar roteiro"
        >
          <Copy className="h-4 w-4" />
          <span className="sr-only">Copiar roteiro</span>
        </Button>
      )}
    </div>
  );
};

export default ScriptEditor;
