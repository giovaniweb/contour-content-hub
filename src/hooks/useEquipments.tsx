
import { useState, useEffect } from "react";
import type { Equipment } from '@/types/equipment'; // Import Equipment type with 'type' keyword

export type { Equipment }; // Re-export the type with 'type' keyword

export const useEquipments = () => {
  const [equipments, setEquipments] = useState<Equipment[]>([
    { 
      id: 'eq1', 
      nome: 'Equipamento X',
      descricao: 'Descrição do equipamento X',
      categoria: 'Categoria 1',
      tecnologia: 'Tecnologia avançada',
      beneficios: 'Resultados rápidos, Sem dor, Não invasivo',
      diferenciais: 'Único no mercado com tecnologia dupla',
      linguagem: 'técnica',
      indicacoes: ['Indicação 1', 'Indicação 2']
    },
    { 
      id: 'eq2', 
      nome: 'Equipamento Y',
      descricao: 'Descrição do equipamento Y',
      categoria: 'Categoria 2',
      tecnologia: 'Laser de última geração',
      beneficios: 'Tratamento eficaz, Recuperação rápida',
      diferenciais: 'Máxima potência com segurança',
      linguagem: 'acessível',
      indicacoes: ['Indicação 3', 'Indicação 4']
    },
    { 
      id: 'eq3', 
      nome: 'Equipamento Z',
      descricao: 'Descrição do equipamento Z',
      categoria: 'Categoria 3',
      tecnologia: 'Ultrassom focalizado',
      beneficios: 'Resultados permanentes, Sem tempo de inatividade',
      diferenciais: 'Tratamento personalizado',
      linguagem: 'comercial',
      indicacoes: ['Indicação 5', 'Indicação 6']
    },
  ]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  return { equipments, loading, error };
};
