
import React from 'react';
import { Navigate } from 'react-router-dom';
import ChatPageLayout from '@/components/layout/ChatPageLayout';
import AkinatorInteligente from '@/components/mestre-da-beleza/AkinatorInteligente';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';

const MestreDaBelezaPage: React.FC = () => {
  const { hasAccess } = useFeatureAccess();

  if (!hasAccess('mestre_beleza')) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <ChatPageLayout title="Mestre da Beleza 2.0" showHeader={false}>
      <AkinatorInteligente />
    </ChatPageLayout>
  );
};

export default MestreDaBelezaPage;
