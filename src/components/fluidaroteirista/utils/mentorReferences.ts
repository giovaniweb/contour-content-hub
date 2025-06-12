
// Sistema de referências fictícias para mentores
export const MENTOR_REFERENCES = {
  'Criativo': 'Aurora Criativa',
  'Técnico': 'Prof. TechnoSaber',
  'Emocional': 'Dra. Empatia',
  'Vendedor': 'Mestre ConvertMax',
  'Educador': 'Guru EduWise',
  'Inspirador': 'Coach MotivaPro',
  'Analítico': 'Expert DataFlow',
  'Storyteller': 'Narrador Epic',
  'Disruptivo': 'Rebel InnovaX',
  'Científico': 'Dr. ResearchPro'
};

export const getMentorReference = (originalMentor: string): string => {
  return MENTOR_REFERENCES[originalMentor as keyof typeof MENTOR_REFERENCES] || 'Mentor Fluida';
};
