
import React from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/context/AuthContext';
import { ensureUserProfile } from '@/services/auth/userProfile';
import QuickAccessGrid from '@/components/home/QuickAccessGrid';
import FeaturedVideos from '@/components/home/FeaturedVideos';
import FeaturedCarousel from '@/components/home/FeaturedCarousel';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Dashboard = () => {
  const { user } = useAuth();
  const userProfile = user ? ensureUserProfile(user) : null;
  const userName = userProfile ? userProfile.name : 'Usuário';
  
  return (
    <Layout title="Dashboard">
      <div className="container mx-auto py-6 space-y-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-2/3">
            <h1 className="text-3xl font-bold mb-6">
              Bem-vindo, {userName}!
            </h1>
            
            <Card className="mb-8">
              <CardHeader className="pb-3">
                <CardTitle>Destaques</CardTitle>
                <CardDescription>Conteúdo em tendência e recomendações</CardDescription>
              </CardHeader>
              <CardContent>
                <FeaturedCarousel />
              </CardContent>
            </Card>
          </div>
          
          <div className="w-full md:w-1/3">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Recentes</CardTitle>
                <CardDescription>Seus itens recentes</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li className="flex items-center justify-between border-b pb-2">
                    <span>Roteiro - Benefícios do laser</span>
                    <span className="text-xs text-muted-foreground">Hoje</span>
                  </li>
                  <li className="flex items-center justify-between border-b pb-2">
                    <span>Vídeo - Demonstração equipamento</span>
                    <span className="text-xs text-muted-foreground">Ontem</span>
                  </li>
                  <li className="flex items-center justify-between border-b pb-2">
                    <span>Brainstorm de ideias</span>
                    <span className="text-xs text-muted-foreground">3 dias atrás</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <QuickAccessGrid />
        
        <FeaturedVideos className="mb-8" />
      </div>
    </Layout>
  );
};

export default Dashboard;
