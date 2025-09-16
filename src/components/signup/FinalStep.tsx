import React, { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Upload, Check, Globe, Shield, Bell } from "lucide-react";
import { toast } from "sonner";

interface FinalStepProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
  onNext: () => void;
  onPrev: () => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const FinalStep: React.FC<FinalStepProps> = ({
  formData,
  updateFormData,
  onSubmit,
  isLoading
}) => {
  const [previewImage, setPreviewImage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Imagem deve ter no máximo 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreviewImage(result);
        updateFormData('foto_url', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.acceptTerms) {
      toast.error('Por favor, aceite os termos de uso para continuar');
      return;
    }
    
    onSubmit();
  };

  const getUserInitials = () => {
    const name = formData.nome || '';
    return name
      .split(' ')
      .map((word: string) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium text-white mb-2">
          Configurações Finais
        </h3>
        <p className="text-slate-400 text-sm">
          Últimos ajustes para personalizar sua experiência na plataforma.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Foto de Perfil */}
        <div className="space-y-4">
          <Label className="text-white text-base">
            Foto de Perfil (opcional)
          </Label>
          
          <div className="flex items-center space-x-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={previewImage || formData.foto_url} />
              <AvatarFallback className="bg-aurora-electric-purple/20 text-aurora-bright-cyan text-lg font-medium">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            
            <div className="space-y-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <Camera className="w-4 h-4" />
                Escolher Foto
              </Button>
              <p className="text-xs text-slate-400">
                JPG, PNG até 5MB
              </p>
            </div>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        {/* Idioma */}
        <div className="space-y-2">
          <Label className="text-white flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Idioma Preferido
          </Label>
          <Select
            value={formData.idioma || 'PT'}
            onValueChange={(value) => updateFormData('idioma', value)}
          >
            <SelectTrigger className="bg-aurora-space-black/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PT">🇧🇷 Português</SelectItem>
              <SelectItem value="EN">🇺🇸 English</SelectItem>
              <SelectItem value="ES">🇪🇸 Español</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Preferências de Notificação */}
        <div className="space-y-4">
          <Label className="text-white flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Preferências de Notificação
          </Label>
          
          <div className="space-y-3 pl-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="notif-content"
                defaultChecked={true}
                className="data-[state=checked]:bg-aurora-bright-cyan data-[state=checked]:border-aurora-bright-cyan"
              />
              <Label htmlFor="notif-content" className="text-sm text-slate-300">
                Novos conteúdos e atualizações
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="notif-tips"
                defaultChecked={true}
                className="data-[state=checked]:bg-aurora-bright-cyan data-[state=checked]:border-aurora-bright-cyan"
              />
              <Label htmlFor="notif-tips" className="text-sm text-slate-300">
                Dicas e tutoriais personalizados
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="notif-marketing"
                defaultChecked={false}
                className="data-[state=checked]:bg-aurora-bright-cyan data-[state=checked]:border-aurora-bright-cyan"
              />
              <Label htmlFor="notif-marketing" className="text-sm text-slate-300">
                Ofertas e promoções especiais
              </Label>
            </div>
          </div>
        </div>

        {/* Resumo dos Dados */}
        <div className="bg-aurora-space-black/30 border border-aurora-electric-purple/20 rounded-lg p-4">
          <h4 className="text-white font-medium mb-3 flex items-center gap-2">
            <Check className="w-4 h-4 text-aurora-bright-cyan" />
            Resumo da sua Conta
          </h4>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Nome:</span>
              <span className="text-white">{formData.nome}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Email:</span>
              <span className="text-white">{formData.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Perfil:</span>
              <span className="text-white">
                {formData.role === 'cliente' && 'Clínica Médica'}
                {formData.role === 'profissional_estetica' && 'Clínica Estética'}
                {formData.role === 'consultor' && 'Profissional Independente'}
                {formData.role === 'operador' && 'Estudante/Acadêmico'}
                {formData.role === 'gerente' && 'Empresa/Distribuidor'}
              </span>
            </div>
            {formData.clinica && (
              <div className="flex justify-between">
                <span className="text-slate-400">
                  {formData.role === 'gerente' ? 'Empresa:' : 'Clínica:'}
                </span>
                <span className="text-white">{formData.clinica}</span>
              </div>
            )}
            {formData.cidade && (
              <div className="flex justify-between">
                <span className="text-slate-400">Localização:</span>
                <span className="text-white">
                  {formData.cidade}{formData.estado && `, ${formData.estado}`}
                </span>
              </div>
            )}
            {formData.equipamentos && formData.equipamentos.length > 0 && (
              <div className="flex justify-between">
                <span className="text-slate-400">Equipamentos:</span>
                <span className="text-white">{formData.equipamentos.length} selecionados</span>
              </div>
            )}
          </div>
        </div>

        {/* Termos e Condições */}
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="accept-terms"
              checked={formData.acceptTerms || false}
              onCheckedChange={(checked) => updateFormData('acceptTerms', checked)}
              className="mt-1 data-[state=checked]:bg-aurora-bright-cyan data-[state=checked]:border-aurora-bright-cyan"
            />
            <Label htmlFor="accept-terms" className="text-sm text-slate-300 leading-relaxed">
              Li e aceito os{" "}
              <a 
                href="/terms" 
                target="_blank"
                className="text-aurora-bright-cyan hover:underline"
              >
                Termos de Uso
              </a>{" "}
              e a{" "}
              <a 
                href="/privacy" 
                target="_blank"
                className="text-aurora-bright-cyan hover:underline"
              >
                Política de Privacidade
              </a>
              . Concordo em receber comunicações por email e posso cancelar a qualquer momento.
            </Label>
          </div>
        </div>

        {/* Informações sobre Segurança */}
        <div className="bg-gradient-to-r from-aurora-bright-cyan/10 to-aurora-neon-purple/10 border border-aurora-bright-cyan/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-aurora-bright-cyan mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-white">
                Seus dados estão protegidos
              </p>
              <p className="text-xs text-slate-400 leading-relaxed">
                Utilizamos criptografia de ponta e seguimos as melhores práticas de segurança. 
                Seus dados pessoais nunca serão compartilhados com terceiros sem seu consentimento.
              </p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <Button
            type="submit"
            disabled={!formData.acceptTerms || isLoading}
            className="w-full bg-gradient-to-r from-aurora-bright-cyan to-aurora-neon-purple hover:from-aurora-bright-cyan/80 hover:to-aurora-neon-purple/80 text-white font-medium py-3"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Criando sua conta...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                Criar Minha Conta
              </div>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};