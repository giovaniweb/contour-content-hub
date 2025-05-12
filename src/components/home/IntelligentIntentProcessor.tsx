
import React, { useState } from 'react';
import { FluidaInput } from '@/components/ui/fluida-input';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/routes';
import { Send } from 'lucide-react';
import { motion } from 'framer-motion';

const IntelligentIntentProcessor: React.FC = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(ROUTES.DASHBOARD, { state: { query } });
    }
  };

  const placeholders = [
    "Crie roteiro para vídeo sobre rejuvenescimento facial",
    "Estratégias para Instagram sobre estética avançada",
    "Conteúdo para profissionais da medicina estética",
    "Ideias para promover tratamento de criolipólise",
    "Como criar conteúdo para atrair clientes de procedimentos estéticos",
  ];

  return (
    <div className="w-full max-w-3xl mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <form onSubmit={handleSubmit}>
          <FluidaInput
            value={query}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
            className="py-6 px-6 text-lg shadow-xl"
            animatedPlaceholder={placeholders}
            iconRight={
              <button
                type="submit"
                className="bg-fluida-pink hover:bg-fluida-pink/80 text-white p-2 rounded-full transition-colors"
              >
                <Send className="h-5 w-5" />
              </button>
            }
          />
        </form>
        <div className="absolute -bottom-12 left-0 right-0 text-center text-sm text-muted-foreground">
          Digite sua intenção, necessidade ou questão e nosso sistema inteligente irá direcionar você
        </div>
      </motion.div>
    </div>
  );
};

export default IntelligentIntentProcessor;
