
export const mockEquipments = [
  {
    id: 'laser-co2',
    nome: 'Laser CO2',
    categoria: 'medico' as const,
    ativo: true,
    tecnologia: 'Laser CO2 Fracionado',
    beneficios: 'Rejuvenescimento facial',
    diferenciais: 'Precisão e segurança',
    indicacoes: 'Rugas, cicatrizes, manchas',
    linguagem: 'pt',
    data_cadastro: new Date().toISOString(),
    image_url: '',
    efeito: 'Renovação celular'
  },
  {
    id: 'radiofrequencia',
    nome: 'Radiofrequência',
    categoria: 'estetico' as const,
    ativo: true,
    tecnologia: 'Radiofrequência Monopolar',
    beneficios: 'Firmeza da pele',
    diferenciais: 'Não invasivo',
    indicacoes: 'Flacidez, celulite',
    linguagem: 'pt',
    data_cadastro: new Date().toISOString(),
    image_url: '',
    efeito: 'Aquecimento dérmico'
  },
  {
    id: 'criolipolise',
    nome: 'Criolipólise',
    categoria: 'estetico' as const,
    ativo: true,
    tecnologia: 'Congelamento Controlado',
    beneficios: 'Redução de gordura localizada',
    diferenciais: 'Sem cirurgia',
    indicacoes: 'Gordura localizada',
    linguagem: 'pt',
    data_cadastro: new Date().toISOString(),
    image_url: '',
    efeito: 'Apoptose das células de gordura'
  },
  {
    id: 'ultrassom-focado',
    nome: 'HIFU (Ultrassom Focado)',
    categoria: 'medico' as const,
    ativo: true,
    tecnologia: 'Ultrassom Microfocado',
    beneficios: 'Lifting não cirúrgico',
    diferenciais: 'Ação profunda',
    indicacoes: 'Flacidez facial e corporal',
    linguagem: 'pt',
    data_cadastro: new Date().toISOString(),
    image_url: '',
    efeito: 'Coagulação térmica'
  },
  {
    id: 'laser-diodo',
    nome: 'Laser Diodo',
    categoria: 'estetico' as const,
    ativo: true,
    tecnologia: 'Laser Diodo 808nm',
    beneficios: 'Depilação definitiva',
    diferenciais: 'Eficácia em todos os fototipos',
    indicacoes: 'Pelos indesejados',
    linguagem: 'pt',
    data_cadastro: new Date().toISOString(),
    image_url: '',
    efeito: 'Destruição do folículo piloso'
  }
];
