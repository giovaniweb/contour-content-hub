
export class ErrorHandler {
  static handle(error: any, corsHeaders: Record<string, string>) {
    console.error('🔥 Error in FLUIDAROTEIRISTA function:', error);
    
    let errorMessage = 'Unknown error occurred';
    let statusCode = 500;

    if (error.message) {
      errorMessage = error.message;
    }

    if (error.message?.includes('OPENAI_API_KEY')) {
      statusCode = 500;
      errorMessage = 'OpenAI API key configuration error';
    } else if (error.message?.includes('API OpenAI')) {
      statusCode = 502;
      errorMessage = 'OpenAI API error';
    } else if (error.message?.includes('Formato de requisição inválido')) {
      statusCode = 400;
    }

    return new Response(JSON.stringify({ error: errorMessage }), {
      status: statusCode,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}
