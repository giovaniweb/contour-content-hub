
import React from 'react';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { Wand2, Target, Heart, Lightbulb, Users, Zap, Award } from 'lucide-react';

const MENTORES_DISPONIVEIS = [
  {
    id: 'leandro_ladeira',
    nome: 'Leandro Ladeira',
    especialidade: 'Gatilhos Mentais & Conversão',
    foco: 'Vendas diretas e persuasão',
    icone: Target,
    cor: 'text-red-400',
    enigma: 'Quem domina gatilhos, vende mais que imagina.',
    estilo: 'Direto, persuasivo, focado em conversão'
  },
  {
    id: 'icaro_carvalho',
    nome: 'Ícaro de Carvalho',
    especialidade: 'Storytelling & Autoridade',
    foco: 'Histórias que conectam e constroem marca',
    icone: Heart,
    cor: 'text-purple-400',
    enigma: 'Histórias que tocam, convertem sem forçar.',
    estilo: 'Narrativo, emocional, conectivo'
  },
  {
    id: 'paulo_cuenca',
    nome: 'Paulo Cuenca',
    especialidade: 'Criatividade Visual',
    foco: 'Conteúdo audiovisual impactante',
    icone: Lightbulb,
    cor: 'text-yellow-400',
    enigma: 'Criatividade visual que marca para sempre.',
    estilo: 'Visual, criativo, impactante'
  },
  {
    id: 'camila_porto',
    nome: 'Camila Porto',
    especialidade: 'Linguagem Acessível',
    foco: 'Comunicação simples e didática',
    icone: Users,
    cor: 'text-blue-400',
    enigma: 'Simplicidade que todos entendem e seguem.',
    estilo: 'Simples, didático, inclusivo'
  },
  {
    id: 'hyeser_souza',
    nome: 'Hyeser Souza',
    especialidade: 'Humor & Engajamento',
    foco: 'Conteúdo viral e engajamento',
    icone: Zap,
    cor: 'text-green-400',
    enigma: 'Humor que viraliza e vende sorrindo.',
    estilo: 'Engraçado, viral, descontraído'
  },
  {
    id: 'washington_olivetto',
    nome: 'Washington Olivetto',
    especialidade: 'Big Ideas Publicitárias',
    foco: 'Conceitos memoráveis e únicos',
    icone: Award,
    cor: 'text-orange-400',
    enigma: 'Big ideas que mudam mercados inteiros.',
    estilo: 'Conceitual, publicitário, memorável'
  },
  {
    id: 'pedro_sobral',
    nome: 'Pedro Sobral',
    especialidade: 'Clareza & Lógica',
    foco: 'Estrutura clara e antecipação',
    icone: Wand2,
    cor: 'text-cyan-400',
    enigma: 'Lógica clara que antecipa objeções.',
    estilo: 'Lógico, estruturado, antecipativo'
  }
];

interface MentorSelectorProps {
  selectedMentor: string | null;
  onMentorChange: (mentorId: string | null) => void;
}

const MentorSelector: React.FC<MentorSelectorProps> = ({
  selectedMentor,
  onMentorChange
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="aurora-accent font-semibold text-base">
          Escolha seu Mentor FLUIDA
        </Label>
        {selectedMentor && (
          <button
            onClick={() => onMentorChange(null)}
            className="text-sm aurora-body opacity-70 hover:opacity-100 transition-opacity"
          >
            Deixar sistema escolher
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {MENTORES_DISPONIVEIS.map((mentor, index) => (
          <motion.button
            key={mentor.id}
            onClick={() => onMentorChange(mentor.id)}
            className={`p-4 rounded-xl border-2 transition-all aurora-glass backdrop-blur-sm text-left ${
              selectedMentor === mentor.id
                ? 'border-purple-500/70 aurora-glow bg-purple-500/10'
                : 'border-purple-300/20 hover:border-purple-400/40'
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <mentor.icone className={`h-6 w-6 mb-2 ${
              selectedMentor === mentor.id ? mentor.cor : 'aurora-body'
            }`} />
            
            <div className={`text-sm font-semibold mb-1 ${
              selectedMentor === mentor.id ? mentor.cor : 'aurora-accent'
            }`}>
              {mentor.nome}
            </div>
            
            <div className="text-xs aurora-body opacity-80 mb-2">
              {mentor.especialidade}
            </div>
            
            <div className="text-xs aurora-body opacity-60 leading-tight">
              {mentor.foco}
            </div>

            {selectedMentor === mentor.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-3 pt-3 border-t border-purple-400/30"
              >
                <div className="text-xs aurora-electric-purple font-medium italic">
                  "{mentor.enigma}"
                </div>
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>

      {!selectedMentor && (
        <div className="text-center p-4 aurora-glass border border-purple-300/20 rounded-lg">
          <div className="text-sm aurora-accent mb-1">
            ✨ Modo Inteligente Ativado
          </div>
          <div className="text-xs aurora-body opacity-70">
            O sistema escolherá o mentor ideal baseado nas suas seleções
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorSelector;
