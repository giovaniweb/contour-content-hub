import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Phone, MapPin, Building, Briefcase, Globe, Clock, Package } from 'lucide-react';

interface UserData {
  id: string;
  nome: string;
  email: string;
  role: string;
  telefone?: string;
  cidade?: string;
  estado?: string;
  endereco_completo?: string;
  clinica?: string;
  especialidade?: string;
  equipamentos?: string[];
  idioma?: string;
  observacoes_conteudo?: string;
  data_criacao?: string;
  foto_url?: string;
}

interface UserViewModalProps {
  user: UserData | null;
  isOpen: boolean;
  onClose: () => void;
}

const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case 'admin': return 'bg-red-100 text-red-800 border-red-300';
    case 'superadmin': return 'bg-purple-100 text-purple-800 border-purple-300';
    case 'consultor': return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'operador': return 'bg-green-100 text-green-800 border-green-300';
    case 'gerente': return 'bg-orange-100 text-orange-800 border-orange-300';
    default: return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

const UserViewModal: React.FC<UserViewModalProps> = ({ user, isOpen, onClose }) => {
  if (!user) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Não informado';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getLanguageLabel = (lang?: string) => {
    switch (lang) {
      case 'PT': return 'Português';
      case 'EN': return 'English';
      case 'ES': return 'Español';
      default: return 'Não informado';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Detalhes do Usuário
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5" />
                Informações Básicas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Nome Completo</label>
                  <p className="text-lg font-medium">{user.nome || 'Não informado'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Função</label>
                  <div className="mt-1">
                    <Badge className={getRoleBadgeColor(user.role)}>
                      {user.role || 'Não informado'}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p>{user.email || 'Não informado'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Telefone</label>
                    <p>{user.telefone || 'Não informado'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações Profissionais */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Informações Profissionais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Clínica/Consultório</label>
                    <p>{user.clinica || 'Não informado'}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Especialidade</label>
                  <p>{user.especialidade || 'Não informado'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Localização */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Localização
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Cidade</label>
                  <p>{user.cidade || 'Não informado'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Estado</label>
                  <p>{user.estado || 'Não informado'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Idioma</label>
                    <p>{getLanguageLabel(user.idioma)}</p>
                  </div>
                </div>
              </div>
              
              {user.endereco_completo && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Endereço Completo</label>
                  <p className="mt-1 p-3 bg-muted/30 rounded-md">{user.endereco_completo}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Equipamentos */}
          {user.equipamentos && user.equipamentos.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Equipamentos de Interesse
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {user.equipamentos.map((equipamento, index) => (
                    <Badge key={index} variant="outline">
                      {equipamento}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Observações */}
          {user.observacoes_conteudo && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Observações Adicionais</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="p-3 bg-muted/30 rounded-md whitespace-pre-wrap">
                  {user.observacoes_conteudo}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Informações do Sistema */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Informações do Sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <label className="text-sm font-medium text-muted-foreground">ID do Usuário</label>
                <p className="font-mono text-sm">{user.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Data de Criação</label>
                <p>{formatDate(user.data_criacao)}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserViewModal;