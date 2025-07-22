import React, { useState } from 'react';
import { FileText, Upload, Search, Filter, Download, Eye, Calendar, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AuroraPageLayout from '@/components/layout/AuroraPageLayout';
import StandardPageHeader from '@/components/layout/StandardPageHeader';
import { EmptyState } from '@/components/ui/empty-state';

const MyDocuments = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const statusBadges = [
    {
      icon: FileText,
      label: 'Documentos Pro',
      variant: 'secondary' as const,
      color: 'bg-aurora-electric-purple/20 text-aurora-electric-purple border-aurora-electric-purple/30'
    },
    {
      icon: File,
      label: 'Base Técnica',
      variant: 'secondary' as const,
      color: 'bg-aurora-cyan/20 text-aurora-cyan border-aurora-cyan/30'
    }
  ];

  const { data: documents = [], isLoading } = useQuery({
    queryKey: ['user_documents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('documentos_tecnicos')
        .select('*')
        .eq('status', 'ativo')
        .order('data_criacao', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  const filteredDocuments = documents.filter(doc =>
    doc.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.tipo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getFileIcon = (tipo: string) => {
    switch (tipo?.toLowerCase()) {
      case 'pdf':
        return <FileText className="h-5 w-5 text-red-400" />;
      case 'manual':
        return <File className="h-5 w-5 text-blue-400" />;
      case 'protocolo':
        return <FileText className="h-5 w-5 text-green-400" />;
      default:
        return <FileText className="h-5 w-5 text-slate-400" />;
    }
  };

  return (
    <AuroraPageLayout>
      <StandardPageHeader
        icon={FileText}
        title="Meus Documentos"
        subtitle="Acesse documentos técnicos e protocolos especializados"
        statusBadges={statusBadges}
      />

      {/* Controls */}
      <div className="aurora-card p-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Buscar documentos..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
            <Button className="aurora-button">
              <Upload className="h-4 w-4 mr-2" />
              Upload Documento
            </Button>
          </div>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="aurora-card">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-aurora-electric-purple mx-auto"></div>
            <p className="text-slate-400 mt-4">Carregando documentos...</p>
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={FileText}
              title={searchTerm ? 'Nenhum documento encontrado' : 'Nenhum documento disponível'}
              description={searchTerm ? 'Tente buscar por outros termos' : 'Comece fazendo upload dos seus primeiros documentos'}
              actionLabel="Fazer Upload"
              onAction={() => console.log('Upload document')}
            />
          </div>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDocuments.map((document) => (
                <div key={document.id} className="group aurora-glass p-4 rounded-lg backdrop-blur-md bg-slate-800/30 border border-white/10">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="mt-1">
                      {getFileIcon(document.tipo)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-slate-200 group-hover:text-aurora-electric-purple transition-colors duration-200 line-clamp-2">
                        {document.titulo}
                      </h3>
                      {document.descricao && (
                        <p className="text-sm text-slate-400 mt-1 line-clamp-2">
                          {document.descricao}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {document.tipo && (
                      <span className="inline-block px-2 py-1 text-xs bg-aurora-neon-blue/20 text-aurora-neon-blue rounded-full">
                        {document.tipo}
                      </span>
                    )}
                    
                    {document.keywords && document.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {document.keywords.slice(0, 3).map((keyword, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs bg-aurora-electric-purple/20 text-aurora-electric-purple rounded-full"
                          >
                            {keyword}
                          </span>
                        ))}
                        {document.keywords.length > 3 && (
                          <span className="px-2 py-1 text-xs bg-slate-700/50 text-slate-400 rounded-full">
                            +{document.keywords.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <Button size="sm" className="aurora-button">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(document.data_criacao).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AuroraPageLayout>
  );
};

export default MyDocuments;