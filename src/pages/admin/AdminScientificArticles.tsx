
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const AdminScientificArticles: React.FC = () => {
  return (
    <div className="min-h-screen text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Artigos Científicos</h1>
          <Button asChild>
            <Link to="/admin/scientific-articles/new">
              <Plus className="w-4 h-4 mr-2" />
              Novo Artigo
            </Link>
          </Button>
        </div>
        <div className="bg-slate-800 p-6 rounded-lg">
          <p className="text-slate-400">
            Lista de artigos científicos será exibida aqui
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminScientificArticles;
