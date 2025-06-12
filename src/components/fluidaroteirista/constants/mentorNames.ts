
export const MENTOR_NICKNAMES = {
  'Paulo Cuenca': 'Dr. Criatividade ✨',
  'Leandro Ladeira': 'Mestre das Vendas 💰',
  'Ícaro de Carvalho': 'Guru da Conexão 🤝',
  'Camila Porto': 'Professora Elegante 🎓',
  'Hyeser Souza': 'Rei do Humor 😄',
  'Washington Olivetto': 'Publicitário Genial 🎯',
  'Pedro Sobral': 'Estrategista Digital 📊',
  'Akinator': 'Adivinho dos Negócios 🔮',
  'Criativo': 'Artista da Palavra 🎨',
  'Fluida Encantadora': 'Fada Madrinha Disney ✨🏰',
  'FLUIDAROTEIRISTA Disney': 'Contador de Histórias Mágicas 🌟'
};

export const getMentorNickname = (mentorName: string): string => {
  return MENTOR_NICKNAMES[mentorName as keyof typeof MENTOR_NICKNAMES] || mentorName;
};
