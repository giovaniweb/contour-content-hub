
import React from 'react';
import Layout from '@/components/Layout';
import EquipmentManager from '@/components/admin/EquipmentManager';

const AdminEquipments: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto py-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Gerenciar Equipamentos</h1>
          </div>
          <EquipmentManager />
        </div>
      </div>
    </Layout>
  );
};

export default AdminEquipments;
