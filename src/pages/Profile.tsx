
import React from 'react';
import { useAuth } from '@/context/AuthContext';

const Profile: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Perfil</h1>
        <div className="bg-slate-800 p-6 rounded-lg">
          <div className="mb-4">
            <label className="text-slate-400">Nome:</label>
            <p className="text-white">{user?.nome || 'Não informado'}</p>
          </div>
          <div className="mb-4">
            <label className="text-slate-400">Email:</label>
            <p className="text-white">{user?.email}</p>
          </div>
          <div className="mb-4">
            <label className="text-slate-400">Role:</label>
            <p className="text-white">{user?.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
