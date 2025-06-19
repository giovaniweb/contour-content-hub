
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const UserSummarySection: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <Card className="aurora-glass-enhanced aurora-border-enhanced">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5 text-blue-400" />
          Informações Pessoais
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-white/70">Nome:</span>
            <span className="text-white">{user?.full_name || user?.email || 'Usuário'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/70">Email:</span>
            <span className="text-white">{user?.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/70">Perfil:</span>
            <span className="text-white capitalize">{user?.role || 'user'}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserSummarySection;
