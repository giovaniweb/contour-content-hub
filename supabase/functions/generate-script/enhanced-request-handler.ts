import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { MentorPromptGenerator } from "./mentor-prompt-generator.ts";

interface EquipmentDetail {
  id: string;
  nome: string;
  tecnologia: string;
  beneficios: string;
  indicacoes: string;
  diferenciais: string;
  linguagem: string;
}

export class EnhancedRequestHandler {
  private supabase: any;
  private openAIApiKey: string;

  constructor(openAIApiKey: string) {
    this.openAIApiKey = openAIApiKey;
    this.supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    );
  }

  /**
   * Fetch equipment details from database
   */
  private async fetchEquipmentDetails(equipmentName?: string): Promise<EquipmentDetail[]> {
    if (!equipmentName) {
      console.log("⚠️ Nenhum equipamento especificado");
      return [];
    }

    try {
      console.log("🔍 Buscando equipamento:", equipmentName);
      
      const { data, error } = await this.supabase
        .from('equipamentos')
        .select('*')
        .ilike('nome', `%${equipmentName}%`)
        .eq('ativo', true)
        .limit(5);

      if (error) {
        console.error('❌ Erro ao buscar equipamentos:', error);
        return [];
      }

      if (!data || data.length === 0) {
        console.log("⚠️ Nenhum equipamento encontrado para:", equipmentName);
        return [];
      }

      const equipmentDetails: EquipmentDetail[] = data.map(eq => ({
        id: eq.id,
        nome: eq.nome,
        tecnologia: eq.tecnologia || 'Tecnologia não especificada',
        beneficios: eq.beneficios || 'Benefícios não especificados',
        indicacoes: eq.indicacoes || 'Indicações não especificadas',
        diferenciais: eq.diferenciais || 'Diferenciais não especificados',
        linguagem: eq.linguagem || 'Português'
      }));

      console.log("✅ Equipamentos encontrados:", equipmentDetails.length);
      return equipmentDetails;

    } catch (err) {
      console.error('❌ Erro na busca de equipamentos:', err);
      return [];
    }
  }

  /**
   * Generate mentor-based creative prompts
   */
  private generateMentorPrompts(request: any, equipmentDetails: EquipmentDetail[], scientificContext: string = '') {
    console.log("🎭 Gerando prompts baseados no mentor:", request.mentor || 'Hyeser Souza');
    
    const mentorName = request.mentor || 'Hyeser Souza';
    const topic = request.topic || request.content || 'Tratamento estético';
    const equipment = equipmentDetails.length > 0 ? equipmentDetails[0].nome : (request.equipment || 'equipamento estético');
    const format = request.format || 'reels';
    
    // Gerar prompts personalizados baseados no mentor
    const { systemPrompt, userPrompt } = MentorPromptGenerator.generateMentorPrompt(
      mentorName,
      topic,
      equipment,
      scientificContext,
      format
    );
    
    console.log("✅ Prompts criativos gerados para", mentorName);
    
    return { systemPrompt, userPrompt };
  }

  /**
   * Process Fluida request with mentor-based creativity and equipment integration
   */
  async processFluidaRequest(request: any) {
    console.log("🎬 Iniciando processamento FLUIDA com mentor:", request.mentor || 'Hyeser Souza');
    
    // Fetch equipment details
    const equipmentDetails = await this.fetchEquipmentDetails(request.equipment);
    
    // Build scientific context from request
    const scientificContext = request.scientificContext || '';
    
    // Generate mentor-based creative prompts
    const { systemPrompt, userPrompt } = this.generateMentorPrompts(request, equipmentDetails, scientificContext);
    
    console.log("📋 Equipamentos processados:", equipmentDetails.length);
    console.log("🧬 Contexto científico:", scientificContext ? 'Fornecido' : 'Não fornecido');
    
    return { systemPrompt, userPrompt, equipmentDetails };
  }

  /**
   * Call OpenAI API with mentor-enhanced prompts
   */
  async callOpenAI(systemPrompt: string, userPrompt: string, equipmentDetails: EquipmentDetail[]) {
    console.log("🤖 Chamando OpenAI com prompts do mentor...");
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.8, // Increased for more creativity
        max_tokens: 2000,
        presence_penalty: 0.1,
        frequency_penalty: 0.1
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erro da OpenAI:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('❌ Resposta inválida da OpenAI:', data);
      throw new Error('Invalid OpenAI response structure');
    }

    const content = data.choices[0].message.content;
    console.log("✅ Conteúdo criativo gerado com sucesso");
    
    // Log para debug (primeira linha apenas)
    console.log("📝 Preview:", content.split('\n')[0]);
    
    return content;
  }
}