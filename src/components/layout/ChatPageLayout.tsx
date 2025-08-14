import React from 'react';

interface ChatPageLayoutProps {
  children: React.ReactNode;
  title?: string;
  showHeader?: boolean;
}

const ChatPageLayout: React.FC<ChatPageLayoutProps> = ({ 
  children, 
  title = "ChatFDA",
  showHeader = true 
}) => {
  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {showHeader && (
        <div className="flex-shrink-0 border-b border-border/10 bg-card/50 backdrop-blur-sm">
          <div className="px-4 py-3">
            <div className="text-center">
              <h1 className="text-lg font-semibold text-foreground">
                {title}
              </h1>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export default ChatPageLayout;