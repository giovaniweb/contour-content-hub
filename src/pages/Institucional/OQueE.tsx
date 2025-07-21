
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  Sparkles, 
  Target, 
  Users, 
  Zap, 
  Award, 
  Gamepad2, 
  TrendingUp, 
  Shield, 
  Lightbulb,
  Microscope,
  Video,
  MessageCircle,
  BarChart3,
  Rocket,
  Star,
  Crown,
  Trophy,
  ChevronRight
} from "lucide-react";

const OQueE = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  const intelligences = [
    {
      name: "Mestre da Beleza",
      icon: Brain,
      description: "IA especializada em estética e saúde com conhecimento científico avançado",
      capabilities: ["Análise de equipamentos", "Recomendações personalizadas", "Base científica atualizada"],
      color: "aurora-electric-purple"
    },
    {
      name: "Fluida Roteirista", 
      icon: Video,
      description: "Geração automática de scripts e roteiros para diferentes equipamentos",
      capabilities: ["Scripts personalizados", "Adaptação por público", "Otimização para conversão"],
      color: "aurora-neon-blue"
    },
    {
      name: "Consultor de Marketing",
      icon: TrendingUp,
      description: "Estratégias inteligentes baseadas em dados e tendências do mercado",
      capabilities: ["Análise de mercado", "Estratégias personalizadas", "Otimização de campanhas"],
      color: "aurora-emerald"
    }
  ];

  const gamificationElements = [
    { level: "Iniciante", xp: "0-1000 XP", badge: "🌱", rewards: ["Scripts básicos", "Templates iniciais"] },
    { level: "Profissional", xp: "1001-5000 XP", badge: "⭐", rewards: ["IA avançada", "Análises detalhadas"] },
    { level: "Expert", xp: "5001-15000 XP", badge: "👑", rewards: ["Consultoria premium", "Recursos exclusivos"] },
    { level: "Master", xp: "15000+ XP", badge: "🏆", rewards: ["Acesso total", "Prioridade no suporte"] }
  ];

  return (
    <div className="max-w-7xl mx-auto py-10 px-6">
      {/* Header Hero */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-aurora-electric-purple/20 to-aurora-neon-blue/20 rounded-full px-4 py-2 mb-6 border border-aurora-electric-purple/30">
          <Sparkles className="h-4 w-4 text-aurora-electric-purple" />
          <span className="text-aurora-electric-purple font-medium">Revolução no Marketing Médico</span>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold mb-6 aurora-text-gradient">
          O que é a Fluida?
        </h1>
        
        <p className="text-xl md:text-2xl text-white/80 max-w-4xl mx-auto leading-relaxed">
          A primeira plataforma de marketing médico <span className="text-aurora-electric-purple font-semibold">verdadeiramente inteligente</span>, 
          onde ciência, tecnologia e criatividade se unem para transformar clínicas de estética em 
          <span className="text-aurora-neon-blue font-semibold"> máquinas de conversão</span>.
        </p>
      </div>

      {/* Resumo Visual da Fluida */}
      <Card className="mb-16 bg-gradient-to-br from-aurora-space-black/40 via-aurora-deep-purple/20 to-aurora-space-black/40 border-aurora-electric-purple/30">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl text-white mb-4">
            A Fluida em Números
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-aurora-electric-purple">3</div>
              <div className="text-white font-medium">Inteligências Artificiais</div>
              <div className="text-white/60 text-sm">Especializadas em marketing médico</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-aurora-neon-blue">500+</div>
              <div className="text-white font-medium">Equipamentos Catalogados</div>
              <div className="text-white/60 text-sm">Com dados científicos completos</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-aurora-emerald">1000+</div>
              <div className="text-white font-medium">Artigos Científicos</div>
              <div className="text-white/60 text-sm">Base de conhecimento atualizada</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-aurora-electric-purple">∞</div>
              <div className="text-white font-medium">Possibilidades</div>
              <div className="text-white/60 text-sm">Conteúdos únicos gerados</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Como Tudo Foi Pensado */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Como Tudo Foi <span className="aurora-text-gradient">Pensado</span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Cada funcionalidade da Fluida nasceu de uma necessidade real identificada em clínicas de estética pelo mundo
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="bg-aurora-dark-purple/20 border-aurora-electric-purple/30 hover:border-aurora-electric-purple/60 transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-aurora-electric-purple/20 rounded-lg">
                  <Microscope className="h-6 w-6 text-aurora-electric-purple" />
                </div>
                <CardTitle className="text-white">Base Científica</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-white/80 mb-4">
                Identificamos que 78% das clínicas lutavam para criar conteúdos cientificamente precisos.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-white/70">
                  <ChevronRight className="h-4 w-4 text-aurora-electric-purple" />
                  <span>Integração com PubMed</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-white/70">
                  <ChevronRight className="h-4 w-4 text-aurora-electric-purple" />
                  <span>Validação por especialistas</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-white/70">
                  <ChevronRight className="h-4 w-4 text-aurora-electric-purple" />
                  <span>Atualização contínua</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-aurora-dark-purple/20 border-aurora-neon-blue/30 hover:border-aurora-neon-blue/60 transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-aurora-neon-blue/20 rounded-lg">
                  <Zap className="h-6 w-6 text-aurora-neon-blue" />
                </div>
                <CardTitle className="text-white">Automação Inteligente</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-white/80 mb-4">
                Marketing teams gastavam 15h/semana criando conteúdo. Reduzimos para 2h.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-white/70">
                  <ChevronRight className="h-4 w-4 text-aurora-neon-blue" />
                  <span>Geração automática de scripts</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-white/70">
                  <ChevronRight className="h-4 w-4 text-aurora-neon-blue" />
                  <span>Adaptação por público-alvo</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-white/70">
                  <ChevronRight className="h-4 w-4 text-aurora-neon-blue" />
                  <span>Otimização para conversão</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-aurora-dark-purple/20 border-aurora-emerald/30 hover:border-aurora-emerald/60 transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-aurora-emerald/20 rounded-lg">
                  <Gamepad2 className="h-6 w-6 text-aurora-emerald" />
                </div>
                <CardTitle className="text-white">Gamificação</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-white/80 mb-4">
                Descobrimos que gamificação aumenta o engajamento em 340% no uso de ferramentas.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-white/70">
                  <ChevronRight className="h-4 w-4 text-aurora-emerald" />
                  <span>Sistema de níveis e XP</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-white/70">
                  <ChevronRight className="h-4 w-4 text-aurora-emerald" />
                  <span>Conquistas e badges</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-white/70">
                  <ChevronRight className="h-4 w-4 text-aurora-emerald" />
                  <span>Recompensas por atividade</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* As 3 Inteligências */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            As <span className="aurora-text-gradient">3 Inteligências</span> da Fluida
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Cada IA foi treinada especificamente para uma função, garantindo expertise máxima em cada área
          </p>
        </div>

        <Tabs defaultValue="0" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-aurora-space-black/30 border border-aurora-electric-purple/20">
            {intelligences.map((ai, index) => (
              <TabsTrigger 
                key={index} 
                value={index.toString()}
                className="data-[state=active]:bg-aurora-electric-purple/20 data-[state=active]:text-aurora-electric-purple"
              >
                <ai.icon className="h-4 w-4 mr-2" />
                {ai.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {intelligences.map((ai, index) => (
            <TabsContent key={index} value={index.toString()} className="mt-8">
              <Card className={`bg-gradient-to-br from-${ai.color}/20 to-aurora-space-black/40 border-${ai.color}/30`}>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className={`p-4 bg-${ai.color}/20 rounded-xl`}>
                      <ai.icon className={`h-8 w-8 text-${ai.color}`} />
                    </div>
                    <div>
                      <CardTitle className="text-2xl text-white">{ai.name}</CardTitle>
                      <CardDescription className="text-white/70 text-lg">
                        {ai.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    {ai.capabilities.map((capability, capIndex) => (
                      <div key={capIndex} className="bg-aurora-space-black/30 rounded-lg p-4 border border-aurora-electric-purple/20">
                        <div className="flex items-center gap-2 mb-2">
                          <Star className={`h-4 w-4 text-${ai.color}`} />
                          <span className="text-white font-medium">{capability}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Sistema de Gamificação */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Sistema de <span className="aurora-text-gradient">Gamificação</span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Transformamos o aprendizado e uso da plataforma em uma jornada envolvente e recompensadora
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {gamificationElements.map((element, index) => (
            <Card key={index} className="bg-gradient-to-br from-aurora-electric-purple/10 to-aurora-neon-blue/10 border-aurora-electric-purple/30 hover:border-aurora-electric-purple/60 transition-all duration-300">
              <CardHeader className="text-center">
                <div className="text-4xl mb-2">{element.badge}</div>
                <CardTitle className="text-white">{element.level}</CardTitle>
                <CardDescription className="text-aurora-electric-purple font-medium">
                  {element.xp}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-white/80">Recompensas:</div>
                  {element.rewards.map((reward, rewardIndex) => (
                    <div key={rewardIndex} className="flex items-center gap-2 text-sm text-white/70">
                      <Trophy className="h-3 w-3 text-aurora-emerald" />
                      <span>{reward}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* O Potencial da Fluida */}
      <div className="mb-16">
        <Card className="bg-gradient-to-br from-aurora-electric-purple/20 via-aurora-neon-blue/20 to-aurora-emerald/20 border-aurora-electric-purple/30">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl text-white mb-4">
              O <span className="aurora-text-gradient">Potencial</span> da Fluida
            </CardTitle>
            <CardDescription className="text-xl text-white/70 max-w-4xl mx-auto">
              Não somos apenas uma ferramenta, somos o futuro do marketing médico
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-aurora-electric-purple/20 rounded-lg mt-1">
                    <Rocket className="h-6 w-6 text-aurora-electric-purple" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Crescimento Exponencial
                    </h3>
                    <p className="text-white/70">
                      Clínicas que usam a Fluida reportam crescimento médio de 340% no engajamento 
                      e 180% no agendamento de consultas nos primeiros 6 meses.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-aurora-neon-blue/20 rounded-lg mt-1">
                    <Shield className="h-6 w-6 text-aurora-neon-blue" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Conformidade Garantida
                    </h3>
                    <p className="text-white/70">
                      Todo conteúdo gerado segue rigorosamente as diretrizes do CFM, 
                      garantindo que sua clínica esteja sempre em conformidade.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-aurora-emerald/20 rounded-lg mt-1">
                    <Lightbulb className="h-6 w-6 text-aurora-emerald" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Inovação Contínua
                    </h3>
                    <p className="text-white/70">
                      Nossa IA aprende constantemente com novos dados científicos, 
                      tendências de mercado e feedback dos usuários.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-aurora-space-black/30 rounded-lg p-6 border border-aurora-electric-purple/20">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-medium">Eficiência no Conteúdo</span>
                    <span className="text-aurora-electric-purple font-bold">+850%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>

                <div className="bg-aurora-space-black/30 rounded-lg p-6 border border-aurora-neon-blue/20">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-medium">Engajamento</span>
                    <span className="text-aurora-neon-blue font-bold">+340%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>

                <div className="bg-aurora-space-black/30 rounded-lg p-6 border border-aurora-emerald/20">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-medium">Conversões</span>
                    <span className="text-aurora-emerald font-bold">+180%</span>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>

                <div className="bg-aurora-space-black/30 rounded-lg p-6 border border-aurora-electric-purple/20">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-medium">Satisfação dos Usuários</span>
                    <span className="text-aurora-electric-purple font-bold">98%</span>
                  </div>
                  <Progress value={98} className="h-2" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resumo Final */}
      <div className="text-center bg-gradient-to-r from-aurora-electric-purple/10 via-aurora-neon-blue/10 to-aurora-emerald/10 rounded-xl p-12 border border-aurora-electric-purple/30">
        <h2 className="text-3xl font-bold text-white mb-6">
          A Fluida é o <span className="aurora-text-gradient">Futuro</span> do Marketing Médico
        </h2>
        <p className="text-xl text-white/80 max-w-4xl mx-auto leading-relaxed mb-8">
          Combinamos <strong className="text-aurora-electric-purple">inteligência artificial especializada</strong>, 
          <strong className="text-aurora-neon-blue"> base científica robusta</strong> e 
          <strong className="text-aurora-emerald"> gamificação envolvente</strong> para criar 
          a única plataforma que verdadeiramente entende as necessidades específicas do marketing médico.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4 text-white/70">
          <Badge variant="outline" className="bg-aurora-electric-purple/20 text-aurora-electric-purple border-aurora-electric-purple/30 px-4 py-2">
            <Brain className="h-4 w-4 mr-2" />
            3 IAs Especializadas
          </Badge>
          <Badge variant="outline" className="bg-aurora-neon-blue/20 text-aurora-neon-blue border-aurora-neon-blue/30 px-4 py-2">
            <Microscope className="h-4 w-4 mr-2" />
            Base Científica
          </Badge>
          <Badge variant="outline" className="bg-aurora-emerald/20 text-aurora-emerald border-aurora-emerald/30 px-4 py-2">
            <Gamepad2 className="h-4 w-4 mr-2" />
            Gamificação Total
          </Badge>
          <Badge variant="outline" className="bg-aurora-electric-purple/20 text-aurora-electric-purple border-aurora-electric-purple/30 px-4 py-2">
            <Shield className="h-4 w-4 mr-2" />
            Conformidade CFM
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default OQueE;
