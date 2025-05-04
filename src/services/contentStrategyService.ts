
// Re-exportamos todas as funcionalidades dos arquivos específicos
// para manter a compatibilidade com o código existente

export {
  fetchContentStrategyItems,
  createContentStrategyItem,
  updateContentStrategyItem,
  deleteContentStrategyItem
} from './contentStrategyCore';

export {
  generateContentWithAI,
  scheduleContentInCalendar
} from './contentStrategyIntegrations';
