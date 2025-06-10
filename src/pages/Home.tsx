
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Sparkles, FileText, Bot } from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Bem-vindo ao FluiA
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Sua plataforma de criação de roteiros inteligentes. Deixe a criatividade fluir naturalmente!
          </p>
          
          <div className="flex gap-4 justify-center">
            <Button onClick={() => navigate('/login')} size="lg">
              Entrar
            </Button>
            <Button onClick={() => navigate('/register')} variant="outline" size="lg">
              Criar Conta
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <CardTitle>Roteiros Inteligentes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Crie roteiros personalizados com a ajuda de mentores especialistas
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mb-4">
                <Bot className="h-8 w-8 text-white" />
              </div>
              <CardTitle>FluiA Akinator</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Experiência interativa que adivinha exatamente o que você precisa
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mb-4">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <CardTitle>Criatividade Fluida</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Deixe suas ideias fluírem com nossos algoritmos de criação avançados
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-purple-600 to-blue-600 text-white">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">
                Pronto para começar sua jornada criativa?
              </h3>
              <p className="mb-6 opacity-90">
                Junte-se a milhares de criadores que já descobriram o poder do FluiA
              </p>
              <Button 
                onClick={() => navigate('/register')} 
                size="lg" 
                variant="secondary"
                className="bg-white text-purple-600 hover:bg-gray-100"
              >
                Começar Agora - É Grátis!
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;
