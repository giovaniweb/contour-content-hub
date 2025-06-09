
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { motion } from 'framer-motion';
import { formatSectionContent } from './diagnosticSectionUtils';

interface DiagnosticSectionProps {
  title: string;
  content: string;
  icon: React.ReactNode;
  color: string;
  index: number;
}

export const DiagnosticSection: React.FC<DiagnosticSectionProps> = ({
  title,
  content,
  icon,
  color,
  index
}) => {
  if (!content) return null;

  const formattedContent = formatSectionContent(content);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className={`aurora-card border-${color}/30 h-full`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-white font-semibold">
            <div className={`p-2 bg-${color}/20 rounded-lg`}>
              {icon}
            </div>
            <span className="text-base">{title}</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-3">
          {formattedContent.map((item) => {
            switch (item.type) {
              case 'break':
                return <br key={item.key} />;
              
              case 'header':
                return (
                  <h4 key={item.key} className="text-sm font-semibold text-white mt-4 mb-2">
                    {item.content}
                  </h4>
                );
              
              case 'bullet':
                return (
                  <div key={item.key} className="flex items-start gap-2 mb-2">
                    <CheckCircle2 className="h-3 w-3 text-aurora-sage mt-1 flex-shrink-0" />
                    <span className="text-white text-xs leading-relaxed">
                      {item.content}
                    </span>
                  </div>
                );
              
              case 'week':
                return (
                  <div key={item.key} className="bg-aurora-electric-purple/10 rounded-lg p-3 mb-3">
                    <h5 className="font-semibold text-white text-sm mb-1">
                      {item.content}
                    </h5>
                  </div>
                );
              
              default:
                return (
                  <p key={item.key} className="text-white text-xs mb-2 leading-relaxed">
                    {item.content}
                  </p>
                );
            }
          })}
        </CardContent>
      </Card>
    </motion.div>
  );
};
