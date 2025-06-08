
import { MarketingConsultantState } from '../types';

export const generateMarketingDiagnostic = async (state: MarketingConsultantState): Promise<string> => {
  try {
    const response = await fetch('/api/generate-marketing-diagnostic', {
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
    return data.diagnostic || 'Diagnóstico gerado com sucesso!';
  } catch (error) {
    console.error('Erro ao gerar diagnóstico:', error);
    throw new Error('Erro ao gerar diagnóstico');
  }
};
