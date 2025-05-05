
import { OpenAIResponse } from './types.ts';
import { basePrompt } from './constants.ts';

export async function callOpenAI(userPrompt: string): Promise<string> {
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openAIApiKey) {
    throw new Error('OPENAI_API_KEY não encontrado');
  }
  
  // Call OpenAI API with temperature reduced for better factual accuracy
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: "gpt-4o", // Advanced model for better quality
      messages: [
        { role: "system", content: basePrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.5 // Reduced temperature for better factual accuracy
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`OpenAI API Error: Status ${response.status}, Response: ${errorText}`);
    throw new Error(`Error in OpenAI API: Status ${response.status}`);
  }
  
  const data = await response.json() as OpenAIResponse;
  return data.choices[0].message.content;
}
