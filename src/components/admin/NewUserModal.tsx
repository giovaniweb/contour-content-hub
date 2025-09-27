import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { User } from 'lucide-react';
import { toast } from 'sonner';
import { createCompleteUser, checkExistingProfile, type CreateUserData } from '@/services/auth/userManagement';
import { UserRegistrationForm } from '@/components/forms/UserRegistrationForm';
import type { UserRole } from '@/types/auth';

interface NewUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const NewUserModal: React.FC<NewUserModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateUser = async (formData: any) => {
    setIsLoading(true);

    try {
      console.log('🚀 [NewUserModal] Iniciando criação:', formData);
      
      // Check if user already exists first
      const exists = await checkExistingProfile(formData.email);
      if (exists) {
        throw new Error('Este email já está em uso');
      }
      
      const normalizedData = {
        nome: formData.nome?.trim(),
        email: formData.email?.trim()?.toLowerCase(),
        password: formData.password,
        role: formData.role || 'cliente',
        telefone: formData.telefone?.trim() || undefined,
        cidade: formData.cidade?.trim() || undefined,
        clinica: formData.clinica?.trim() || undefined,
        especialidade: formData.especialidade?.trim() || undefined,
        experiencia: formData.experiencia?.trim() || undefined,
        estado: formData.estado?.trim() || undefined,
        endereco_completo: formData.endereco_completo?.trim() || undefined,
        equipamentos: formData.equipamentos?.length ? formData.equipamentos : undefined,
        observacoes_conteudo: formData.observacoes_conteudo?.trim() || undefined,
        idioma: (formData.idioma as "PT" | "EN" | "ES") || 'PT',
        foto_url: formData.foto_url?.trim() || undefined
      };

      console.log('📊 [NewUserModal] Dados normalizados:', normalizedData);
      
      await createCompleteUser(normalizedData as CreateUserData);
      
      toast.success('Usuário criado com sucesso!', {
        description: 'O usuário foi criado e pode fazer login imediatamente.'
      });
      
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('❌ [NewUserModal] Erro:', error);
      
      const errorMessage = error.message || 'Erro desconhecido ao criar usuário';
      
      // Só mostrar toast de erro se realmente houver erro
      toast.error('Erro ao criar usuário', {
        description: errorMessage
      });
      
      // Não fechar o modal em caso de erro para o usuário tentar novamente
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Criar Novo Usuário
          </DialogTitle>
          <DialogDescription>
            Preencha as informações para criar um novo usuário no sistema
          </DialogDescription>
        </DialogHeader>

        <UserRegistrationForm
          mode="admin"
          onSubmit={handleCreateUser}
          onSuccess={() => {}}
          isLoading={isLoading}
          showPasswordConfirmation={false}
          showTermsAcceptance={false}
          defaultValues={{ role: 'cliente' }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default NewUserModal;