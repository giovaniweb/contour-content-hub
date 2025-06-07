
import React from 'react';
import AuroraLayout from '@/components/layout/AuroraLayout';
import AuroraCard from '@/components/ui/AuroraCard';
import AuroraButton from '@/components/ui/AuroraButton';
import { FileText, Plus, Eye, Edit, Trash2, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const ContentScripts: React.FC = () => {
  // Mock data para demonstração
  const scripts = [
    {
      id: 1,
      title: "Script para Lançamento de Produto",
      type: "Vídeo Promocional",
      status: "Concluído",
      createdAt: "2024-06-01",
      content: "Gancho poderoso sobre transformação..."
    },
    {
      id: 2,
      title: "Roteiro Educativo - Dicas de Marketing",
      type: "Conteúdo Educativo",
      status: "Em Revisão",
      createdAt: "2024-06-05",
      content: "Você sabia que 90% das pessoas..."
    },
    {
      id: 3,
      title: "Script Emocional - História de Sucesso",
      type: "Storytelling",
      status: "Rascunho",
      createdAt: "2024-06-07",
      content: "Era uma vez uma pessoa que..."
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Concluído':
        return 'text-aurora-emerald';
      case 'Em Revisão':
        return 'text-aurora-neon-blue';
      case 'Rascunho':
        return 'text-aurora-soft-pink';
      default:
        return 'text-white/70';
    }
  };

  return (
    <AuroraLayout 
      title="Roteiros & Scripts" 
      subtitle="Gerencie seus roteiros criativos e scripts de vídeo"
    >
      <div className="p-6 space-y-8">
        {/* Header Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div>
            <h2 className="aurora-heading text-2xl font-light text-white mb-2">
              Seus Roteiros
            </h2>
            <p className="aurora-body text-white/70">
              {scripts.length} roteiros criados
            </p>
          </div>
          <AuroraButton>
            <Plus className="w-5 h-5 mr-2" />
            Novo Roteiro
          </AuroraButton>
        </motion.div>

        {/* Scripts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scripts.map((script, index) => (
            <motion.div
              key={script.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <AuroraCard floating className="h-full">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-aurora-electric-purple to-aurora-neon-blue rounded-lg flex items-center justify-center mr-3">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="aurora-heading text-white font-medium text-sm">
                          {script.title}
                        </h3>
                        <p className="aurora-body text-white/60 text-xs">
                          {script.type}
                        </p>
                      </div>
                    </div>
                    <span className={`text-xs font-medium ${getStatusColor(script.status)}`}>
                      {script.status}
                    </span>
                  </div>

                  {/* Content Preview */}
                  <div className="mb-4">
                    <p className="aurora-body text-white/80 text-sm line-clamp-3">
                      {script.content}
                    </p>
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-xs text-white/50 mb-4">
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(script.createdAt).toLocaleDateString('pt-BR')}
                    </div>
                    <div>
                      #{script.id.toString().padStart(3, '0')}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                        <Eye className="w-4 h-4 text-white/70" />
                      </button>
                      <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                        <Edit className="w-4 h-4 text-white/70" />
                      </button>
                    </div>
                    <button className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-colors">
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              </AuroraCard>
            </motion.div>
          ))}
        </div>

        {/* Empty State - se não houver scripts */}
        {scripts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center py-12"
          >
            <AuroraCard className="max-w-md mx-auto p-8">
              <div className="w-16 h-16 bg-gradient-to-r from-aurora-electric-purple to-aurora-neon-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h3 className="aurora-heading text-xl font-medium text-white mb-2">
                Nenhum roteiro ainda
              </h3>
              <p className="aurora-body text-white/70 mb-6">
                Comece criando seu primeiro roteiro com nossa IA inteligente
              </p>
              <AuroraButton>
                <Plus className="w-5 h-5 mr-2" />
                Criar Primeiro Roteiro
              </AuroraButton>
            </AuroraCard>
          </motion.div>
        )}
      </div>
    </AuroraLayout>
  );
};

export default ContentScripts;
