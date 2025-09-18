import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Stethoscope, Sparkles, User, GraduationCap, Building2 } from "lucide-react";

interface ProfessionalStepProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
  onNext: () => void;
  onPrev: () => void;
  isLoading: boolean;
}

const profileTypes = [
  {
    id: 'cliente',
    label: 'Clínica Médica',
    icon: Stethoscope,
    description: 'Médicos, dermatologistas, cirurgiões plásticos'
  },
  {
    id: 'profissional_estetica',
    label: 'Clínica Estética',
    icon: Sparkles,
    description: 'Estética facial e corporal, harmonização'
  },
  {
    id: 'consultor',
    label: 'Profissional Independente',
    icon: User,
    description: 'Profissional autônomo ou freelancer'
  },
  {
    id: 'operador',
    label: 'Estudante/Acadêmico',
    icon: GraduationCap,
    description: 'Estudante da área da saúde ou estética'
  },
  {
    id: 'gerente',
    label: 'Empresa/Distribuidor',
    icon: Building2,
    description: 'Empresas de equipamentos ou distribuidores'
  }
];

const especialidades = {
  cliente: [
    'Dermatologia',
    'Cirurgia Plástica',
    'Medicina Estética',
    'Medicina Geral',
    'Ginecologia',
    'Ortopedia',
    'Cardiologia',
    'Endocrinologia',
    'Outras'
  ],
  profissional_estetica: [
    'Estética Facial',
    'Estética Corporal',
    'Harmonização Facial',
    'Depilação a Laser',
    'Tratamentos Corporais',
    'Micropigmentação',
    'Lash Design',
    'Outras'
  ],
  consultor: [
    'Marketing Digital',
    'Vendas',
    'Consultoria',
    'Treinamento',
    'Outras'
  ],
  operador: [
    'Medicina',
    'Biomedicina',
    'Enfermagem',
    'Fisioterapia',
    'Estética e Cosmética',
    'Farmácia',
    'Outras'
  ],
  gerente: [
    'Equipamentos Médicos',
    'Equipamentos Estéticos',
    'Cosméticos',
    'Distribuição',
    'Representação',
    'Outras'
  ]
};

export const ProfessionalStep: React.FC<ProfessionalStepProps> = ({
  formData,
  updateFormData,
  onNext,
  onPrev,
  isLoading
}) => {
  const selectedType = formData.role || 'cliente';
  const availableEspecialidades = especialidades[selectedType as keyof typeof especialidades] || [];

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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Tipo de Perfil */}
      <div className="space-y-4">
        <Label className="text-white text-lg">
          Qual seu perfil profissional? *
        </Label>
        <RadioGroup
          value={selectedType}
          onValueChange={(value) => updateFormData('role', value)}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {profileTypes.map((type) => {
            const Icon = type.icon;
            return (
              <div key={type.id}>
                <RadioGroupItem
                  value={type.id}
                  id={type.id}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={type.id}
                  className={`
                    flex items-start space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all
                    hover:border-aurora-cyan/70 hover:bg-aurora-cyan/20 hover:shadow-lg hover:shadow-aurora-cyan/20
                    peer-checked:border-aurora-cyan peer-checked:bg-aurora-cyan/20 peer-checked:shadow-lg peer-checked:shadow-aurora-cyan/30
                    ${selectedType === type.id 
                      ? 'border-aurora-cyan bg-aurora-cyan/20 shadow-lg shadow-aurora-cyan/30' 
                      : 'border-aurora-electric-purple/40 bg-aurora-space-black/40'
                    }
                  `}
                >
                  <Icon className={`
                    w-6 h-6 mt-1 flex-shrink-0 transition-colors
                    ${selectedType === type.id ? 'text-aurora-cyan' : 'text-slate-300'}
                  `} />
                  <div className="space-y-1">
                    <div className={`font-medium transition-colors ${
                      selectedType === type.id ? 'text-aurora-cyan' : 'text-white'
                    }`}>
                      {type.label}
                    </div>
                    <div className={`text-sm transition-colors ${
                      selectedType === type.id ? 'text-aurora-cyan/80' : 'text-slate-300'
                    }`}>
                      {type.description}
                    </div>
                  </div>
                </Label>
              </div>
            );
          })}
        </RadioGroup>
      </div>

      {/* Nome da Clínica/Empresa (condicional) */}
      {(selectedType === 'cliente' || selectedType === 'profissional_estetica' || selectedType === 'gerente') && (
        <div className="space-y-2">
          <Label htmlFor="clinica" className="text-white">
            {selectedType === 'gerente' ? 'Nome da Empresa' : 'Nome da Clínica'}
          </Label>
          <Input
            id="clinica"
            type="text"
            placeholder={selectedType === 'gerente' ? "Digite o nome da empresa" : "Digite o nome da clínica"}
            value={formData.clinica || ''}
            onChange={(e) => updateFormData('clinica', e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            className="bg-aurora-space-black/50"
          />
        </div>
      )}

      {/* Especialidade */}
      <div className="space-y-2">
        <Label className="text-white">
          Especialidade / Área de Atuação
        </Label>
        <Select
          value={formData.especialidade || ''}
          onValueChange={(value) => updateFormData('especialidade', value)}
        >
          <SelectTrigger className="bg-aurora-space-black/50">
            <SelectValue placeholder="Selecione sua especialidade" />
          </SelectTrigger>
          <SelectContent>
            {availableEspecialidades.map((esp) => (
              <SelectItem key={esp} value={esp}>
                {esp}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Experiência */}
      <div className="space-y-2">
        <Label className="text-white">
          Tempo de Experiência
        </Label>
        <Select
          value={formData.experiencia || ''}
          onValueChange={(value) => updateFormData('experiencia', value)}
        >
          <SelectTrigger className="bg-aurora-space-black/50">
            <SelectValue placeholder="Selecione seu tempo de experiência" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="iniciante">Iniciante (menos de 1 ano)</SelectItem>
            <SelectItem value="1-3">1 a 3 anos</SelectItem>
            <SelectItem value="3-5">3 a 5 anos</SelectItem>
            <SelectItem value="5-10">5 a 10 anos</SelectItem>
            <SelectItem value="10+">Mais de 10 anos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Objetivos (opcional) */}
      <div className="space-y-2">
        <Label htmlFor="objetivos" className="text-white">
          Como pretende usar a plataforma? (opcional)
        </Label>
        <Textarea
          id="objetivos"
          placeholder="Ex: Criar conteúdo para redes sociais, aprender sobre novos equipamentos, gerar leads..."
          value={formData.observacoes_conteudo || ''}
          onChange={(e) => updateFormData('observacoes_conteudo', e.target.value)}
          disabled={isLoading}
          className="bg-aurora-space-black/50 min-h-[80px]"
        />
      </div>

      {/* Submit Button - Hidden, controlled by parent */}
      <Button type="submit" className="hidden">
        Continue
      </Button>
    </form>
  );
};