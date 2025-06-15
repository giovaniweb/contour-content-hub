
import React from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import EquipmentManager from '@/components/admin/EquipmentManager';

// Audit: garantir que só existem imports necessários, pois páginas ContentStrategy/Ideas etc foram removidas

const AdminEquipments: React.FC = () => {
  return (
    <AdminLayout>
      <div className="aurora-dark-bg min-h-screen">
        <div className="aurora-particles">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="aurora-particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDuration: `${10 + Math.random() * 20}s`,
                animationDelay: `${Math.random() * 10}s`
              }}
            />
          ))}
        </div>
        
        <div className="container mx-auto py-8 px-4 relative z-10">
          <div className="mb-8">
            <h1 className="aurora-text-gradient text-4xl font-light mb-4">
              Gerenciar Equipamentos
            </h1>
            <p className="aurora-body text-white/70 text-lg">
              Administre os equipamentos do sistema de forma intuitiva e eficiente.
            </p>
          </div>
          
          <div className="aurora-glass rounded-3xl p-8 backdrop-blur-2xl border border-aurora-electric-purple/20">
            <EquipmentManager />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminEquipments;
