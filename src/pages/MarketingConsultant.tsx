import React from 'react';
import AuroraPageLayout from '@/components/layout/AuroraPageLayout';
import MarketingConsultantHome from '@/components/marketing-consultant/MarketingConsultantHome';

const MarketingConsultant: React.FC = () => {
  return (
    <AuroraPageLayout>
      <div className="min-h-screen">
        <MarketingConsultantHome />
      </div>
    </AuroraPageLayout>
  );
};

export default MarketingConsultant;