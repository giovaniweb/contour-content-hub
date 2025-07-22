import React from 'react';
import AuroraPageLayout from '@/components/layout/AuroraPageLayout';
import MarketingConsultantHome from '@/components/marketing-consultant/MarketingConsultantHome';

const MarketingConsultant: React.FC = () => {
  return (
    <AuroraPageLayout containerSize="lg" padding="sm" fullHeight>
      <MarketingConsultantHome />
    </AuroraPageLayout>
  );
};

export default MarketingConsultant;