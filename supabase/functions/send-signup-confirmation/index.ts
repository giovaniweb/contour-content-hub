import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  email: string;
  name: string;
  userId?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name, userId }: WelcomeEmailRequest = await req.json();

    console.log(`Enviando email de boas-vindas para: ${email}`);

    // Send email using Resend API directly with fetch
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: "Equipe FluiApp <noreply@resend.dev>",
        to: [email],
        subject: "Bem-vindo(a) ao FluiApp! 🎉",
        html: `
          <!DOCTYPE html>
          <html lang="pt-BR">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Bem-vindo ao FluiApp</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Bem-vindo(a) ao FluiApp!</h1>
              <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Sua jornada de transformação começa agora</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
              <h2 style="color: #333; margin-top: 0;">Olá, ${name}! 👋</h2>
              <p>Seja muito bem-vindo(a) ao <strong>FluiApp</strong>, a plataforma completa para profissionais da área estética e médica!</p>
              <p>Estamos animados em ter você conosco nesta jornada de crescimento e transformação.</p>
            </div>

            <div style="margin-bottom: 25px;">
              <h3 style="color: #4a5568;">🚀 O que você pode fazer agora:</h3>
              <ul style="color: #666;">
                <li><strong>Explorar vídeos exclusivos</strong> - Acesse nossa biblioteca de conteúdo</li>
                <li><strong>Baixar materiais</strong> - Fotos e artes profissionais</li>
                <li><strong>Descobrir equipamentos</strong> - Encontre as melhores opções do mercado</li>
                <li><strong>Conectar-se com especialistas</strong> - Rede de profissionais qualificados</li>
              </ul>
            </div>

            <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
              <h3 style="color: #2d5a2d; margin-top: 0;">💡 Dica importante:</h3>
              <p style="margin-bottom: 0; color: #4a5a4a;">Complete seu perfil no painel administrativo para ter acesso a recursos exclusivos e personalizados!</p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${Deno.env.get("SUPABASE_URL")?.replace("/rest/v1", "") || "https://app.fluiapp.com"}/dashboard" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                Acessar Dashboard
              </a>
            </div>

            <div style="border-top: 1px solid #eee; padding-top: 20px; text-align: center; color: #666; font-size: 14px;">
              <p>Precisa de ajuda? Estamos aqui para você!</p>
              <p style="margin-bottom: 0;">
                <strong>Equipe FluiApp</strong><br>
                Transformando o futuro da estética e medicina
              </p>
            </div>
          </body>
          </html>
        `
      })
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.text();
      throw new Error(`Resend API error: ${errorData}`);
    }

    const emailResult = await emailResponse.json();
    console.log("Email de boas-vindas enviado com sucesso:", emailResult);

    return new Response(JSON.stringify({ 
      success: true, 
      emailResult,
      message: "Email de boas-vindas enviado com sucesso" 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Erro ao enviar email de boas-vindas:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);