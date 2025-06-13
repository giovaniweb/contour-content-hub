
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface CopyableTextProps {
  text: string;
  children: React.ReactNode;
  className?: string;
  buttonSize?: 'sm' | 'icon';
  showToast?: boolean;
}

const CopyableText: React.FC<CopyableTextProps> = ({ 
  text, 
  children, 
  className = '',
  buttonSize = 'icon',
  showToast = true
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      
      if (showToast) {
        toast.success('✅ Texto copiado!', {
          description: 'O conteúdo foi copiado para sua área de transferência.'
        });
      }
      
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Erro ao copiar texto:', error);
      if (showToast) {
        toast.error('❌ Erro ao copiar texto');
      }
    }
  };

  return (
    <div className={`relative group ${className}`}>
      {children}
      <Button
        onClick={handleCopy}
        size={buttonSize}
        variant="ghost"
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-6 w-6 p-0 bg-slate-800/90 hover:bg-slate-700 border border-slate-600"
      >
        {copied ? (
          <Check className="h-3 w-3 text-green-400" />
        ) : (
          <Copy className="h-3 w-3 text-slate-300" />
        )}
      </Button>
    </div>
  );
};

export default CopyableText;
