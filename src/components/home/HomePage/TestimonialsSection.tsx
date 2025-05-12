
import React from "react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

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
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full overflow-hidden mb-4 border-2 border-gray-100">
            <img 
              src={testimonial.avatar} 
              alt={testimonial.name}
              className="w-full h-full object-cover"
            />
          </div>
          <p className="italic text-gray-600 mb-4 text-sm">"{testimonial.quote}"</p>
          <h4 className="font-medium text-gray-800">{testimonial.name}</h4>
          <p className="text-xs text-gray-500">{testimonial.role}</p>
        </div>
      </Card>
    </motion.div>
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
    <section className="bg-gray-50 py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-light text-center mb-16 tracking-wide text-gray-800">
          O que nossos usuários dizem
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
