
import { useState, useEffect } from 'react';
import { mentorTechniqueService } from '../services/mentorTechniqueService';
import { TecnicaMentor } from '../utils/techniqueSelector';

export const useMentorTechniques = (mentorName?: string) => {
  const [techniques, setTechniques] = useState<TecnicaMentor[]>([]);
  const [selectedTechnique, setSelectedTechnique] = useState<TecnicaMentor | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTechniques = async (mentor: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const mentorTechniques = await mentorTechniqueService.getMentorTechniques(mentor);
      setTechniques(mentorTechniques);
      
      if (mentorTechniques.length === 0) {
        console.warn(`⚠️ Nenhuma técnica encontrada para ${mentor}`);
      }
    } catch (err) {
      const errorMessage = `Erro ao carregar técnicas do mentor ${mentor}`;
      console.error(errorMessage, err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const selectTechnique = async (
    mentor: string,
    formato: string,
    objetivo: string
  ) => {
    try {
      const optimal = await mentorTechniqueService.selectOptimalTechnique(
        mentor,
        formato,
        objetivo
      );
      
      setSelectedTechnique(optimal);
      
      if (optimal) {
        console.log(`🎯 Técnica selecionada: ${optimal.nome} para ${formato}/${objetivo}`);
      }
      
      return optimal;
    } catch (err) {
      console.error('Erro ao selecionar técnica:', err);
      return null;
    }
  };

  const validateIntegration = async (mentor: string) => {
    try {
      const validation = await mentorTechniqueService.validateTechniqueIntegration(mentor);
      console.log('🔍 Validação de integração:', validation);
      return validation;
    } catch (err) {
      console.error('Erro na validação:', err);
      return null;
    }
  };

  useEffect(() => {
    if (mentorName) {
      loadTechniques(mentorName);
    }
  }, [mentorName]);

  return {
    techniques,
    selectedTechnique,
    loading,
    error,
    loadTechniques,
    selectTechnique,
    validateIntegration,
    clearSelection: () => setSelectedTechnique(null)
  };
};
