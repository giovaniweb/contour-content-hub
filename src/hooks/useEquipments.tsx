
import { useState, useEffect } from "react";

// Exportando o tipo Equipment para uso em outros componentes
export interface Equipment {
  id: string;
  nome: string;
}

export const useEquipments = () => {
  const [equipments, setEquipments] = useState<Equipment[]>([
    { id: 'eq1', nome: 'Equipamento X' },
    { id: 'eq2', nome: 'Equipamento Y' },
    { id: 'eq3', nome: 'Equipamento Z' },
  ]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  return { equipments, loading, error };
};
