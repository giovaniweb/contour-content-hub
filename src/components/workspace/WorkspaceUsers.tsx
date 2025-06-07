
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import AuroraCard from '@/components/ui/AuroraCard';
import { Button } from '@/components/ui/button';
import { Users, UserPlus, MoreHorizontal } from 'lucide-react';
import InviteUserModal from './InviteUserModal';

const WorkspaceUsers: React.FC = () => {
  const { user } = useAuth();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // Mock users data - in a real app this would come from the database
  const mockUsers = [
    {
      id: '1',
      name: user?.user_metadata?.name || user?.email?.split('@')[0] || 'Usuário',
      email: user?.email || '',
      role: user?.user_metadata?.role || 'admin',
      avatar: user?.user_metadata?.avatar_url || '',
      isCurrentUser: true
    },
    {
      id: '2',
      name: 'Maria Silva',
      email: 'maria@exemplo.com',
      role: 'user',
      avatar: '',
      isCurrentUser: false
    },
    {
      id: '3',
      name: 'João Santos',
      email: 'joao@exemplo.com',
      role: 'manager',
      avatar: '',
      isCurrentUser: false
    }
  ];

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="aurora-heading text-2xl font-light text-white mb-2">
            Usuários do Workspace
          </h2>
          <p className="aurora-body text-white/70">
            Gerencie os membros do seu workspace
          </p>
        </div>
        <Button onClick={() => setIsInviteModalOpen(true)}>
          <UserPlus className="w-4 h-4 mr-2" />
          Convidar Usuário
        </Button>
      </div>

      <AuroraCard className="p-6">
        <div className="space-y-4">
          {mockUsers.map((workspaceUser) => (
            <div key={workspaceUser.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-aurora-electric-purple to-aurora-neon-blue rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-white">
                    {workspaceUser.name}
                    {workspaceUser.isCurrentUser && (
                      <span className="ml-2 text-xs bg-aurora-electric-purple px-2 py-1 rounded">
                        Você
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-white/70">{workspaceUser.email}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className="text-sm text-white/80 capitalize">
                  {workspaceUser.role}
                </span>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </AuroraCard>

      <InviteUserModal 
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
      />
    </div>
  );
};

export default WorkspaceUsers;
