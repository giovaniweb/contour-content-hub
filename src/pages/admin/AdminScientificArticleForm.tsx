
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminScientificArticleForm: React.FC = () => {
  return (
    <div className="min-h-screen text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-8">
          <Button variant="ghost" asChild className="mr-4">
            <Link to="/admin/scientific-articles">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <h1 className="text-4xl font-bold">Novo Artigo Científico</h1>
        </div>
        
        <div className="bg-slate-800 p-6 rounded-lg">
          <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center">
            <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400" />
            <h3 className="text-lg font-medium mb-2">Upload de Arquivo PDF</h3>
            <p className="text-slate-400 mb-4">
              Arraste e solte seu arquivo PDF aqui ou clique para selecionar
            </p>
            <Button>
              Selecionar Arquivo
            </Button>
          </div>
          
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">Informações Extraídas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Título
                </label>
                <input 
                  type="text" 
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                  placeholder="Título será extraído automaticamente"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Autores
                </label>
                <input 
                  type="text" 
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                  placeholder="Autores serão extraídos automaticamente"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminScientificArticleForm;
