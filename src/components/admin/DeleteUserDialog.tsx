import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, User, Mail, Shield } from 'lucide-react';

interface User {
  id: string;
  nome?: string;
  email: string;
  role: string;
  cidade?: string;
  clinica?: string;
  telefone?: string;
  data_criacao?: string;
}

interface DeleteUserDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

export function DeleteUserDialog({ 
  user, 
  open, 
  onOpenChange, 
  onConfirm, 
  isDeleting 
}: DeleteUserDialogProps) {
  const [confirmText, setConfirmText] = useState('');
  const expectedText = 'EXCLUIR';
  const isConfirmValid = confirmText === expectedText;

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setConfirmText('');
    }
    onOpenChange(newOpen);
  };

  const handleConfirm = () => {
    if (isConfirmValid) {
      onConfirm();
      setConfirmText('');
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'superadmin':
        return 'bg-red-500 hover:bg-red-600 text-white';
      case 'admin':
        return 'bg-orange-500 hover:bg-orange-600 text-white';
      case 'gerente':
        return 'bg-blue-500 hover:bg-blue-600 text-white';
      case 'operador':
        return 'bg-green-500 hover:bg-green-600 text-white';
      case 'consultor':
        return 'bg-purple-500 hover:bg-purple-600 text-white';
      case 'cliente':
        return 'bg-yellow-500 hover:bg-yellow-600 text-black';
      default:
        return 'bg-gray-500 hover:bg-gray-600 text-white';
    }
  };

  if (!user) return null;

  const isSuperAdmin = user.role === 'superadmin';
  const isHighPrivilegeUser = ['admin', 'superadmin'].includes(user.role);

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Excluir Usuário
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Esta ação é <strong>irreversível</strong> e irá excluir permanentemente:
              </p>
              
              {/* User Info Card */}
              <div className="bg-muted p-4 rounded-lg space-y-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{user.nome || 'Nome não informado'}</span>
                  <Badge className={getRoleBadgeColor(user.role)}>
                    {user.role}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{user.email}</span>
                </div>
                
                {user.clinica && (
                  <div className="text-sm text-muted-foreground">
                    <strong>Clínica:</strong> {user.clinica}
                  </div>
                )}
                
                {user.cidade && (
                  <div className="text-sm text-muted-foreground">
                    <strong>Cidade:</strong> {user.cidade}
                  </div>
                )}
              </div>

              {/* Warning for high privilege users */}
              {isHighPrivilegeUser && (
                <div className="bg-destructive/10 border border-destructive/20 p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-destructive font-medium mb-1">
                    <Shield className="h-4 w-4" />
                    Usuário Administrativo
                  </div>
                  <p className="text-sm text-destructive/80">
                    {isSuperAdmin 
                      ? 'Este é um SUPERADMINISTRADOR. Certifique-se de que existe outro superadmin ativo.' 
                      : 'Este é um administrador com privilégios elevados.'}
                  </p>
                </div>
              )}

              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Conta do usuário e perfil</li>
                <li>Todos os dados relacionados (favoritos, downloads, avaliações)</li>
                <li>Histórico de ações e gamificação</li>
                <li>Acesso a cursos da academia</li>
                <li>Agenda e alertas configurados</li>
              </ul>

              <div className="space-y-2">
                <Label htmlFor="confirm-text" className="text-sm font-medium">
                  Para confirmar, digite <strong>{expectedText}</strong>:
                </Label>
                <Input
                  id="confirm-text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
                  placeholder="Digite EXCLUIR para confirmar"
                  className="font-mono"
                />
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={!isConfirmValid || isDeleting}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isDeleting ? 'Excluindo...' : 'Excluir Permanentemente'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}