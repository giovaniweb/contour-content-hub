
import React, { ReactNode } from 'react';
import Layout from '@/components/Layout';
import GlassContainer from '@/components/ui/GlassContainer';

interface ContentLayoutProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  actions?: ReactNode;
  fullWidth?: boolean;
  noContainer?: boolean;
}

const ContentLayout: React.FC<ContentLayoutProps> = ({
  title,
  subtitle,
  children,
  actions,
  fullWidth = false,
  noContainer = false
}) => {
  return (
    <Layout title="" fullWidth={fullWidth}>
      <div className="bg-gradient-to-br from-white to-zinc-50 min-h-[calc(100vh-4rem)]">
        {title && (
          <div className="container mx-auto px-4 pt-6 pb-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-light tracking-wide text-gray-800">{title}</h1>
                {subtitle && (
                  <p className="text-gray-600 mt-1">{subtitle}</p>
                )}
              </div>
              {actions && (
                <div className="mt-4 md:mt-0">
                  {actions}
                </div>
              )}
            </div>
          </div>
        )}

        {noContainer ? (
          children
        ) : (
          <div className="container mx-auto px-4 pb-8">
            <GlassContainer className="p-6">
              {children}
            </GlassContainer>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ContentLayout;
