
export class RequestValidator {
  static validateRequest(requestData: any) {
    if (!requestData) {
      throw new Error('Formato de requisição inválido: dados não encontrados');
    }

    const { request } = requestData;
    if (!request) {
      throw new Error('Formato de requisição inválido: "request" não encontrado');
    }

    return request;
  }

  static validateOpenAIKey() {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      console.error("OPENAI_API_KEY não encontrado");
      throw new Error('OPENAI_API_KEY não encontrado');
    }
    return openAIApiKey;
  }
}
