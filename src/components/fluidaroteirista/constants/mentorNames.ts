
// Padronização dos 4 mentores principais do sistema

export const MENTOR_NICKNAMES = {
  'Pedro Sobral': 'Arquiteto do Planejamento 🔷',
  'Leandro Ladeira': 'Mestre do Copy 💰',
  'Hyeser Souza': 'Rei do Viral 😄',
  'Paulo Cuenca': 'Diretor Visual 🎬'
};

export const getMentorNickname = (mentorName: string): string => {
  return MENTOR_NICKNAMES[mentorName as keyof typeof MENTOR_NICKNAMES] || mentorName;
};
