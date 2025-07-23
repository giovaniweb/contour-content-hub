
// Padronização dos 4 mentores principais do sistema

export const MENTOR_NICKNAMES = {
  'Leandro Ladeira': 'Mestre do Copy 💰'
};

export const getMentorNickname = (mentorName: string): string => {
  return MENTOR_NICKNAMES[mentorName as keyof typeof MENTOR_NICKNAMES] || 'Mestre do Copy 💰';
};
