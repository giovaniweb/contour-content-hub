
export function estimateAge(responses: Record<string, any>): number {
  if (responses.brasil_tricampeao === 'Sim') return 35; // 1994
  if (responses.brasil_penta === 'Sim') return 25; // 2002
  if (responses.tv_colosso === 'Sim') return 30; // Anos 90
  if (responses.xuxa === 'Sim') return 35; // Anos 80-90
  if (responses.orkut === 'Sim') return 28; // Anos 2000
  return 25;
}
