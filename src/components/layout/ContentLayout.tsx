
import React, { ReactNode } from 'react';
import AppLayout from '@/components/layout/AppLayout';
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
    <AppLayout>
      <div className="bg-gradient-to-br from-white to-zinc-50 min-h-[calc(100vh-4rem)]">
        {title && (
          <div className="container mx-auto px-4 pt-6 pb-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-light tracking-wide text-gray-800">{title}</h1>
                {subtitle && (
                  <p className="text-gray-600 mt-1">{subtitle}</p>
                )}
              </div>
              {actions && (
                <div className="mt-2 md:mt-0 w-full md:w-auto">
                  {actions}
                </div>
              )}
            </div>
          </div>
        )}
        {noContainer ? (
          <div className="px-4">{children}</div>
        ) : (
          <div className="container mx-auto px-4 pb-8">
            <GlassContainer className="p-4 md:p-6">
              {children}
            </GlassContainer>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default ContentLayout;
