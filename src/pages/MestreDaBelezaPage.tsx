
import React from 'react';
import ChatPageLayout from '@/components/layout/ChatPageLayout';
import AkinatorInteligente from '@/components/mestre-da-beleza/AkinatorInteligente';

const MestreDaBelezaPage: React.FC = () => {
  return (
    <ChatPageLayout title="Mestre da Beleza 2.0" showHeader={false}>
      <AkinatorInteligente />
    </ChatPageLayout>
  );
};

export default MestreDaBelezaPage;
