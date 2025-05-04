
import { Equipment, EquipmentCreationProps } from "@/types/equipment";

// Function to get all equipment
export async function getEquipments(): Promise<Equipment[]> {
  // Simulating an API call with a wait time
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Array of simulated equipment
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

// Function to get equipment by ID
export async function getEquipmentById(id: string): Promise<Equipment | null> {
  // Simulating an API call with a wait time
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const allEquipments = await getEquipments();
  return allEquipments.find(equip => equip.id === id) || null;
}

// Create equipment function
export async function createEquipment(equipmentData: Omit<Equipment, "id">): Promise<Equipment> {
  // Simulating an API call with a wait time
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Generate a new ID for the equipment
  const newEquipment: Equipment = {
    ...equipmentData,
    id: Math.random().toString(36).substring(2, 11),
    data_cadastro: new Date().toISOString()
  };
  
  console.log("Equipment created:", newEquipment);
  return newEquipment;
}

// Update equipment function
export async function updateEquipment(equipment: Equipment): Promise<Equipment> {
  // Simulating an API call with a wait time
  await new Promise(resolve => setTimeout(resolve, 700));
  
  console.log("Equipment updated:", equipment);
  return equipment;
}

// Delete equipment function
export async function deleteEquipment(id: string): Promise<boolean> {
  // Simulating an API call with a wait time
  await new Promise(resolve => setTimeout(resolve, 500));
  
  console.log("Equipment deleted:", id);
  return true;
}

// Import equipment function
export async function importEquipments(equipmentsData: any[]): Promise<Equipment[]> {
  // Simulating an API call with a wait time
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Process and convert imported data
  const importedEquipments = equipmentsData.map((data, index) => ({
    id: `imported-${Date.now()}-${index}`,
    nome: data.name || data.nome || 'Equipamento sem nome',
    efeito: data.effect || data.efeito || '',
    beneficios: data.benefits || data.beneficios || '',
    tecnologia: data.technology || data.tecnologia || '',
    fabricante: data.manufacturer || data.fabricante || '',
    site: data.website || data.site || '',
    ativo: true,
    categoria: data.category || data.categoria || '',
    modelo: data.model || data.modelo || '',
    pais_origem: data.country || data.pais_origem || '',
    reg_anvisa: data.anvisa || data.reg_anvisa || '',
    classificacao: data.classification || data.classificacao || '',
    ano_lancamento: data.year || data.ano_lancamento || '',
    garantia: data.warranty || data.garantia || '',
    parametros: data.parameters || data.parametros || '',
    protocolos: data.protocols || data.protocolos || '',
    indicacoes: Array.isArray(data.indications || data.indicacoes) 
      ? data.indications || data.indicacoes 
      : [data.indications || data.indicacoes || ''],
    contraindicacoes: Array.isArray(data.contraindications || data.contraindicacoes) 
      ? data.contraindications || data.contraindicacoes 
      : [data.contraindications || data.contraindicacoes || ''],
    caracteristicas: Array.isArray(data.features || data.caracteristicas) 
      ? data.features || data.caracteristicas 
      : [data.features || data.caracteristicas || ''],
    beneficios_lista: Array.isArray(data.benefits_list || data.beneficios_lista) 
      ? data.benefits_list || data.beneficios_lista 
      : [data.benefits_list || data.beneficios_lista || ''],
    areas_corpo: Array.isArray(data.body_areas || data.areas_corpo) 
      ? data.body_areas || data.areas_corpo 
      : [data.body_areas || data.areas_corpo || ''],
    image_url: data.image || data.image_url || '',
    data_cadastro: new Date().toISOString(),
    diferenciais: data.differentials || data.diferenciais || '',
    linguagem: data.language || data.linguagem || 'Técnico-comercial'
  } as Equipment));
  
  console.log("Equipments imported:", importedEquipments.length);
  return importedEquipments;
}

// Additional helper functions
export async function fetchEquipmentFiles(equipmentId: string): Promise<any[]> {
  // Simulating an API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return simulated files for the equipment
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
  // Simulating an API call
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // Return simulated videos for the equipment
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
