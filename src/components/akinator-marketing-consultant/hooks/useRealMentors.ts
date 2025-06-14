
import { useState, useEffect } from 'react';
import { listarMentores, Mentor } from '@/services/mentoresService';
import { MarketingConsultantState } from '../types';
import {
  inferBestMentor,
  generateMentorEnigma,
  MentorMapping
} from '../dashboard/mentors/mentorInference';

export const useRealMentors = () => {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const realMentors = await listarMentores();
        setMentors(realMentors);
      } catch (error) {
        console.error('Erro ao carregar mentores:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMentors();
  }, []);

  // agora para inferir o melhor mentor, basta chamar:
  // inferBestMentor(mentors, state)
  // e para o enigma: generateMentorEnigma(mentorMapping)

  return {
    mentors,
    loading,
    inferBestMentor: (state: MarketingConsultantState) => inferBestMentor(mentors, state),
    generateMentorEnigma
  };
};
