
import { useRef, useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useUserProfile } from "@/hooks/useUserProfile";

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function useMarketingConsultantChatLogic(onStartConsultation: () => void) {
  const { toast } = useToast();
  const { profile } = useUserProfile();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Olá! Sou seu consultor de marketing especializado em clínicas ${profile?.clinic_type === 'clinica_medica' ? 'médicas e' : 'de'} estética${profile?.clinic_type === 'clinica_medica' ? 's' : ''}. Estou aqui para ajudar você a crescer seu negócio com estratégias personalizadas${profile?.clinic_type ? ` para ${profile.clinic_type === 'clinica_medica' ? 'clínicas médicas' : 'clínicas estéticas'}` : ''}. Podemos começar uma análise completa ou você pode me perguntar algo específico sobre marketing para sua clínica.`
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasSavedData = typeof window !== 'undefined' && localStorage.getItem('marketing_diagnostic_data') !== null;

  // Scroll to bottom on new message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (hasSavedData) {
      const timer = setTimeout(() => {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: 'Vejo que você já fez um diagnóstico anteriormente. Você pode continuar de onde parou ou iniciar um novo diagnóstico.' 
        }]);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [hasSavedData]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setLoading(true);
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setShowSuggestions(false);

    setTimeout(() => {
      let response = '';
      if (userMessage.toLowerCase().includes('fluida te entende') || 
        userMessage.toLowerCase().includes('sugestões personalizadas') ||
        userMessage.toLowerCase().includes('consultor preditivo')) {
        response = 'O "Fluida Te Entende" é nosso consultor preditivo inteligente... Você pode encontrar sugestões personalizadas no seu Dashboard.';
        setMessages(prev => [...prev, { role: 'assistant', content: response }]);
        setLoading(false);
        return;
      }
      if (userMessage.toLowerCase().includes('diagnóstico') || 
        userMessage.toLowerCase().includes('começar') || 
        userMessage.toLowerCase().includes('analise') ||
        userMessage.toLowerCase().includes('análise') ||
        userMessage.toLowerCase().includes('pronto') ||
        userMessage.toLowerCase().includes('sim')) {
        response = 'Vamos começar uma análise completa da sua clínica. Farei algumas perguntas para entender melhor seu negócio e criar uma estratégia personalizada.';
        setMessages(prev => [...prev, { role: 'assistant', content: response }]);
        setLoading(false);
        setTimeout(() => {
          toast({
            title: "Iniciando diagnóstico",
            description: "Preparando formulário de diagnóstico para sua clínica..."
          });
          onStartConsultation();
        }, 1000);
        return;
      }
      if (userMessage.toLowerCase().includes('continuar') || 
        userMessage.toLowerCase().includes('anterior') || 
        userMessage.toLowerCase().includes('salvo') ||
        userMessage.toLowerCase().includes('volta')) {
        if (hasSavedData) {
          response = 'Perfeito! Você pode continuar de onde parou. Vamos para a simulação de lucro com base no seu diagnóstico anterior.';
          setMessages(prev => [...prev, { role: 'assistant', content: response }]);
          setLoading(false);
          setTimeout(() => {
            toast({
              title: "Recuperando dados anteriores",
              description: "Carregando seu diagnóstico salvo..."
            });
            toast({
              title: "Navegue pelas etapas",
              description: "Você pode clicar em qualquer etapa no menu lateral para navegar"
            });
          }, 1000);
          return;
        }
      }
      if (userMessage.toLowerCase().includes('instagram')) {
        response = 'O Instagram é uma plataforma essencial para clínicas estéticas...';
      } else if (userMessage.toLowerCase().includes('facebook') || userMessage.toLowerCase().includes('meta')) {
        response = 'O Facebook Ads continua sendo uma ferramenta poderosa para clínicas de estética...';
      } else if (userMessage.toLowerCase().includes('google') || userMessage.toLowerCase().includes('ads')) {
        response = 'Anúncios no Google são ideais para capturar pessoas que já estão procurando por serviços estéticos...';
      } else if (hasSavedData && (userMessage.toLowerCase().includes('novo') || userMessage.toLowerCase().includes('reiniciar'))) {
        response = 'Entendi que você deseja iniciar um novo diagnóstico. Isso substituirá seus dados salvos anteriormente. Está certo disso? Podemos começar agora mesmo mesmo.';
      } else {
        response = 'Entendi sua questão. Para criar uma estratégia realmente eficaz para sua clínica, precisamos realizar um diagnóstico completo. Posso te guiar por esse processo agora mesmo. Está pronto para começar?';
        setShowSuggestions(true);
      }
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setLoading(false);
    }, 1000);
  };

  const handleStartDiagnostic = () => {
    setMessages(prev => [
      ...prev,
      { role: 'user', content: 'Estou pronto para iniciar o diagnóstico' },
      { role: 'assistant', content: 'Ótimo! Vamos começar o diagnóstico personalizado para sua clínica de estética.' },
    ]);
    toast({
      title: "Iniciando diagnóstico",
      description: "Preparando formulário de diagnóstico para sua clínica..."
    });
    setTimeout(() => {
      onStartConsultation();
    }, 1000);
  };

  const handleSetSuggestion = (text: string) => {
    setInput(text);
    document.querySelector('input')?.focus();
  };

  return {
    state: {
      messages, setMessages, input, setInput, loading, showSuggestions, setShowSuggestions, messagesEndRef, hasSavedData
    },
    actions: {
      handleSend, handleStartDiagnostic, handleSetSuggestion
    }
  };
}
