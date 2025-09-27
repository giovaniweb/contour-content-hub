import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import type { UserRole } from '@/types/auth';

// Validation schema
const userRegistrationSchema = z.object({
  nome: z.string()
    .min(1, 'Nome é obrigatório')
    .max(100, 'Nome deve ter menos de 100 caracteres'),
  email: z.string()
    .min(1, 'Email é obrigatório')
    .email('Email inválido')
    .max(255, 'Email deve ter menos de 255 caracteres'),
  password: z.string()
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .max(128, 'Senha deve ter menos de 128 caracteres'),
  confirmPassword: z.string().optional(),
  role: z.string().min(1, 'Função é obrigatória'),
  telefone: z.string().optional(),
  clinica: z.string().max(200, 'Nome da clínica deve ter menos de 200 caracteres').optional(),
  cidade: z.string().max(100, 'Nome da cidade deve ter menos de 100 caracteres').optional(),
  estado: z.string().max(2, 'Estado deve ter 2 caracteres').optional(),
  endereco_completo: z.string().max(500, 'Endereço deve ter menos de 500 caracteres').optional(),
  especialidade: z.string().optional(),
  experiencia: z.string().optional(),
  observacoes_conteudo: z.string().max(1000, 'Observações devem ter menos de 1000 caracteres').optional(),
  idioma: z.enum(['PT', 'EN', 'ES']).optional(),
  foto_url: z.string().url().optional().or(z.literal('')),
  equipamentos: z.array(z.string()).optional(),
  acceptTerms: z.boolean().optional(),
}).refine((data) => {
  if (data.confirmPassword !== undefined) {
    return data.password === data.confirmPassword;
  }
  return true;
}, {
  message: "Senhas não coincidem",
  path: ["confirmPassword"],
});

type UserRegistrationData = z.infer<typeof userRegistrationSchema>;

export interface UserRegistrationFormProps {
  mode: 'public' | 'admin';
  defaultValues?: Partial<UserRegistrationData>;
  onSubmit: (data: UserRegistrationData) => Promise<void>;
  onSuccess?: () => void;
  isLoading?: boolean;
  showPasswordConfirmation?: boolean;
  showTermsAcceptance?: boolean;
  className?: string;
}

const ROLES = [
  { value: 'cliente', label: 'Cliente' },
  { value: 'consultor', label: 'Consultor' },
  { value: 'operador', label: 'Operador' },
  { value: 'gerente', label: 'Gerente' },
  { value: 'admin', label: 'Administrador' }
];

const ESPECIALIDADES = [
  'Médico Dermatologista',
  'Médico Clínico Geral', 
  'Enfermeiro(a)',
  'Fisioterapeuta',
  'Biomédico(a)',
  'Esteticista',
  'Cosmetólogo(a)',
  'Técnico em Estética',
  'Outros'
];

const ESTADOS_BRASIL = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 
  'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 
  'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

const EQUIPAMENTOS_COMUNS = [
  'Laser CO2',
  'Laser Nd:YAG', 
  'IPL',
  'Radiofrequência',
  'Ultrassom Focado',
  'Criolipólise',
  'Microagulhamento',
  'Peeling Químico',
  'Luz Pulsada',
  'Outros'
];

export const UserRegistrationForm: React.FC<UserRegistrationFormProps> = ({
  mode,
  defaultValues = {},
  onSubmit,
  onSuccess,
  isLoading = false,
  showPasswordConfirmation = mode === 'public',
  showTermsAcceptance = mode === 'public',
  className = ""
}) => {
  const [selectedEquipamentos, setSelectedEquipamentos] = useState<string[]>(
    defaultValues.equipamentos || []
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<UserRegistrationData>({
    resolver: zodResolver(userRegistrationSchema),
    defaultValues: {
      idioma: 'PT',
      role: 'cliente',
      equipamentos: [],
      acceptTerms: false,
      ...defaultValues
    }
  });

  const watchedRole = watch('role');
  const watchedAcceptTerms = watch('acceptTerms');

  const handleFormSubmit = async (data: UserRegistrationData) => {
    try {
      // Add selected equipamentos to form data
      const finalData = {
        ...data,
        equipamentos: selectedEquipamentos
      };
      
      // Remove confirmPassword from submission data
      if (finalData.confirmPassword !== undefined) {
        delete finalData.confirmPassword;
      }
      
      // Remove acceptTerms from submission data
      if (finalData.acceptTerms !== undefined) {
        delete finalData.acceptTerms;
      }

      await onSubmit(finalData);
      onSuccess?.();
    } catch (error: any) {
      console.error('Erro no formulário de registro:', error);
      toast.error('Erro ao criar usuário', {
        description: error.message || 'Não foi possível criar o usuário. Tente novamente.'
      });
    }
  };

  const addEquipamento = (equipamento: string) => {
    if (!selectedEquipamentos.includes(equipamento)) {
      const newEquipamentos = [...selectedEquipamentos, equipamento];
      setSelectedEquipamentos(newEquipamentos);
      setValue('equipamentos', newEquipamentos);
    }
  };

  const removeEquipamento = (equipamento: string) => {
    const newEquipamentos = selectedEquipamentos.filter(e => e !== equipamento);
    setSelectedEquipamentos(newEquipamentos);
    setValue('equipamentos', newEquipamentos);
  };

  const isAdminMode = mode === 'admin';
  const showAdvancedFields = isAdminMode || watchedRole !== 'cliente';

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className={`space-y-6 ${className}`}>
      {/* Informações Básicas */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome Completo *</Label>
            <Input
              id="nome"
              {...register('nome')}
              placeholder="Nome completo"
              disabled={isLoading}
            />
            {errors.nome && (
              <p className="text-sm text-red-500">{errors.nome.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="email@exemplo.com"
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="password">Senha *</Label>
            <Input
              id="password"
              type="password"
              {...register('password')}
              placeholder="Senha (mínimo 6 caracteres)"
              disabled={isLoading}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          {showPasswordConfirmation && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha *</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...register('confirmPassword')}
                placeholder="Confirme sua senha"
                disabled={isLoading}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="role">Função *</Label>
            <Select 
              onValueChange={(value) => setValue('role', value)}
              defaultValue={defaultValues.role || 'cliente'}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a função" />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map(role => (
                  <SelectItem 
                    key={role.value} 
                    value={role.value}
                    style={{ display: (!isAdminMode && role.value === 'admin') ? 'none' : 'flex' }}
                  >
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-sm text-red-500">{errors.role.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefone">Telefone/WhatsApp</Label>
            <Input
              id="telefone"
              {...register('telefone')}
              placeholder="(11) 99999-9999"
              disabled={isLoading}
            />
            {errors.telefone && (
              <p className="text-sm text-red-500">{errors.telefone.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Informações Profissionais - Mostrar quando não é cliente ou é admin */}
      {showAdvancedFields && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Informações Profissionais</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="especialidade">Especialidade</Label>
              <Select 
                onValueChange={(value) => setValue('especialidade', value)}
                defaultValue={defaultValues.especialidade}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a especialidade" />
                </SelectTrigger>
                <SelectContent>
                  {ESPECIALIDADES.map(esp => (
                    <SelectItem key={esp} value={esp}>
                      {esp}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="clinica">Clínica/Consultório</Label>
              <Input
                id="clinica"
                {...register('clinica')}
                placeholder="Nome da clínica ou consultório"
                disabled={isLoading}
              />
              {errors.clinica && (
                <p className="text-sm text-red-500">{errors.clinica.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="experiencia">Tempo de Experiência</Label>
            <Select 
              onValueChange={(value) => setValue('experiencia', value)}
              defaultValue={defaultValues.experiencia}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tempo de experiência" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="menos_1_ano">Menos de 1 ano</SelectItem>
                <SelectItem value="1_3_anos">1 a 3 anos</SelectItem>
                <SelectItem value="3_5_anos">3 a 5 anos</SelectItem>
                <SelectItem value="5_10_anos">5 a 10 anos</SelectItem>
                <SelectItem value="mais_10_anos">Mais de 10 anos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Localização */}
      {showAdvancedFields && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Localização</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cidade">Cidade</Label>
              <Input
                id="cidade"
                {...register('cidade')}
                placeholder="São Paulo"
                disabled={isLoading}
              />
              {errors.cidade && (
                <p className="text-sm text-red-500">{errors.cidade.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              <Select 
                onValueChange={(value) => setValue('estado', value)}
                defaultValue={defaultValues.estado}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="UF" />
                </SelectTrigger>
                <SelectContent>
                  {ESTADOS_BRASIL.map(estado => (
                    <SelectItem key={estado} value={estado}>
                      {estado}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="idioma">Idioma</Label>
              <Select 
                onValueChange={(value) => setValue('idioma', value as 'PT' | 'EN' | 'ES')}
                defaultValue={defaultValues.idioma || 'PT'}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PT">Português</SelectItem>
                  <SelectItem value="EN">English</SelectItem>
                  <SelectItem value="ES">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="endereco_completo">Endereço Completo</Label>
            <Textarea
              id="endereco_completo"
              {...register('endereco_completo')}
              placeholder="Rua, número, bairro, complemento..."
              rows={2}
              disabled={isLoading}
            />
            {errors.endereco_completo && (
              <p className="text-sm text-red-500">{errors.endereco_completo.message}</p>
            )}
          </div>
        </div>
      )}

      {/* Equipamentos */}
      {showAdvancedFields && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Equipamentos de Interesse</h3>
          
          <div className="space-y-2">
            <Label>Adicionar Equipamento</Label>
            <Select onValueChange={addEquipamento} disabled={isLoading}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um equipamento" />
              </SelectTrigger>
              <SelectContent>
                {EQUIPAMENTOS_COMUNS.map(eq => (
                  <SelectItem key={eq} value={eq}>
                    {eq}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Equipamentos Selecionados</Label>
            <div className="flex flex-wrap gap-2 min-h-[40px] p-3 border rounded-md bg-muted/30">
              {selectedEquipamentos.length ? (
                selectedEquipamentos.map((equipamento) => (
                  <Badge
                    key={equipamento}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {equipamento}
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-destructive"
                      onClick={() => removeEquipamento(equipamento)}
                    />
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">Nenhum equipamento selecionado</span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes_conteudo">Observações Adicionais</Label>
            <Textarea
              id="observacoes_conteudo"
              {...register('observacoes_conteudo')}
              placeholder="Informações adicionais, interesses específicos, etc."
              rows={3}
              disabled={isLoading}
            />
            {errors.observacoes_conteudo && (
              <p className="text-sm text-red-500">{errors.observacoes_conteudo.message}</p>
            )}
          </div>
        </div>
      )}

      {/* Termos de Uso - apenas no modo público */}
      {showTermsAcceptance && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="acceptTerms"
              {...register('acceptTerms', { 
                required: mode === 'public' ? 'Você deve aceitar os termos de uso' : false 
              })}
              disabled={isLoading}
              className="h-4 w-4"
            />
            <Label htmlFor="acceptTerms" className="text-sm">
              Aceito os{' '}
              <a href="/terms" className="text-primary hover:underline" target="_blank">
                Termos de Uso
              </a>{' '}
              e{' '}
              <a href="/privacy" className="text-primary hover:underline" target="_blank">
                Política de Privacidade
              </a>
            </Label>
          </div>
          {errors.acceptTerms && (
            <p className="text-sm text-red-500">{errors.acceptTerms.message}</p>
          )}
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full"
        disabled={isLoading || (showTermsAcceptance && !watchedAcceptTerms)}
      >
        {isLoading ? 'Criando usuário...' : 'Criar Usuário'}
      </Button>
    </form>
  );
};