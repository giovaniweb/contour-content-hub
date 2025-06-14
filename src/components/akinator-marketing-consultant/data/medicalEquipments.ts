
// Equipamentos médicos temporários para fallback
export const medicalEquipmentsFallback = [
  {
    id: 'laser-co2-medico',
    nome: 'Laser CO2 Fracionado',
    categoria: 'medico' as const,
    ativo: true,
    akinator_enabled: true,
    tecnologia: 'Laser CO2 Fracionado',
    beneficios: 'Rejuvenescimento facial, tratamento de cicatrizes',
    diferenciais: 'Precisão micrométrica, controle de profundidade',
    indicacoes: 'Rugas profundas, cicatrizes de acne, melasma',
    linguagem: 'pt',
    data_cadastro: new Date().toISOString(),
    image_url: '',
    efeito: 'Renovação celular e estímulo de colágeno'
  },
  {
    id: 'laser-nd-yag',
    nome: 'Laser Nd:YAG',
    categoria: 'medico' as const,
    ativo: true,
    akinator_enabled: true,
    tecnologia: 'Laser Neodímio YAG 1064nm',
    beneficios: 'Remoção de tatuagens, lesões pigmentadas',
    diferenciais: 'Penetração profunda, seguro para todos os fototipos',
    indicacoes: 'Tatuagens, nevos, melasma profundo',
    linguagem: 'pt',
    data_cadastro: new Date().toISOString(),
    image_url: '',
    efeito: 'Fragmentação de pigmentos'
  },
  {
    id: 'ipl-medico',
    nome: 'IPL (Luz Intensa Pulsada)',
    categoria: 'medico' as const,
    ativo: true,
    akinator_enabled: true,
    tecnologia: 'Luz Intensa Pulsada',
    beneficios: 'Fotorrejuvenescimento, remoção de manchas',
    diferenciais: 'Múltiplos comprimentos de onda, versatilidade',
    indicacoes: 'Manchas solares, rosácea, rejuvenescimento',
    linguagem: 'pt',
    data_cadastro: new Date().toISOString(),
    image_url: '',
    efeito: 'Fototermólise seletiva'
  },
  {
    id: 'peeling-quimico',
    nome: 'Peeling Químico Profundo',
    categoria: 'medico' as const,
    ativo: true,
    akinator_enabled: true,
    tecnologia: 'Ácidos específicos para uso médico',
    beneficios: 'Renovação celular profunda',
    diferenciais: 'Controle médico rigoroso',
    indicacoes: 'Cicatrizes, rugas profundas, hiperpigmentação',
    linguagem: 'pt',
    data_cadastro: new Date().toISOString(),
    image_url: '',
    efeito: 'Descamação controlada e renovação'
  },
  {
    id: 'microagulhamento-medico',
    nome: 'Microagulhamento Médico',
    categoria: 'medico' as const,
    ativo: true,
    akinator_enabled: true,
    tecnologia: 'Microagulhas estéreis de uso médico',
    beneficios: 'Estímulo de colágeno, melhora de textura',
    diferenciais: 'Profundidade controlada, ambiente médico',
    indicacoes: 'Cicatrizes, estrias, flacidez',
    linguagem: 'pt',
    data_cadastro: new Date().toISOString(),
    image_url: '',
    efeito: 'Neocolagênese e renovação tecidual'
  }
];
