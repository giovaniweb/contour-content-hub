
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
    
    // Verificar se tem a propriedade 'request'
    if (!requestData.request) {
      console.error("❌ Propriedade 'request' não encontrada nos dados");
      throw new Error("Formato de requisição inválido: propriedade 'request' é obrigatória");
    }

    const request = requestData.request;
    
    // Validações básicas
    if (typeof request !== 'object') {
      throw new Error("Formato de requisição inválido: 'request' deve ser um objeto");
    }

    // Extrair campos com defaults
    const validatedRequest = {
      type: request.type || 'custom',
      systemPrompt: request.systemPrompt || '',
      userPrompt: request.userPrompt || '',
      topic: request.topic || '',
      equipment: request.equipment || '',
      bodyArea: request.bodyArea || '',
      purpose: request.purpose || '',
      additionalInfo: request.additionalInfo || '',
      tone: request.tone || 'profissional',
      language: request.language || 'pt-BR',
      marketingObjective: request.marketingObjective || ''
    };

    console.log("✅ Requisição validada com sucesso");
    return validatedRequest;
  }
}
