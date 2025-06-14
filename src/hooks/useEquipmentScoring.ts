
import { Equipment } from '@/types/equipment';

export function isValidEquipment(equipment: any): equipment is Equipment {
  if (!equipment || typeof equipment !== 'object') return false;
  return !!equipment.id && !!equipment.nome;
}

export function calculateEquipmentScore(
  equipment: Equipment,
  responses: Record<string, any>,
  estimateAge: (responses: Record<string, any>) => number
) {
  let score = 0;
  const scoreBreakdown: Record<string, number> = {};

  // Score logic simplificado para o exemplo. Adapte conforme quiser!
  const areaAplicacao = Array.isArray(equipment.area_aplicacao) ? equipment.area_aplicacao : [];
  if (responses.area_problema === 'Rosto' && areaAplicacao.includes('Facial')) {
    score += 20;
    scoreBreakdown['area_facial'] = 20;
  }
  if (responses.area_problema === 'Corpo' && areaAplicacao.includes('Corporal')) {
    score += 20;
    scoreBreakdown['area_corporal'] = 20;
  }
  // ... mais regras conforme o original ...

  return { score, scoreBreakdown };
}
