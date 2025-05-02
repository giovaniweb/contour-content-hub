
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileText, 
  Search,
  Sparkles, 
  TrendingUp,
  Calendar,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import DashboardStats from "@/components/dashboard/DashboardStats";
import TrendingTopics from "@/components/dashboard/TrendingTopics";
import PopularContent from "@/components/dashboard/PopularContent";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const userName = user?.name || 'usuário';
  const [searchQuery, setSearchQuery] = useState("");
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast({
        title: "Pesquisando",
        description: `Buscando por "${searchQuery}"`,
      });
      // Aqui implementaríamos a lógica real de busca
    }
  };

  const quickActions = [
    {
      label: "Criar um roteiro",
      icon: <FileText className="h-5 w-5" />,
      path: "/custom-gpt",
      color: "bg-blue-100 text-blue-700"
    },
    {
      label: "Ver equipamentos",
      icon: <Search className="h-5 w-5" />,
      path: "/equipment-details",
      color: "bg-green-100 text-green-700"
    },
    {
      label: "Planejar agenda",
      icon: <Calendar className="h-5 w-5" />,
      path: "/calendar",
      color: "bg-purple-100 text-purple-700"
    }
  ];
  
  return (
    <Layout fullWidth>
      <div className="max-w-7xl mx-auto px-4 space-y-8 py-6">
        {/* Hero Section com CTA principal */}
        <section className="bg-gradient-to-r from-sky-50 to-indigo-50 rounded-2xl p-6 shadow-sm">
          <div className="max-w-3xl">
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-gray-800 animate-fade-in">
              Olá, {userName}! O que você quer fazer hoje?
            </h1>
            
            <form onSubmit={handleSearch} className="mt-6 flex gap-2">
              <Input
                type="text"
                placeholder="Pesquisar roteiros, equipamentos, conteúdos..."
                className="bg-white border-gray-200 flex-1"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button type="submit">
                <Search className="h-4 w-4 mr-2" />
                Buscar
              </Button>
            </form>
          </div>
        </section>
        
        {/* Ações Rápidas */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <Link to={action.path} key={index} className="block">
              <Card className="hover:shadow-md transition-all duration-200 h-full">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className={`${action.color} p-3 rounded-lg`}>
                    {action.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">{action.label}</h3>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </section>
        
        {/* Conteúdo em Alta */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              Tendências
            </h2>
            <Link to="/media-library">
              <Button variant="ghost" size="sm">
                Ver tudo
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <PopularContent />
          </div>
        </section>
        
        {/* Tendências de conteúdo */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-500" />
              Roteiros em Alta
            </h2>
          </div>
          
          <Card>
            <CardContent className="p-6">
              <TrendingTopics />
            </CardContent>
          </Card>
        </section>
        
        {/* Estatísticas Resumidas */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Estatísticas de Uso</CardTitle>
            </CardHeader>
            <CardContent>
              <DashboardStats />
            </CardContent>
          </Card>
        </section>
      </div>
    </Layout>
  );
};

export default Dashboard;
