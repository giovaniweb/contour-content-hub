
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

interface QuickAccessCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  iconColor: string;
  linkTo: string;
  linkText: string;
}

const QuickAccessCard: React.FC<QuickAccessCardProps> = ({
  title,
  description,
  icon: Icon,
  iconColor,
  linkTo,
  linkText
}) => {
  return (
    <Card className="border border-border/50 hover:shadow-md transition-shadow duration-300 hover:border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Icon className={`mr-2 h-5 w-5 ${iconColor}`} />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild className="w-full" variant="outline">
          <Link to={linkTo}>{linkText}</Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuickAccessCard;
