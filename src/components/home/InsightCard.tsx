
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface InsightCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const InsightCard: React.FC<InsightCardProps> = ({ title, description, children }) => {
  return (
    <Card className="border border-border/50">
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};

export default InsightCard;
