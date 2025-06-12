
// Sistema de referências fictícias para mentores com sátiras criativas
export const MENTOR_REFERENCES = {
  'Criativo': 'Pablo Creativasso 🎨',
  'Técnico': 'Prof. TechnoSaber 🤓',
  'Emocional': 'Dra. Corações & Lágrimas 💝',
  'Vendedor': 'Mestre VendeMax Supreme 💰',
  'Educador': 'Prof. EduWise da Silva 🎓',
  'Inspirador': 'Coach MotivaBrasil Pro 🚀',
  'Analítico': 'Dr. DadosFlow Analytics 📊',
  'Storyteller': 'Narrador Epic Tales 📚',
  'Disruptivo': 'Rebel InnovaX Revolution 💡',
  'Científico': 'Dr. PesquisaMania PhD 🔬',
  'leandro_ladeira': 'Leo "GatilhoMental" Escadaria 🎯',
  'icaro_carvalho': 'Íkaro "ConexãoPro" Carvalhal 💫',
  'paulo_cuenca': 'Paulão "CineMagic" da Quebrada 🎬',
  'pedro_sobral': 'Pedro "LogicaMaster" Sobrancelha 🧠',
  'camila_porto': 'Camila "DidáticaTop" Portuga 📖',
  'hyeser_souza': 'Hyeser "ComédiaBrasil" Souzinha 😂',
  'washington_olivetto': 'Washington "BigIdea" Olivetão 💭'
};

export const getMentorReference = (originalMentor: string): string => {
  return MENTOR_REFERENCES[originalMentor as keyof typeof MENTOR_REFERENCES] || 'Mentor Fluida Pro Max 🌟';
};
