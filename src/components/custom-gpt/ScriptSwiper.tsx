
import React, { useState, useRef } from 'react';
import { motion, PanInfo, useAnimation } from 'framer-motion';
import { Card } from "@/components/ui/card";
import { CustomGptResult } from './types';
import { CheckCircle, XCircle, Heart } from "lucide-react";
import ScriptResultCard from './ScriptResultCard';
import { useToast } from "@/hooks/use-toast";

interface ScriptSwiperProps {
  results: CustomGptResult[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onFinish: () => void;
}

const ScriptSwiper: React.FC<ScriptSwiperProps> = ({ 
  results, 
  onApprove, 
  onReject, 
  onFinish 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<string | null>(null);
  const controls = useAnimation();
  const constraintsRef = useRef(null);
  const { toast } = useToast();

  const currentItem = results[currentIndex];
  
  // Handle end of results
  if (!currentItem) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center space-y-4">
        <div className="bg-primary/10 p-6 rounded-full">
          <Heart className="h-16 w-16 text-primary" />
        </div>
        <h3 className="text-2xl font-bold">Você avaliou todos os roteiros!</h3>
        <p className="text-muted-foreground">
          Os roteiros aprovados estão disponíveis na sua biblioteca.
        </p>
      </div>
    );
  }

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100; // minimum distance required for a swipe
    
    if (info.offset.x > threshold) {
      // Swiped right - approve
      handleApprove();
    } else if (info.offset.x < -threshold) {
      // Swiped left - reject
      handleReject();
    } else {
      // Return to center if not swiped far enough
      controls.start({ x: 0, rotate: 0 });
    }
  };

  const handleApprove = () => {
    setDirection('right');
    controls.start({ 
      x: 500, 
      rotate: 30,
      opacity: 0,
      transition: { duration: 0.5 }
    }).then(() => {
      onApprove(currentItem.id);
      setDirection(null);
      setCurrentIndex(prev => prev + 1);
      controls.set({ x: 0, rotate: 0, opacity: 1 });
      
      toast({
        title: "Roteiro aprovado! 🎉",
        description: "O roteiro foi salvo na sua biblioteca de conteúdo."
      });
    });
  };

  const handleReject = () => {
    setDirection('left');
    controls.start({ 
      x: -500, 
      rotate: -30,
      opacity: 0,
      transition: { duration: 0.5 }
    }).then(() => {
      onReject(currentItem.id);
      setDirection(null);
      setCurrentIndex(prev => prev + 1);
      controls.set({ x: 0, rotate: 0, opacity: 1 });
      
      toast({
        description: "Roteiro descartado. Vamos para o próximo!"
      });
    });
  };

  return (
    <div className="relative h-[600px] overflow-hidden" ref={constraintsRef}>
      {/* Current card */}
      <motion.div
        className="absolute inset-0 flex justify-center items-center"
        drag="x"
        dragConstraints={constraintsRef}
        onDragEnd={handleDragEnd}
        animate={controls}
        style={{ touchAction: "none" }}
      >
        <div className="relative w-full max-w-2xl">
          <ScriptResultCard result={currentItem} />
          
          {/* Approval overlay */}
          {direction === 'right' && (
            <div className="absolute inset-0 flex items-center justify-center bg-green-500/20 rounded-lg border-4 border-green-500">
              <CheckCircle className="h-24 w-24 text-green-500" />
            </div>
          )}
          
          {/* Rejection overlay */}
          {direction === 'left' && (
            <div className="absolute inset-0 flex items-center justify-center bg-red-500/20 rounded-lg border-4 border-red-500">
              <XCircle className="h-24 w-24 text-red-500" />
            </div>
          )}
        </div>
      </motion.div>
      
      {/* Action buttons */}
      <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-10 z-10">
        <button 
          onClick={handleReject}
          className="p-4 bg-red-100 rounded-full text-red-500 shadow-lg hover:bg-red-200 transition-colors"
        >
          <XCircle className="h-10 w-10" />
        </button>
        
        <button 
          onClick={handleApprove}
          className="p-4 bg-green-100 rounded-full text-green-500 shadow-lg hover:bg-green-200 transition-colors"
        >
          <CheckCircle className="h-10 w-10" />
        </button>
      </div>
      
      {/* Progress indicator */}
      <div className="absolute top-2 left-0 right-0 flex justify-center">
        <div className="bg-muted p-1 rounded-full flex gap-1">
          {results.map((_, index) => (
            <div 
              key={index} 
              className={`h-2 w-6 rounded-full ${
                index < currentIndex 
                  ? 'bg-primary' 
                  : index === currentIndex 
                    ? 'bg-primary/60' 
                    : 'bg-muted-foreground/20'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScriptSwiper;
