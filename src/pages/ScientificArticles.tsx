
import React, { useState } from 'react';
import { BookOpen, Search, Filter, Upload, Plus, Flame, Sparkles } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const ScientificArticles: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Aurora Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 animate-pulse"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto py-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="relative">
              <BookOpen className="h-12 w-12 text-cyan-400 drop-shadow-lg" />
              <div className="absolute inset-0 h-12 w-12 text-cyan-400 animate-pulse blur-sm"></div>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">
                Artigos Científicos
              </h1>
              <p className="text-slate-300">Biblioteca de artigos e pesquisas científicas</p>
            </div>
          </div>

          {/* Status Tags */}
          <div className="flex items-center justify-center gap-4">
            <Badge variant="secondary" className="bg-orange-500/20 text-orange-400 border-orange-500/30 rounded-xl">
              <Flame className="h-4 w-4 mr-1" />
              Popular
            </Badge>
            <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30 rounded-xl">
              <Sparkles className="h-4 w-4 mr-1" />
              Recente
            </Badge>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cyan-400" />
              <Input 
                placeholder="Pesquisar artigos..." 
                className="pl-10 bg-slate-800/50 border-cyan-500/30 text-slate-100 placeholder:text-slate-400 rounded-xl backdrop-blur-sm" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon" className="bg-slate-800/50 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 rounded-xl">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" className="flex items-center gap-2 bg-slate-800/50 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 rounded-xl">
              <Upload className="h-4 w-4" />
              Enviar Artigo
            </Button>
            <Button className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:from-cyan-600 hover:to-purple-600 rounded-xl">
              <Plus className="h-4 w-4" />
              Novo Artigo
            </Button>
          </div>
        </div>

        {/* Empty State with Aurora styling */}
        <div className="rounded-2xl bg-slate-800/30 backdrop-blur-sm border border-cyan-500/20 p-6">
          <EmptyState
            icon={BookOpen}
            title="Nenhum artigo encontrado"
            description="Comece adicionando seus primeiros artigos científicos"
            actionLabel="Adicionar Primeiro Artigo"
            actionIcon={Upload}
            onAction={() => console.log('Add article')}
          />
        </div>
      </div>
    </div>
  );
};

export default ScientificArticles;
