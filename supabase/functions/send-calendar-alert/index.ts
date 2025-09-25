import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get environment variables
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Configurações do Supabase não encontradas");
    }

    // Create Supabase admin client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    // Get request data
    let requestData;
    try {
      requestData = await req.json();
    } catch (error) {
      return new Response(
        JSON.stringify({ error: "Formato de requisição inválido" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const { userId, frequency, weekData } = requestData;
    
    if (!userId) {
      return new Response(
        JSON.stringify({ error: "ID do usuário não fornecido" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Get user data
    const { data: user, error: userError } = await supabase
      .from('perfis')
      .select('nome, email')
      .eq('id', userId)
      .single();
      
    if (userError || !user) {
      console.error("Erro ao buscar dados do usuário:", userError);
      return new Response(
        JSON.stringify({ error: "Usuário não encontrado" }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Generate email content
    let emailSubject, emailContent;
    
    if (weekData && Array.isArray(weekData) && weekData.length > 0) {
      // If we have week data, generate email with suggestions
      if (frequency === "daily") {
        // Daily frequency shows top 3 suggestions
        const topSuggestions = weekData.slice(0, 3);
        
        emailSubject = "Suas Sugestões de Conteúdo Fluida";
        emailContent = generateDailySuggestionsEmail(user.nome, topSuggestions);
      } else {
        // Weekly frequency shows the full week
        emailSubject = "Sua Grade de Conteúdo Semanal Fluida";
        emailContent = generateWeeklySuggestionsEmail(user.nome, weekData);
      }
    } else {
      // If no data provided, generate generic email
      emailSubject = "Não perca nenhuma oportunidade de conteúdo - Fluida";
      emailContent = generateGenericEmail(user.nome);
    }
    
    // Send email using native SMTP via send-native-email function
    const emailResponse = await fetch(`${SUPABASE_URL}/functions/v1/send-native-email`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from_name: "Fluida",
        from_email: "noreply@fluida.online",
        to_email: user.email,
        subject: emailSubject,
        html_content: emailContent,
        priority: 'normal'
      })
    });
    
    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error("Erro ao enviar e-mail via SMTP:", errorText);
      throw new Error(`Falha ao enviar e-mail via SMTP: ${errorText}`);
    }
    
    const emailResult = await emailResponse.json();
    console.log("E-mail enviado com sucesso via SMTP:", emailResult);
    
    // Update the last execution time for this alert
    await supabase
      .from('alertas_email')
      .update({ ultima_execucao: new Date().toISOString() })
      .eq('usuario_id', userId)
      .eq('tipo', 'agenda_criativa');
      
    // Return success response
    return new Response(
      JSON.stringify({ success: true, message: "E-mail enviado com sucesso" }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Erro na função send-calendar-alert:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Helper function to format date in PT-BR
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long' 
  });
}

// Helper function to get icon for content type
function getContentTypeIcon(type: string): string {
  switch (type) {
    case "videoScript":
      return "🎬";
    case "dailySales":
      return "📱";
    case "bigIdea":
      return "🎨";
    default:
      return "📄";
  }
}

// Generate email for daily suggestions (3 top suggestions)
function generateDailySuggestionsEmail(userName: string, suggestions: any[]): string {
  let suggestionsList = "";
  
  suggestions.forEach(suggestion => {
    suggestionsList += `
      <div style="margin-bottom: 20px; padding: 15px; border-radius: 8px; background-color: #f9f9f9; border-left: 4px solid #5e72e4;">
        <div style="font-weight: bold; font-size: 16px; margin-bottom: 8px;">
          ${getContentTypeIcon(suggestion.type)} ${suggestion.title}
        </div>
        <div style="font-size: 14px; color: #666; margin-bottom: 8px;">
          ${suggestion.description}
        </div>
        <div style="font-size: 12px; color: #888;">
          ${formatDate(suggestion.date)}
        </div>
      </div>
    `;
  });
  
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #5e72e4; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">Suas Sugestões de Conteúdo</h1>
      </div>
      
      <div style="padding: 20px; background-color: white; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <p style="font-size: 16px; line-height: 1.5;">Olá, ${userName}!</p>
        
        <p style="font-size: 16px; line-height: 1.5;">Preparamos 3 ideias criativas para impulsionar seus resultados. Confira:</p>
        
        ${suggestionsList}
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="https://fluida.online/calendario" style="background-color: #5e72e4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
            Ver Minha Agenda Completa
          </a>
        </div>
        
        <p style="font-size: 14px; color: #888; margin-top: 30px; text-align: center;">
          "Consistência é a chave para o sucesso nas redes sociais."
        </p>
      </div>
      
      <div style="text-align: center; padding: 20px; font-size: 12px; color: #999;">
        <p>Fluida - O seu assistente de conteúdo para clínicas</p>
      </div>
    </div>
  `;
}

// Generate email for weekly schedule
function generateWeeklySuggestionsEmail(userName: string, weekData: any[]): string {
  let weekContent = "";
  
  // Group suggestions by day
  const groupedByDay: Record<string, any[]> = {};
  
  weekData.forEach(suggestion => {
    const date = suggestion.date;
    if (!groupedByDay[date]) {
      groupedByDay[date] = [];
    }
    groupedByDay[date].push(suggestion);
  });
  
  // Generate content for each day
  Object.keys(groupedByDay).sort().forEach(date => {
    const daySuggestions = groupedByDay[date];
    
    weekContent += `
      <div style="margin-bottom: 30px;">
        <h3 style="border-bottom: 1px solid #eee; padding-bottom: 8px; color: #333;">
          ${formatDate(date)}
        </h3>
    `;
    
    daySuggestions.forEach(suggestion => {
      weekContent += `
        <div style="padding: 10px; margin-bottom: 10px; background-color: #f9f9f9; border-radius: 4px;">
          <div style="font-weight: bold;">
            ${getContentTypeIcon(suggestion.type)} ${suggestion.title}
          </div>
          <div style="font-size: 14px; color: #666; margin-top: 4px;">
            ${suggestion.description}
          </div>
        </div>
      `;
    });
    
    weekContent += `</div>`;
  });
  
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #5e72e4; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">Sua Grade de Conteúdo Semanal</h1>
      </div>
      
      <div style="padding: 20px; background-color: white; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <p style="font-size: 16px; line-height: 1.5;">Olá, ${userName}!</p>
        
        <p style="font-size: 16px; line-height: 1.5;">Aqui está sua grade de conteúdo para a semana:</p>
        
        ${weekContent}
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="https://fluida.online/calendario" style="background-color: #5e72e4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
            Visualizar em Meu Calendário
          </a>
        </div>
        
        <p style="font-size: 14px; color: #888; margin-top: 30px; text-align: center;">
          "Planejamento é a chave para o sucesso nas redes sociais."
        </p>
      </div>
      
      <div style="text-align: center; padding: 20px; font-size: 12px; color: #999;">
        <p>Fluida - O seu assistente de conteúdo para clínicas</p>
      </div>
    </div>
  `;
}

// Generate generic promotional email when no data is provided
function generateGenericEmail(userName: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #5e72e4; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">Não perca oportunidades de conteúdo!</h1>
      </div>
      
      <div style="padding: 20px; background-color: white; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <p style="font-size: 16px; line-height: 1.5;">Olá, ${userName}!</p>
        
        <p style="font-size: 16px; line-height: 1.5;">Sua agenda criativa está cheia de oportunidades para criar conteúdo relevante para sua clínica.</p>
        
        <p style="font-size: 16px; line-height: 1.5;">Não deixe para depois! Conteúdo constante é a chave para o sucesso nas redes sociais.</p>
        
         <div style="text-align: center; margin: 30px 0;">
           <a href="https://fluida.online/calendario" style="background-color: #5e72e4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
             Ver Minha Agenda Agora
           </a>
         </div>
        
        <div style="background-color: #f9f9f9; border-left: 4px solid #5e72e4; padding: 15px; margin: 20px 0;">
          <p style="font-size: 16px; font-style: italic; margin: 0;">
            "Quem é visto, é lembrado. Mantenha sua presença online com conteúdo de qualidade."
          </p>
        </div>
      </div>
      
      <div style="text-align: center; padding: 20px; font-size: 12px; color: #999;">
        <p>Fluida - O seu assistente de conteúdo para clínicas</p>
      </div>
    </div>
  `;
}
