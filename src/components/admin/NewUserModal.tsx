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

    // Normalizar payload - remover campos vazios
    const normalizedUserData = { ...formData };
    
    // Remover campos de string vazios
    Object.keys(normalizedUserData).forEach(key => {
      const value = normalizedUserData[key];
      if (typeof value === 'string' && !value.trim()) {
        delete normalizedUserData[key];
      }
    });

    // Manter arrays apenas quando têm itens
    if (!normalizedUserData.equipamentos || normalizedUserData.equipamentos.length === 0) {
      delete normalizedUserData.equipamentos;
    }

    try {
      // Check if user already exists
      const exists = await checkExistingProfile(formData.email);
      if (exists) {
        throw new Error('Este email já está em uso');
      }

      await createCompleteUser(normalizedUserData);
      toast.success('Usuário criado com sucesso!');
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Erro ao criar usuário:', error);
      throw new Error(error.message || 'Não foi possível criar o usuário. Tente novamente.');
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