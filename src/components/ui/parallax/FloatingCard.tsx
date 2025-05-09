
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

interface FloatingCardProps {
  image: string;
  title: string;
  description: string;
  link?: string;
  delay?: number;
}

const FloatingCard: React.FC<FloatingCardProps> = ({
  image,
  title,
  description,
  link,
  delay = 0,
}) => {
  const cardVariants = {
    hidden: { 
      opacity: 0,
      y: 20
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: delay,
        ease: "easeOut"
      }
    }
  };

  const CardComponent = (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="h-full"
    >
      <Card className="overflow-hidden hover-lift h-full glass">
        <div className="aspect-video w-full overflow-hidden">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110" 
          />
        </div>
        <CardContent className="p-4">
          <h3 className="text-lg font-medium mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );

  if (link) {
    return <a href={link} className="block h-full">{CardComponent}</a>;
  }
  
  return CardComponent;
};

export default FloatingCard;
