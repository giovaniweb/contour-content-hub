import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const DeleteUserByEmailCard = () => {
  const [email, setEmail] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { toast } = useToast();

  const deleteUserMutation = useMutation({
    mutationFn: async (emailToDelete: string) => {
      const { data, error } = await supabase.functions.invoke('admin-cleanup', {
        body: { action: 'delete_user_by_email', email: emailToDelete }
      });

      console.log('Edge function response:', { data, error });

      if (error) throw error;
      if (data && !data.success) throw new Error(data.error || 'Erro ao excluir usuário');
      
      return data;
    },
    onSuccess: (data) => {
      toast({
        title: "Usuário excluído",
        description: `Email ${data.email_deleted} foi removido completamente do sistema.`,
      });
      setEmail('');
      setShowConfirmDialog(false);
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao excluir usuário",
        description: error.message || 'Ocorreu um erro inesperado',
        variant: "destructive",
      });
      setShowConfirmDialog(false);
    },
  });

  const handleConfirm = () => {
    if (!email.trim()) return;
    deleteUserMutation.mutate(email.trim().toLowerCase());
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  return (
    <Card className="border-destructive/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <Trash2 className="w-5 h-5" />
          Exclusão Direta por Email
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
          <div className="text-sm text-yellow-800">
            <p className="font-medium">Uso apenas em casos especiais</p>
            <p>Para emails "presos" em auth.users sem perfil associado. Esta ação é irreversível.</p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email-to-delete">Email do usuário</Label>
          <Input
            id="email-to-delete"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="exemplo@email.com"
            className="w-full"
          />
        </div>

        <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              disabled={!email.trim() || !isValidEmail(email) || deleteUserMutation.isPending}
              className="w-full"
              onClick={() => setShowConfirmDialog(true)}
            >
              {deleteUserMutation.isPending ? 'Excluindo...' : 'Excluir Usuário'}
            </Button>
          </AlertDialogTrigger>
          
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão definitiva</AlertDialogTitle>
              <AlertDialogDescription className="space-y-2">
                <p>Você está prestes a excluir PERMANENTEMENTE o usuário:</p>
                <p className="font-mono font-medium bg-muted px-2 py-1 rounded">{email}</p>
                <p className="text-destructive font-medium">
                  Esta ação removerá o usuário de auth.users e todos os dados relacionados. 
                  NÃO É POSSÍVEL DESFAZER.
                </p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirm}
                className="bg-destructive hover:bg-destructive/90"
              >
                Sim, excluir definitivamente
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};