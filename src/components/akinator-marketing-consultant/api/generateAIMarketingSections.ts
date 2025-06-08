
import { MarketingConsultantState } from '../types';

export const generateAIMarketingSections = async (state: MarketingConsultantState): Promise<any> => {
  try {
    const response = await fetch('/api/generate-ai-marketing-sections', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(state),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.sections || {};
  } catch (error) {
    console.error('Erro ao gerar seções de marketing:', error);
    throw new Error('Erro ao gerar seções de marketing');
  }
};
