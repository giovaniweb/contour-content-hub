
import { Equipment } from "@/types/equipment";

// Função para obter todos os equipamentos
export async function getEquipments(): Promise<Equipment[]> {
  // Simulando uma chamada de API com um tempo de espera
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Array de equipamentos simulados
  return [
    {
      id: "1",
      nome: "Adella Laser",
      efeito: "Rejuvenescimento facial",
      beneficios: "Melhora da textura da pele e redução de linhas finas",
      tecnologia: "Laser fracionado",
      fabricante: "Adella Technology",
      site: "https://adella-tech.com",
      ativo: true,
      categoria: "Laser",
      modelo: "AL-2023",
      pais_origem: "Alemanha",
      reg_anvisa: "80123456789",
      classificacao: "Classe III",
      ano_lancamento: "2023",
      garantia: "2 anos",
      parametros: "Potência: 10-50W, Duração: 1-10ms",
      protocolos: "Facial, Corporal",
      indicacoes: ["Rugas", "Flacidez", "Manchas"],
      contraindicacoes: ["Gestantes", "Pele sensibilizada"],
      caracteristicas: ["Portátil", "Touch screen", "5 níveis de potência"],
      beneficios_lista: ["Resultados rápidos", "Sem tempo de inatividade", "Indolor"],
      areas_corpo: ["Face", "Pescoço", "Colo"],
      image_url: "https://picsum.photos/seed/adella/400/300",
      data_cadastro: "2023-05-10",
      diferenciais: "Tecnologia patenteada de pulso triplo",
      linguagem: "Técnico-comercial"
    },
    {
      id: "2",
      nome: "Hipro",
      efeito: "Ultracavitação e radiofrequência",
      beneficios: "Redução de gordura localizada e firmeza da pele",
      tecnologia: "Ultrassom de alta potência",
      fabricante: "MedTech Solutions",
      site: "https://medtech-solutions.com",
      ativo: true,
      categoria: "Ultrassom",
      modelo: "HP-2000",
      pais_origem: "Coreia do Sul",
      reg_anvisa: "80987654321",
      classificacao: "Classe II",
      ano_lancamento: "2022",
      garantia: "18 meses",
      parametros: "Frequência: 25-40kHz, Potência: 5-25W",
      protocolos: "Gordura localizada, Celulite, Flacidez",
      indicacoes: ["Gordura localizada", "Celulite", "Flacidez"],
      contraindicacoes: ["Gestantes", "Marca-passo"],
      caracteristicas: ["Tela LCD", "6 aplicadores", "Sistema de refrigeração"],
      beneficios_lista: ["Resultados em poucas sessões", "Não invasivo", "Sem dor"],
      areas_corpo: ["Abdômen", "Glúteos", "Coxas", "Braços"],
      image_url: "https://picsum.photos/seed/hipro/400/300",
      data_cadastro: "2022-11-15",
      diferenciais: "Combinação de 3 tecnologias em um único aparelho",
      linguagem: "Técnico-comercial"
    }
  ];
}

// Função para obter um equipamento pelo ID
export async function getEquipmentById(id: string): Promise<Equipment | null> {
  // Simulando uma chamada de API com um tempo de espera
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const allEquipments = await getEquipments();
  return allEquipments.find(equip => equip.id === id) || null;
}

// Funções adicionais para arquivos e vídeos relacionados a equipamentos
export async function fetchEquipmentFiles(equipmentId: string): Promise<any[]> {
  // Simulando uma chamada de API
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Retorna arquivos simulados para o equipamento
  return [
    {
      id: '1',
      fileName: 'Manual de operação.pdf',
      fileSize: '2.5MB',
      fileType: 'application/pdf',
      downloadUrl: '#',
      uploadDate: '2023-06-15'
    },
    {
      id: '2',
      fileName: 'Catálogo de especificações.pdf',
      fileSize: '1.8MB',
      fileType: 'application/pdf',
      downloadUrl: '#',
      uploadDate: '2023-06-10'
    }
  ];
}

export async function fetchEquipmentVideos(equipmentId: string): Promise<any[]> {
  // Simulando uma chamada de API
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // Retorna vídeos simulados para o equipamento
  return [
    {
      id: '1',
      title: 'Como utilizar - Tutorial',
      thumbnailUrl: 'https://picsum.photos/seed/video1/300/200',
      duration: '5:30',
      videoUrl: '#',
      uploadDate: '2023-05-20'
    },
    {
      id: '2',
      title: 'Resultados clínicos',
      thumbnailUrl: 'https://picsum.photos/seed/video2/300/200',
      duration: '3:45',
      videoUrl: '#',
      uploadDate: '2023-05-25'
    }
  ];
}
