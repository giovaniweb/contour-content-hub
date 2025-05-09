
export type ContentPlannerStatus = 'idea' | 'script_generated' | 'approved' | 'scheduled' | 'published';

export type ContentFormat = 'vídeo' | 'story' | 'carrossel' | 'reels' | 'texto' | 'outro';

export type ContentDistribution = 'Instagram' | 'YouTube' | 'TikTok' | 'Blog' | 'Múltiplos' | 'Outro';

export interface ContentPlannerItem {
  id: string;
  title: string;
  description: string;
  status: ContentPlannerStatus;
  tags: string[];
  scriptId?: string;
  format: ContentFormat;
  objective: string;
  distribution: ContentDistribution;
  equipmentId?: string;
  equipmentName?: string;
  scheduledDate?: string;
  scheduledTime?: string;
  calendarEventId?: string;
  authorId: string;
  authorName?: string;
  createdAt: string;
  updatedAt: string;
  aiGenerated: boolean;
  createdById?: string;
  responsibleId?: string;
  responsibleName?: string;
}

export interface ContentPlannerColumn {
  id: ContentPlannerStatus;
  title: string;
  items: ContentPlannerItem[];
  icon: string;
}

export interface ContentPlannerFilter {
  objective?: string;
  format?: string;
  distribution?: string;
  equipmentId?: string;
  status?: ContentPlannerStatus;
  responsibleId?: string;
  dateRange?: {
    from?: Date;
    to?: Date;
  };
}

export interface ContentPlannerState {
  items: ContentPlannerItem[];
  loading: boolean;
  error: null | string;
  selectedItem: null | ContentPlannerItem;
  selectedDate: null | Date;
  view: string;
  filters: {
    status: string;
    type: string;
    search: string;
  };
  isModalOpen: boolean;
  modalType: null | string;
  modalData: null | any;
}
