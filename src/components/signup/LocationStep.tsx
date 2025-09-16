import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface LocationStepProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
  onNext: () => void;
  onPrev: () => void;
  isLoading: boolean;
}

const estados = [
  { value: 'AC', label: 'Acre' },
  { value: 'AL', label: 'Alagoas' },
  { value: 'AP', label: 'Amapá' },
  { value: 'AM', label: 'Amazonas' },
  { value: 'BA', label: 'Bahia' },
  { value: 'CE', label: 'Ceará' },
  { value: 'DF', label: 'Distrito Federal' },
  { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' },
  { value: 'MA', label: 'Maranhão' },
  { value: 'MT', label: 'Mato Grosso' },
  { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'PA', label: 'Pará' },
  { value: 'PB', label: 'Paraíba' },
  { value: 'PR', label: 'Paraná' },
  { value: 'PE', label: 'Pernambuco' },
  { value: 'PI', label: 'Piauí' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'RN', label: 'Rio Grande do Norte' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'RO', label: 'Rondônia' },
  { value: 'RR', label: 'Roraima' },
  { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'São Paulo' },
  { value: 'SE', label: 'Sergipe' },
  { value: 'TO', label: 'Tocantins' }
];

export const LocationStep: React.FC<LocationStepProps> = ({
  formData,
  updateFormData,
  onNext,
  onPrev,
  isLoading
}) => {
  const formatPhoneNumber = (value: string) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    
    // Aplica a máscara (11) 99999-9999
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 11) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
    }
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    updateFormData('telefone', formatted);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium text-white mb-2">
          Localização e Contato
        </h3>
        <p className="text-slate-400 text-sm">
          Essas informações nos ajudam a personalizar sua experiência e conectar você com oportunidades locais.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Estado */}
        <div className="space-y-2">
          <Label className="text-white">
            Estado
          </Label>
          <Select
            value={formData.estado || ''}
            onValueChange={(value) => updateFormData('estado', value)}
          >
            <SelectTrigger className="bg-aurora-space-black/50">
              <SelectValue placeholder="Selecione seu estado" />
            </SelectTrigger>
            <SelectContent>
              {estados.map((estado) => (
                <SelectItem key={estado.value} value={estado.value}>
                  {estado.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Cidade */}
        <div className="space-y-2">
          <Label htmlFor="cidade" className="text-white">
            Cidade
          </Label>
          <Input
            id="cidade"
            type="text"
            placeholder="Digite sua cidade"
            value={formData.cidade || ''}
            onChange={(e) => updateFormData('cidade', e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            className="bg-aurora-space-black/50"
          />
        </div>

        {/* Telefone */}
        <div className="space-y-2">
          <Label htmlFor="telefone" className="text-white">
            WhatsApp / Telefone
          </Label>
          <Input
            id="telefone"
            type="tel"
            placeholder="(11) 99999-9999"
            value={formData.telefone || ''}
            onChange={(e) => handlePhoneChange(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            className="bg-aurora-space-black/50"
            maxLength={15}
          />
          <p className="text-xs text-slate-400">
            Usado para contato sobre oportunidades e suporte
          </p>
        </div>

        {/* Endereço Completo (Opcional) */}
        <div className="space-y-2">
          <Label htmlFor="endereco" className="text-white">
            Endereço Completo (opcional)
          </Label>
          <Input
            id="endereco"
            type="text"
            placeholder="Rua, número, bairro..."
            value={formData.endereco_completo || ''}
            onChange={(e) => updateFormData('endereco_completo', e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            className="bg-aurora-space-black/50"
          />
          <p className="text-xs text-slate-400">
            Ajuda a encontrar profissionais e serviços próximos
          </p>
        </div>

        {/* Informações sobre dados */}
        <div className="bg-aurora-space-black/30 border border-aurora-electric-purple/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-aurora-bright-cyan rounded-full mt-2 flex-shrink-0"></div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-white">
                Seus dados estão seguros
              </p>
              <p className="text-xs text-slate-400 leading-relaxed">
                Utilizamos essas informações apenas para personalizar sua experiência. 
                Você pode pular qualquer campo opcional e alterar essas informações a qualquer momento.
              </p>
            </div>
          </div>
        </div>

        {/* Submit Button - Hidden, controlled by parent */}
        <Button type="submit" className="hidden">
          Continue
        </Button>
      </form>
    </div>
  );
};