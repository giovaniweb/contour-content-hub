
// Sistema de referências fictícias para APENAS 4 mentores

export const MENTOR_REFERENCES = {
  'Leandro Ladeira': 'Ladeira "CopyWarrior" das Vendas 💰'
};

export const getMentorReference = (originalMentor: string): string => {
  return MENTOR_REFERENCES[originalMentor as keyof typeof MENTOR_REFERENCES] || 'Ladeira "CopyWarrior" das Vendas 💰';
};
