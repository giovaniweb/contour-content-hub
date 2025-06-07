
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Dr. Maria Silva',
      role: 'Dermatologista',
      content: 'O Fluida revolucionou minha estratégia de conteúdo. Agora posso criar roteiros profissionais em minutos!',
      image: '/placeholder-avatar.jpg'
    },
    {
      id: 2,
      name: 'Dr. João Santos',
      role: 'Cirurgião Plástico',
      content: 'A qualidade dos conteúdos gerados é impressionante. Meus pacientes adoram os vídeos educativos.',
      image: '/placeholder-avatar.jpg'
    }
  ];

  return (
    <section className="py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">O que nossos clientes dizem</h2>
        <p className="text-muted-foreground">Profissionais que transformaram sua comunicação com o Fluida</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.id} className="p-6">
            <CardContent className="space-y-4">
              <p className="text-lg italic">"{testimonial.content}"</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="font-semibold">{testimonial.name[0]}</span>
                </div>
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;
