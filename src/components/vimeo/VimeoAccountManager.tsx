
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

/**
 * Componente de gestão de conta Vimeo - versão desativada.
 * Toda a integração com Vimeo foi removida na auditoria, inclusive do banco de dados.
 */
export default function VimeoAccountManager() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-amber-600">
          <AlertCircle className="h-5 w-5" />
          Integração com Vimeo desativada
        </CardTitle>
        <CardDescription>
          Esta funcionalidade foi descontinuada. A integração direta com o Vimeo e o gerenciamento de contas/token foram removidos do sistema.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert variant="destructive" className="bg-amber-50 border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800">Integração desativada</AlertTitle>
          <AlertDescription className="text-amber-700">
            A importação, autenticação ou sincronização de vídeos via Vimeo não está mais disponível nesta área do sistema. 
            Se tiver alguma dúvida ou precisar recuperar vídeos, entre em contato com o suporte técnico.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
