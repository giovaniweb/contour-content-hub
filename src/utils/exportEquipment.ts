import { Equipment } from '@/types/equipment';

/**
 * Export equipments to CSV format
 */
export const exportToCSV = (equipments: Equipment[], filename: string = 'equipamentos') => {
  if (!equipments || equipments.length === 0) {
    throw new Error('Nenhum equipamento para exportar');
  }

  // CSV Headers
  const headers = [
    'ID',
    'Nome',
    'Categoria',
    'Ativo',
    'Tecnologia',
    'Benefícios',
    'Diferenciais',
    'Indicações',
    'Efeito',
    'URL da Imagem'
  ];

  // Convert data to CSV rows
  const rows = equipments.map(eq => [
    eq.id,
    eq.nome,
    eq.categoria,
    eq.ativo ? 'Sim' : 'Não',
    eq.tecnologia || '',
    eq.beneficios || '',
    eq.diferenciais || '',
    Array.isArray(eq.indicacoes) ? eq.indicacoes.join('; ') : (eq.indicacoes || ''),
    eq.efeito || '',
    eq.image_url || ''
  ]);

  // Escape CSV values
  const escapeCsvValue = (value: string) => {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  };

  // Build CSV content
  const csvContent = [
    headers.map(escapeCsvValue).join(','),
    ...rows.map(row => row.map(cell => escapeCsvValue(String(cell))).join(','))
  ].join('\n');

  // Create and download file
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};

/**
 * Export equipments to JSON format
 */
export const exportToJSON = (equipments: Equipment[], filename: string = 'equipamentos') => {
  if (!equipments || equipments.length === 0) {
    throw new Error('Nenhum equipamento para exportar');
  }

  const jsonContent = JSON.stringify(equipments, null, 2);
  
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.json`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};
