
import React from 'react';
import Layout from '@/components/Layout';

const AdminEquipments: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-semibold">Gerenciar Equipamentos</h1>
        <p className="mt-4">Gerencie equipamentos disponíveis no sistema.</p>
        {/* Admin equipments content will be implemented here */}
      </div>
    </Layout>
  );
};

export default AdminEquipments;
