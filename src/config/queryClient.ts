
import { QueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';

// Configuração global para o cliente de consulta
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutos
      onError: (error) => {
        // Tratamento global de erros para consultas
        console.error("Erro na consulta:", error);
        toast({
          title: "Erro na requisição",
          description: error instanceof Error ? error.message : "Ocorreu um erro inesperado",
          variant: "destructive",
        });
      }
    },
    mutations: {
      retry: 0,
      onError: (error) => {
        // Tratamento global de erros para mutações
        console.error("Erro na mutação:", error);
        toast({
          title: "Erro na operação",
          description: error instanceof Error ? error.message : "Ocorreu um erro ao processar esta operação",
          variant: "destructive",
        });
      }
    }
  }
});

export default queryClient;
