
// Sistema de referências fictícias para APENAS 4 mentores

export const MENTOR_REFERENCES = {
  'Pedro Sobral': 'Pedro "PlanejaTudo" Sobral 🔷',
  'Leandro Ladeira': 'Ladeira "CopyWarrior" das Vendas 💰',
  'Hyeser Souza': 'Hyeser "ViralizaBR" Souza 😄',
  'Paulo Cuenca': 'Cuenca "Cinema" Criativo 🎬'
};

export const getMentorReference = (originalMentor: string): string => {
  return MENTOR_REFERENCES[originalMentor as keyof typeof MENTOR_REFERENCES] || 'Mentor Fluida Pro Max 🌟';
};
