
import { useState, useEffect } from "react";

// Exportando o tipo Equipment para uso em outros componentes
export interface Equipment {
  id: string;
  nome: string;
  tecnologia?: string;
  beneficios?: string;
  diferenciais?: string;
  linguagem?: string;
  ativo?: boolean;
  image_url?: string;
}

export const useEquipments = () => {
  const [equipments, setEquipments] = useState<Equipment[]>([
    { 
      id: 'eq1', 
      nome: 'Equipamento X',
      tecnologia: 'Tecnologia avançada',
      beneficios: 'Resultados rápidos, Sem dor, Não invasivo',
      diferenciais: 'Único no mercado com tecnologia dupla',
      linguagem: 'técnica'
    },
    { 
      id: 'eq2', 
      nome: 'Equipamento Y',
      tecnologia: 'Laser de última geração',
      beneficios: 'Tratamento eficaz, Recuperação rápida',
      diferenciais: 'Máxima potência com segurança',
      linguagem: 'acessível'
    },
    { 
      id: 'eq3', 
      nome: 'Equipamento Z',
      tecnologia: 'Ultrassom focalizado',
      beneficios: 'Resultados permanentes, Sem tempo de inatividade',
      diferenciais: 'Tratamento personalizado',
      linguagem: 'comercial'
    },
  ]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  return { equipments, loading, error };
};
