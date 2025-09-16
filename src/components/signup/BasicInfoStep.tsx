import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Check, X } from "lucide-react";
import { toast } from "sonner";

interface BasicInfoStepProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
  onNext: () => void;
  onPrev: () => void;
  isLoading: boolean;
}

export const BasicInfoStep: React.FC<BasicInfoStepProps> = ({
  formData,
  updateFormData,
  onNext,
  isLoading
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');

  const checkEmailAvailability = async (email: string) => {
    if (!email || !email.includes('@')) {
      setEmailStatus('idle');
      return;
    }

    setIsCheckingEmail(true);
    setEmailStatus('checking');

    try {
      // Simple email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setEmailStatus('idle');
        return;
      }

      // In a real app, you would check with your backend
      // For now, we'll just validate the format
      setEmailStatus('available');
    } catch (error) {
      setEmailStatus('idle');
    } finally {
      setIsCheckingEmail(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password || '');
  const passwordsMatch = formData.password && formData.confirmPassword && 
                        formData.password === formData.confirmPassword;

  const handleEmailChange = (email: string) => {
    updateFormData('email', email);
    
    // Debounce email checking
    clearTimeout((window as any).emailCheckTimeout);
    (window as any).emailCheckTimeout = setTimeout(() => {
      checkEmailAvailability(email);
    }, 500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome?.trim()) {
      toast.error('Nome é obrigatório');
      return;
    }
    
    if (!formData.email?.trim()) {
      toast.error('Email é obrigatório');
      return;
    }
    
    if (!formData.password) {
      toast.error('Senha é obrigatória');
      return;
    }
    
    if (passwordStrength < 3) {
      toast.error('Senha deve ter pelo menos 8 caracteres com letras e números');
      return;
    }
    
    if (!passwordsMatch) {
      toast.error('Senhas não conferem');
      return;
    }
    
    onNext();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Nome Completo */}
      <div className="space-y-2">
        <Label htmlFor="nome" className="text-white">
          Nome Completo *
        </Label>
        <Input
          id="nome"
          type="text"
          placeholder="Seu nome completo"
          value={formData.nome || ''}
          onChange={(e) => updateFormData('nome', e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
          className="bg-aurora-space-black/50"
        />
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-white">
          Email *
        </Label>
        <div className="relative">
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            value={formData.email || ''}
            onChange={(e) => handleEmailChange(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            className="bg-aurora-space-black/50 pr-10"
          />
          {isCheckingEmail && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-aurora-bright-cyan border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          {emailStatus === 'available' && (
            <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500" />
          )}
          {emailStatus === 'taken' && (
            <X className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-red-500" />
          )}
        </div>
        {emailStatus === 'taken' && (
          <p className="text-xs text-red-400">Este email já está em uso</p>
        )}
      </div>

      {/* Senha */}
      <div className="space-y-2">
        <Label htmlFor="password" className="text-white">
          Senha *
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Mínimo 8 caracteres"
            value={formData.password || ''}
            onChange={(e) => updateFormData('password', e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            className="bg-aurora-space-black/50 pr-10"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4 text-slate-400" />
            ) : (
              <Eye className="w-4 h-4 text-slate-400" />
            )}
          </Button>
        </div>
        
        {/* Password Strength Indicator */}
        {formData.password && (
          <div className="space-y-2">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded ${
                    i < passwordStrength
                      ? passwordStrength >= 4
                        ? 'bg-green-500'
                        : passwordStrength >= 3
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                      : 'bg-slate-600'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-slate-400">
              {passwordStrength < 2 && 'Senha muito fraca'}
              {passwordStrength === 2 && 'Senha fraca'}
              {passwordStrength === 3 && 'Senha média'}
              {passwordStrength === 4 && 'Senha forte'}
              {passwordStrength === 5 && 'Senha muito forte'}
            </p>
          </div>
        )}
      </div>

      {/* Confirmar Senha */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-white">
          Confirmar Senha *
        </Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Digite a senha novamente"
            value={formData.confirmPassword || ''}
            onChange={(e) => updateFormData('confirmPassword', e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            className="bg-aurora-space-black/50 pr-10"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? (
              <EyeOff className="w-4 h-4 text-slate-400" />
            ) : (
              <Eye className="w-4 h-4 text-slate-400" />
            )}
          </Button>
        </div>
        
        {formData.confirmPassword && (
          <div className="flex items-center gap-2">
            {passwordsMatch ? (
              <>
                <Check className="w-4 h-4 text-green-500" />
                <span className="text-xs text-green-500">Senhas conferem</span>
              </>
            ) : (
              <>
                <X className="w-4 h-4 text-red-500" />
                <span className="text-xs text-red-500">Senhas não conferem</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Terms */}
      <div className="flex items-start space-x-2 pt-4">
        <Checkbox
          id="terms-preview"
          checked={true}
          className="mt-1"
        />
        <Label htmlFor="terms-preview" className="text-sm text-slate-300 leading-relaxed">
          Li e aceito os{" "}
          <a href="/terms" className="text-aurora-bright-cyan hover:underline">
            Termos de Uso
          </a>{" "}
          e a{" "}
          <a href="/privacy" className="text-aurora-bright-cyan hover:underline">
            Política de Privacidade
          </a>
          . Entendo que posso cancelar a qualquer momento.
        </Label>
      </div>

      {/* Submit Button - Hidden, controlled by parent */}
      <Button type="submit" className="hidden">
        Continue
      </Button>
    </form>
  );
};