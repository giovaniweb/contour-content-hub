
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CarouselSlideCardProps {
  slide: {
    number: number;
    title: string;
    texto: string;
    imagem: string;
  };
}

const getSlideIcon = (slideNumber: number): string => {
  const icons = {
    1: "🎯", // Hook/Gancho
    2: "⚡", // Problema
    3: "💡", // Solução
    4: "✨", // Benefícios
    5: "📲"  // CTA
  };
  return icons[slideNumber as keyof typeof icons] || "📝";
};

const getSlideTheme = (slideNumber: number) => {
  const themes = {
    1: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-800", badge: "bg-amber-100" },
    2: { bg: "bg-red-50", border: "border-red-200", text: "text-red-800", badge: "bg-red-100" },
    3: { bg: "bg-green-50", border: "border-green-200", text: "text-green-800", badge: "bg-green-100" },
    4: { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-800", badge: "bg-purple-100" },
    5: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-800", badge: "bg-blue-100" }
  };
  return themes[slideNumber as keyof typeof themes] || themes[1];
};

const CarouselSlideCard: React.FC<CarouselSlideCardProps> = ({ slide }) => {
  const icon = getSlideIcon(slide.number);
  const theme = getSlideTheme(slide.number);

  return (
    <Card className={`${theme.bg} ${theme.border} border-2 hover:shadow-md transition-shadow`}>
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="text-2xl">{icon}</div>
          <div className="flex-1">
            <Badge variant="outline" className={`${theme.badge} ${theme.text} border-current mb-2`}>
              Slide {slide.number}
            </Badge>
            <h3 className={`font-semibold ${theme.text} text-lg`}>{slide.title}</h3>
          </div>
        </div>

        <div className="space-y-4">
          {/* Seção Texto */}
          <div className="bg-white/70 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">Texto do Slide</span>
            </div>
            <p className="text-gray-800 leading-relaxed text-sm">
              {slide.texto}
            </p>
          </div>

          {/* Seção Imagem */}
          <div className="bg-white/70 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">Descrição da Imagem</span>
            </div>
            <p className="text-gray-600 leading-relaxed text-sm italic">
              {slide.imagem}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CarouselSlideCard;
