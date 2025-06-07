
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Send, Sparkles, Target, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  type?: 'question' | 'analysis' | 'final';
}

interface BriefingData {
  faturamento_atual?: string;
  meta_faturamento?: string;
  procedimento_principal?: string;
  procedimento_margem?: string;
  atendimentos_semana?: string;
  tempo_ocioso?: string;
  trabalha_equipe?: string;
  frequencia_videos?: string;
  mostra_rosto?: string;
  usa_trafego_pago?: string;
  publico_ideal?: string;
  posicionamento_clinica?: string;
}

const BRIEFING_QUESTIONS = [
  {
    category: '🔢 Receita e Meta',
    questions: [
      'Qual é o seu faturamento médio mensal hoje?',
      'Qual seria sua meta ideal de faturamento nos próximos 3 meses?',
      'Qual protocolo ou procedimento você mais quer vender?',
      'Qual desses tem a maior margem de lucro?'
    ],
    keys: ['faturamento_atual', 'meta_faturamento', 'procedimento_principal', 'procedimento_margem']
  },
  {
    category: '🛠️ Capacidade e Operação',
    questions: [
      'Quantos atendimentos você faz por semana, em média?',
      'Quanto tempo da sua agenda está ocioso?',
      'Você trabalha com equipe ou faz tudo sozinha?'
    ],
    keys: ['atendimentos_semana', 'tempo_ocioso', 'trabalha_equipe']
  },
  {
    category: '📢 Conteúdo e Visibilidade',
    questions: [
      'Com que frequência você grava vídeos ou aparece nos stories?',
      'Você mostra seu rosto nos conteúdos?',
      'Já usa tráfego pago ou só orgânico?'
    ],
    keys: ['frequencia_videos', 'mostra_rosto', 'usa_trafego_pago']
  },
  {
    category: '🎯 Público e Posicionamento',
    questions: [
      'Quem é o seu público ideal? (idade, renda, desejo)',
      'Como você define sua clínica? (premium, acessível, humanizada...)'
    ],
    keys: ['publico_ideal', 'posicionamento_clinica']
  }
];

const FluidaConsultant: React.FC = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Olá! Sou o **Consultor Fluida** — seu estrategista especialista em marketing para clínicas de estética. Vou fazer um briefing completo da sua clínica e entregar um plano de ação direto e inteligente. Vamos começar?',
      type: 'question'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [briefingData, setBriefingData] = useState<BriefingData>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [briefingStarted, setBriefingStarted] = useState(false);
  const [briefingCompleted, setBriefingCompleted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startBriefing = () => {
    setBriefingStarted(true);
    setCurrentQuestionIndex(0);
    
    const firstCategory = BRIEFING_QUESTIONS[0];
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: `Perfeito! Vamos começar o briefing estratégico.\n\n**${firstCategory.category}**\n\n${firstCategory.questions[0]}`,
      type: 'question'
    }]);
  };

  const handleNextQuestion = (userAnswer: string) => {
    // Salvar resposta atual
    const currentCategory = BRIEFING_QUESTIONS[currentCategoryIndex];
    const questionKey = currentCategory.keys[currentQuestionIndex];
    setBriefingData(prev => ({
      ...prev,
      [questionKey]: userAnswer
    }));

    // Verificar se há mais perguntas na categoria atual
    if (currentQuestionIndex + 1 < currentCategory.questions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
      const nextQuestion = currentCategory.questions[currentQuestionIndex + 1];
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: nextQuestion,
        type: 'question'
      }]);
    } 
    // Verificar se há mais categorias
    else if (currentCategoryIndex + 1 < BRIEFING_QUESTIONS.length) {
      setCurrentCategoryIndex(prev => prev + 1);
      setCurrentQuestionIndex(0);
      
      const nextCategory = BRIEFING_QUESTIONS[currentCategoryIndex + 1];
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `**${nextCategory.category}**\n\n${nextCategory.questions[0]}`,
        type: 'question'
      }]);
    }
    // Briefing completo
    else {
      setBriefingCompleted(true);
      generateAnalysis();
    }
  };

  const detectProfile = (data: BriefingData) => {
    let profile = 'didatico'; // padrão
    
    // Análise de perfil baseada nas respostas
    const usaTrafego = data.usa_trafego_pago?.toLowerCase().includes('sim') || data.usa_trafego_pago?.toLowerCase().includes('pago');
    const mostraRosto = data.mostra_rosto?.toLowerCase().includes('sim');
    const posicionamentoPremium = data.posicionamento_clinica?.toLowerCase().includes('premium');
    const frequenciaAlta = data.frequencia_videos?.toLowerCase().includes('todo') || data.frequencia_videos?.toLowerCase().includes('diário');
    
    if (usaTrafego && data.procedimento_margem) {
      profile = 'direto'; // Vendas, tráfego, escassez
    } else if (mostraRosto && !usaTrafego) {
      profile = 'emocional'; // Posicionamento humano
    } else if (frequenciaAlta && mostraRosto) {
      profile = 'popular'; // Viral e gancho forte
    } else if (posicionamentoPremium) {
      profile = 'criativo'; // Imagem premium
    } else if (data.trabalha_equipe?.toLowerCase().includes('equipe')) {
      profile = 'analitico'; // Autoridade técnica
    }
    
    return profile;
  };

  const generateAnalysis = () => {
    setLoading(true);
    
    setTimeout(() => {
      const profile = detectProfile(briefingData);
      const analysis = generateStrategicAnalysis(briefingData, profile);
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: analysis,
        type: 'final'
      }]);
      
      setLoading(false);
      
      toast({
        title: "✨ Análise completa!",
        description: "Seu plano estratégico foi gerado com base no briefing.",
      });
    }, 2000);
  };

  const generateStrategicAnalysis = (data: BriefingData, profile: string) => {
    // Diagnóstico
    let diagnostico = '';
    const faturamentoAtual = parseInt(data.faturamento_atual?.replace(/\D/g, '') || '0');
    const metaFaturamento = parseInt(data.meta_faturamento?.replace(/\D/g, '') || '0');
    const crescimento = metaFaturamento > faturamentoAtual ? ((metaFaturamento - faturamentoAtual) / faturamentoAtual * 100).toFixed(0) : '0';
    
    if (data.tempo_ocioso?.toLowerCase().includes('muito') || data.tempo_ocioso?.toLowerCase().includes('50%')) {
      diagnostico = `Sua clínica tem capacidade operacional ociosa e potencial de crescimento de ${crescimento}%. O principal gargalo está na geração de demanda qualificada. Você tem estrutura para crescer, mas precisa de uma estratégia de atração mais assertiva para ${data.procedimento_principal || 'seus procedimentos principais'}.`;
    } else if (!data.mostra_rosto?.toLowerCase().includes('sim')) {
      diagnostico = `Sua clínica tem operação sólida, mas está perdendo conexão emocional com o público. Em estética, mostrar o rosto e criar proximidade é fundamental para conversão. Você tem expertise, mas precisa humanizar a comunicação para gerar mais confiança e fechar vendas.`;
    } else {
      diagnostico = `Sua clínica tem base sólida e você já entende a importância da presença digital. O foco agora deve ser otimizar a conversão e sistematizar processos para alcançar a meta de crescimento de ${crescimento}% de forma consistente.`;
    }

    // Ações táticas baseadas no perfil
    let acoesTaticas = [];
    
    switch (profile) {
      case 'direto':
        acoesTaticas = [
          `🎯 Criar campanha de tráfego pago focada em ${data.procedimento_principal} com landing page de conversão`,
          `⏰ Implementar gatilho de escassez: "Apenas 3 vagas para ${data.procedimento_principal} este mês"`,
          `📞 Criar sequência de follow-up via WhatsApp para leads que não converteram`,
          `💰 Desenvolver oferta irresistível: pacote ${data.procedimento_principal} + bônus exclusivo`,
          `📊 Instalar pixel e configurar remarketing para maximizar conversões`
        ];
        break;
      
      case 'emocional':
        acoesTaticas = [
          `🎬 Gravar 1 vídeo por semana mostrando transformação real de paciente`,
          `📖 Criar stories diários contando sua história e missão na estética`,
          `💬 Implementar posts de conexão: "Por que escolhi trabalhar com ${data.procedimento_principal}"`,
          `🏥 Mostrar bastidores da clínica e processo de atendimento humanizado`,
          `📝 Criar depoimentos em vídeo de pacientes satisfeitas`
        ];
        break;
      
      case 'popular':
        acoesTaticas = [
          `🔥 Criar conteúdo viral: "3 sinais que você precisa de ${data.procedimento_principal}"`,
          `📱 Usar trending audios nos reels com dicas rápidas de estética`,
          `🎭 Fazer conteúdo "antes/depois" com música popular`,
          `💃 Participar de trends adaptando para estética`,
          `🗣️ Criar ganchos provocativos: "Dermatologista não quer que você saiba isso"`
        ];
        break;
      
      case 'criativo':
        acoesTaticas = [
          `✨ Desenvolver identidade visual premium para todo conteúdo`,
          `📸 Criar feed estético com paleta de cores coesa`,
          `🎨 Produzir conteúdo educativo com design sofisticado`,
          `💎 Posicionar ${data.procedimento_principal} como experiência de luxo`,
          `🌟 Criar storytelling visual da transformação das pacientes`
        ];
        break;
      
      case 'analitico':
        acoesTaticas = [
          `📊 Criar conteúdo técnico: "A ciência por trás do ${data.procedimento_principal}"`,
          `🔬 Explicar protocolos e diferenciais técnicos da clínica`,
          `📈 Mostrar resultados com dados e estatísticas`,
          `🎓 Posicionar-se como referência técnica na área`,
          `📚 Criar série educativa sobre inovações em estética`
        ];
        break;
      
      default:
        acoesTaticas = [
          `📅 Estabelecer rotina: 2 vídeos/semana sobre ${data.procedimento_principal}`,
          `📱 Criar stories diários com dicas práticas`,
          `📞 Implementar CTA claro em todo conteúdo`,
          `🎯 Focar em um procedimento por vez para gerar autoridade`,
          `📝 Criar posts educativos simples e diretos`
        ];
    }

    // Cronograma
    const cronograma = `
**Semana 1-2:** Estruturação
- Definir linha editorial focada em ${data.procedimento_principal}
- Criar templates de conteúdo
- Configurar processo de atendimento

**Semana 3-4:** Execução
- Implementar ${acoesTaticas.length} ações táticas
- Testar e otimizar abordagens
- Medir primeiros resultados

**Mês 2-3:** Escala
- Dobrar frequência do que funcionar
- Automatizar processos
- Expandir para outros procedimentos`;

    // Quadro de conteúdo
    const quadroConteudo = profile === 'direto' 
      ? `**"Transformação Garantida"** - Mostre antes/depois + depoimento + oferta exclusiva + CTA forte`
      : profile === 'emocional'
      ? `**"Jornada da Autoestima"** - Conte histórias reais de transformação + conexão emocional + convite`
      : profile === 'popular'
      ? `**"Segredos da Estética"** - Dicas rápidas + trending audio + gancho forte + call to action`
      : profile === 'criativo'
      ? `**"Estética Premium"** - Visual sofisticado + processo exclusivo + experiência de luxo`
      : profile === 'analitico'
      ? `**"Ciência da Beleza"** - Explicação técnica + evidências + resultados comprovados`
      : `**"Dicas Práticas"** - Educação simples + aplicação imediata + próximo passo claro`;

    // Campanha
    const campanha = `💡 **"${data.procedimento_principal} que Transforma"** - Campanha de 30 dias focada em mostrar o poder transformador do procedimento principal, com storytelling real e oferta especial.`;

    return `
## 🎯 **DIAGNÓSTICO ESTRATÉGICO**

${diagnostico}

---

## 🧠 **AÇÕES TÁTICAS PRIORITÁRIAS**

${acoesTaticas.map((acao, index) => `${index + 1}. ${acao}`).join('\n')}

---

## 🗓️ **CRONOGRAMA MÍNIMO**

${cronograma}

---

## ✨ **QUADRO DE CONTEÚDO RECOMENDADO**

${quadroConteudo}

---

## 💡 **IDEIA ÂNCORA DA CAMPANHA**

${campanha}

---

**Próximo passo:** Escolha as 3 primeiras ações táticas e comece na próxima segunda-feira. Foque na consistência antes da perfeição.
`;
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage = input;
    setInput('');
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    
    if (!briefingStarted) {
      if (userMessage.toLowerCase().includes('sim') || 
          userMessage.toLowerCase().includes('vamos') || 
          userMessage.toLowerCase().includes('começar')) {
        startBriefing();
      } else {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'Quando estiver pronto para começar o briefing estratégico, me avise! Vai ser rápido e direto ao ponto.',
          type: 'question'
        }]);
      }
    } else if (!briefingCompleted) {
      handleNextQuestion(userMessage);
    }
  };

  const getProgressPercentage = () => {
    if (!briefingStarted) return 0;
    
    const totalQuestions = BRIEFING_QUESTIONS.reduce((acc, cat) => acc + cat.questions.length, 0);
    const currentQuestionNumber = BRIEFING_QUESTIONS.slice(0, currentCategoryIndex).reduce((acc, cat) => acc + cat.questions.length, 0) + currentQuestionIndex + 1;
    
    return Math.round((currentQuestionNumber / totalQuestions) * 100);
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-primary" />
            Consultor Fluida
          </CardTitle>
          {briefingStarted && !briefingCompleted && (
            <Badge variant="outline" className="bg-primary/10">
              {getProgressPercentage()}% concluído
            </Badge>
          )}
          {briefingCompleted && (
            <Badge className="bg-green-100 text-green-800">
              <Target className="h-3 w-3 mr-1" />
              Análise completa
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full p-4">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`flex mb-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src="/lovable-uploads/f10b82b4-cb1b-4038-be9c-b1ba32da698b.png" />
                  <AvatarFallback>CF</AvatarFallback>
                </Avatar>
              )}
              <div
                className={`p-3 rounded-lg max-w-[85%] ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : message.type === 'final'
                    ? 'bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200'
                    : 'bg-muted'
                }`}
              >
                <div className="whitespace-pre-wrap text-sm">
                  {message.content}
                </div>
                {message.type === 'final' && (
                  <div className="mt-3 pt-3 border-t border-purple-200">
                    <Badge variant="outline" className="text-xs">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Plano Estratégico Personalizado
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start mb-4">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src="/lovable-uploads/f10b82b4-cb1b-4038-be9c-b1ba32da698b.png" />
                <AvatarFallback>CF</AvatarFallback>
              </Avatar>
              <div className="bg-muted p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  <span className="text-sm text-muted-foreground ml-2">Analisando estratégia...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </ScrollArea>
      </CardContent>
      
      <CardFooter className="pt-3 border-t">
        {!briefingCompleted && (
          <div className="flex w-full items-center space-x-2">
            <Input
              placeholder={briefingStarted ? "Sua resposta..." : "Digite 'sim' para começar o briefing..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !loading) {
                  handleSend();
                }
              }}
              className="flex-1"
              disabled={loading}
            />
            <Button onClick={handleSend} disabled={loading || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        )}
        
        {briefingCompleted && (
          <div className="w-full text-center">
            <Button
              onClick={() => {
                // Reset para novo briefing
                setBriefingStarted(false);
                setBriefingCompleted(false);
                setCurrentQuestionIndex(-1);
                setCurrentCategoryIndex(0);
                setBriefingData({});
                setMessages([{
                  role: 'assistant',
                  content: 'Pronto para um novo briefing estratégico? Vamos analisar outra clínica ou refinar esta estratégia?',
                  type: 'question'
                }]);
              }}
              variant="outline"
              className="w-full"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Novo Briefing Estratégico
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default FluidaConsultant;
