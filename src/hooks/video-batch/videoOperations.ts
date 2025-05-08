
/**
 * This file re-exports all video operations to maintain backward compatibility
 */
export { 
  loadVideosData,
  saveVideoData, 
  deleteVideoData
} from './basicVideoOperations';

export {
  updateEquipmentAssociation,
  batchUpdateEquipment
} from './equipmentOperations';
