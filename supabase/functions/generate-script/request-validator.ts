
export class RequestValidator {
  static validateOpenAIKey(): string {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      console.error("❌ OPENAI_API_KEY não encontrado");
      throw new Error('OPENAI_API_KEY não configurado');
    }
    return openAIApiKey;
  }

  static validateRequest(requestData: any): any {
    console.log("🔍 Validando estrutura da requisição...");
    
    // Validações básicas
    if (typeof requestData !== 'object') {
      throw new Error("Formato de requisição inválido: dados devem ser um objeto");
    }

    // Extrair campos com defaults direto dos dados recebidos
    const validatedRequest = {
      type: requestData.type || 'script',
      content: requestData.content || requestData.topic || '',
      topic: requestData.topic || '',
      equipment: requestData.equipment || '',
      mentor: requestData.mentor || 'Hyeser Souza',
      format: requestData.format || 'reels',
      bodyArea: requestData.bodyArea || '',
      elementos_aplicados: requestData.elementos_aplicados || {},
      scientificContext: requestData.scientificContext || '',
      tone: requestData.tone || 'profissional',
      language: requestData.language || 'pt-BR'
    };

    console.log("✅ Requisição validada com sucesso");
    return validatedRequest;
  }
}
