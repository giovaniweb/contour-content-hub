
export class RequestHandler {
  private openAIApiKey: string;

  constructor(openAIApiKey: string) {
    this.openAIApiKey = openAIApiKey;
  }

  async processRequest(request: any) {
    const { systemPrompt, userPrompt, type, topic, equipment, bodyArea, purpose, additionalInfo, tone, language, marketingObjective } = request;

    let finalSystemPrompt = '';
    let finalUserPrompt = '';

    if (type === 'custom' && systemPrompt && userPrompt) {
      // Para FLUIDAROTEIRISTA - usar prompts customizados
      finalSystemPrompt = systemPrompt;
      finalUserPrompt = userPrompt;
      console.log("🎯 Usando prompts customizados do FLUIDAROTEIRISTA");
    } else {
      // Fallback para outros tipos
      finalSystemPrompt = this.buildSystemPrompt(type, tone, language);
      finalUserPrompt = this.buildUserPrompt(type, topic, equipment, bodyArea, purpose, additionalInfo, marketingObjective);
    }

    return { finalSystemPrompt, finalUserPrompt };
  }

  async callOpenAI(systemPrompt: string, userPrompt: string, type: string, fastMode: boolean = false) {
    // Criar controller para timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      console.log("⏰ Timeout na requisição OpenAI após 45 segundos");
    }, 45000); // 45 segundos timeout

    try {
      // Configurações otimizadas para velocidade
      const model = fastMode ? 'gpt-4o-mini' : 'gpt-4o'; // Usar modelo mais rápido em modo rápido
      const maxTokens = fastMode ? 800 : 1500; // Menos tokens para resposta mais rápida
      const temperature = fastMode ? 0.3 : 0.7; // Menos criatividade para mais velocidade

      console.log(`🚀 Usando modelo ${model} com ${maxTokens} max tokens`);

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          max_tokens: maxTokens,
          temperature: temperature,
          response_format: type === 'custom' ? { type: "json_object" } : undefined, // JSON apenas para FLUIDAROTEIRISTA
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Erro na API OpenAI:', errorText);
        throw new Error(`Erro na API OpenAI: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log("✅ Resposta OpenAI recebida com sucesso");
      
      return data.choices[0].message.content;
    } catch (error: any) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error('Timeout na geração do roteiro. A requisição demorou mais de 45 segundos.');
      }
      
      throw error;
    }
  }

  formatResponse(content: string, type: string, topic: string, equipment: string, bodyArea: string) {
    // Para FLUIDAROTEIRISTA, tentar fazer parse do JSON
    if (type === 'custom') {
      try {
        const parsedContent = JSON.parse(content);
        return {
          ...parsedContent,
          content: content,
          type: 'fluidaroteirista',
          title: `Roteiro FLUIDAROTEIRISTA - ${topic || 'Personalizado'}`,
          timestamp: new Date().toISOString()
        };
      } catch (parseError) {
        console.log("ℹ️ Conteúdo não é JSON válido, retornando como texto");
        return {
          content: content,
          type: 'fluidaroteirista',
          title: `Roteiro FLUIDAROTEIRISTA - ${topic || 'Personalizado'}`,
          roteiro: content,
          formato: 'carrossel',
          timestamp: new Date().toISOString()
        };
      }
    }

    // Formato padrão para outros tipos
    return {
      content: content,
      type: type,
      title: this.generateTitle(type, topic, equipment, bodyArea),
      timestamp: new Date().toISOString()
    };
  }

  private buildSystemPrompt(type: string, tone: string, language: string): string {
    return `Você é um especialista em marketing para clínicas estéticas. Crie conteúdo ${tone} em ${language}.`;
  }

  private buildUserPrompt(type: string, topic: string, equipment: string, bodyArea: string, purpose: string, additionalInfo: string, marketingObjective: string): string {
    return `Crie um roteiro sobre ${topic} usando ${equipment} para ${bodyArea}. Objetivo: ${purpose}. ${additionalInfo}`;
  }

  private generateTitle(type: string, topic: string, equipment: string, bodyArea: string): string {
    return `Roteiro ${type} - ${topic || equipment || bodyArea}`;
  }
}
