
import { buildPrompt } from "./prompt-builder.ts";
import { formatScriptResponse } from "./response-formatter.ts";

interface RequestData {
  type: string;
  topic: string;
  equipment?: string;
  bodyArea?: string;
  purpose?: string;
  additionalInfo?: string;
  tone?: string;
  language?: string;
  marketingObjective?: string;
  systemPrompt?: string;
  userPrompt?: string;
}

export class RequestHandler {
  private openAIApiKey: string;

  constructor(openAIApiKey: string) {
    this.openAIApiKey = openAIApiKey;
  }

  async processRequest(requestData: RequestData) {
    const { type, topic, equipment, bodyArea, purpose, additionalInfo, tone, language, marketingObjective, systemPrompt, userPrompt } = requestData;
    
    console.log(`🎬 Processando ${type === 'custom' ? 'FLUIDAROTEIRISTA' : 'roteiro padrão'}`);

    let finalSystemPrompt: string;
    let finalUserPrompt: string;

    // Handle FLUIDAROTEIRISTA custom prompts
    if (type === 'custom' && systemPrompt && userPrompt) {
      console.log("🎬 Usando prompts FLUIDAROTEIRISTA customizados");
      finalSystemPrompt = systemPrompt;
      finalUserPrompt = userPrompt;
    } else {
      console.log("📝 Construindo prompts padrão");
      const prompts = buildPrompt({
        type,
        topic,
        equipment: equipment ? [equipment] : undefined,
        bodyArea,
        purpose: purpose ? [purpose] : undefined,
        additionalInfo,
        tone,
        language,
        marketingObjective
      });
      finalSystemPrompt = prompts.systemPrompt;
      finalUserPrompt = prompts.userPrompt;
    }

    console.log("System Prompt preview:", finalSystemPrompt.substring(0, 200) + "...");
    console.log("User Prompt preview:", finalUserPrompt.substring(0, 200) + "...");
    
    return { finalSystemPrompt, finalUserPrompt };
  }

  async callOpenAI(systemPrompt: string, userPrompt: string, type: string) {
    // Usar modelo mais adequado para FLUIDAROTEIRISTA
    const modelToUse = type === 'custom' ? "gpt-4o" : "gpt-4o-mini";
    console.log(`🤖 Usando modelo: ${modelToUse}`);
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.openAIApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: modelToUse,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: type === 'custom' ? 0.8 : 0.7, // Mais criatividade para FLUIDAROTEIRISTA
        max_tokens: type === 'custom' ? 2500 : 2000,
        response_format: type === 'custom' && systemPrompt.includes('JSON') ? { type: "json_object" } : undefined
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erro na API OpenAI:", errorText);
      throw new Error(`Erro na API OpenAI: Status ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    if (data.error) {
      console.error("Erro retornado pela API OpenAI:", data.error);
      throw new Error(`Erro na API OpenAI: ${data.error.message}`);
    }

    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      console.error("Conteúdo vazio na resposta da OpenAI:", data);
      throw new Error("Resposta vazia da API OpenAI");
    }

    console.log("🎬 Conteúdo FLUIDAROTEIRISTA gerado com sucesso");
    return content;
  }

  formatResponse(content: string, type: string, topic: string, equipment?: string, bodyArea?: string) {
    return formatScriptResponse({
      content, 
      type, 
      topic, 
      equipment: equipment ? [equipment] : undefined, 
      bodyArea
    });
  }
}
