
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
    
    // Suportar corpo aninhado { request: {...} }
    const payload = (requestData && typeof requestData === 'object' && requestData.request)
      ? requestData.request
      : requestData;
    
    // Validações básicas
    if (typeof payload !== 'object') {
      throw new Error("Formato de requisição inválido: dados devem ser um objeto");
    }

    // Extrair campos com defaults direto dos dados recebidos
    const validatedRequest = {
      type: payload.type || 'script',
      content: payload.content || payload.topic || '',
      topic: payload.topic || '',
      equipment: payload.equipment || '',
      mentor: payload.mentor || 'Hyeser Souza',
      format: payload.format || 'reels',
      bodyArea: payload.bodyArea || '',
      elementos_aplicados: payload.elementos_aplicados || {},
      scientificContext: payload.scientificContext || '',
      tone: payload.tone || 'profissional',
      language: payload.language || 'pt-BR',
      modelTier: payload.modelTier === 'gpt5' ? 'gpt5' : 'standard'
    } as any;

    console.log("✅ Requisição validada com sucesso");
    return validatedRequest;
  }
}
