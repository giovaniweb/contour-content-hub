
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Profile: React.FC = () => {
  const { user } = useAuth();

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <User className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Meu Perfil</h1>
            <p className="text-muted-foreground">
              Gerencie suas informações pessoais
            </p>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Informações do Usuário</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Nome</label>
              <p className="text-lg">{user?.nome || 'Não informado'}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium">Email</label>
              <p className="text-lg">{user?.email || 'Não informado'}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium">Função</label>
              <p className="text-lg capitalize">{user?.role || 'Não informado'}</p>
            </div>
            
            {user?.clinica && (
              <div>
                <label className="text-sm font-medium">Clínica</label>
                <p className="text-lg">{user.clinica}</p>
              </div>
            )}
            
            {user?.cidade && (
              <div>
                <label className="text-sm font-medium">Cidade</label>
                <p className="text-lg">{user.cidade}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Profile;
