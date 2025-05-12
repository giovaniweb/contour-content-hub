
import React from "react";
import { Card } from "@/components/ui/card";

interface Testimonial {
  name: string;
  role: string;
  quote: string;
  avatar: string;
}

interface TestimonialCardProps {
  testimonial: Testimonial;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  return (
    <Card className="bg-gradient-to-r from-white to-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <p className="italic text-gray-700 mb-4">"{testimonial.quote}"</p>
      <div className="flex items-center">
        <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
          <img 
            src={testimonial.avatar} 
            alt={testimonial.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h4 className="font-medium">{testimonial.name}</h4>
          <p className="text-sm text-gray-600">{testimonial.role}</p>
        </div>
      </div>
    </Card>
  );
};

const TestimonialsSection: React.FC = () => {
  const testimonials: Testimonial[] = [
    {
      name: "Carolina Silva",
      role: "Influenciadora Digital",
      quote: "A plataforma revolucionou minha produção de conteúdo. Agora consigo criar roteiros completos em minutos!",
      avatar: "/lovable-uploads/e96c0d46-8a86-4d83-bea8-bc63b46b1fea.png"
    },
    {
      name: "Marcelo Santos",
      role: "Produtor de Vídeo",
      quote: "A biblioteca de vídeos e o sistema de gerenciamento de conteúdo simplificaram todo meu fluxo de trabalho.",
      avatar: "/lovable-uploads/f10b82b4-cb1b-4038-be9c-b1ba32da698b.png"
    },
    {
      name: "Juliana Costa",
      role: "Social Media Manager",
      quote: "As sugestões inteligentes de conteúdo realmente entendem o que funciona para diferentes tipos de público.",
      avatar: "/lovable-uploads/e96c0d46-8a86-4d83-bea8-bc63b46b1fea.png"
    },
  ];

  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">O que nossos usuários dizem</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
