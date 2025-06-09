
import React from 'react';
import { Video, Image, PlayCircle, Users, Sparkles } from "lucide-react";

export const getFormatIcon = (format: string) => {
  switch (format) {
    case 'vídeo':
      return <Video className="h-4 w-4" />;
    case 'reels':
      return <PlayCircle className="h-4 w-4" />;
    case 'carrossel':
      return <Image className="h-4 w-4" />;
    case 'story':
      return <Users className="h-4 w-4" />;
    default:
      return <Sparkles className="h-4 w-4" />;
  }
};

export const getFormatColor = (format: string) => {
  switch (format) {
    case 'vídeo':
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'reels':
      return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    case 'carrossel':
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'story':
      return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    default:
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
};

export const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Fácil':
      return 'bg-green-500/20 text-green-400';
    case 'Médio':
      return 'bg-yellow-500/20 text-yellow-400';
    case 'Avançado':
      return 'bg-red-500/20 text-red-400';
    default:
      return 'bg-gray-500/20 text-gray-400';
  }
};
