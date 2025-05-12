
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare } from 'lucide-react';

const ConsultantBanner: React.FC = () => {
  const { toast } = useToast();
  
  const handleConsultantRequest = () => {
    toast({
      title: "Solicitação recebida",
      description: "Um consultor de marketing entrará em contato em breve.",
    });
    
    // In a real app, this would trigger a backend process
    setTimeout(() => {
      window.location.href = '/marketing-consultant';
    }, 1500);
  };
  
  return (
    <section className="bg-gradient-to-r from-fluida-blue to-fluida-pink py-16 sm:py-20 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-40 h-40 rounded-full bg-white" style={{ left: '10%', top: '20%' }} />
        <div className="absolute bottom-0 right-0 w-60 h-60 rounded-full bg-white" style={{ right: '5%', bottom: '-20%' }} />
        <div className="absolute top-0 right-0 w-20 h-20 rounded-full bg-white" style={{ right: '20%', top: '10%' }} />
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          className="max-w-2xl mx-auto text-center text-white"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2 
            className="text-3xl sm:text-4xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Quer ajuda para planejar tudo isso?
          </motion.h2>
          
          <motion.p 
            className="text-lg mb-8 text-white/90"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Nosso consultor de marketing inteligente pode te ajudar a criar uma estratégia completa para sua clínica, baseada em dados e tendências do mercado.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <Button 
              onClick={handleConsultantRequest}
              className="bg-white text-fluida-blue hover:bg-white/90 text-lg px-8 py-6 h-auto rounded-full shadow-xl flex items-center gap-2"
            >
              <MessageSquare className="w-5 h-5" />
              Chamar Consultor de Marketing IA
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ConsultantBanner;
