
import { ContentObjective, ContentFormat, ContentCategory, ContentDistribution } from "@/types/content-strategy";
import { MarketingObjectiveType, ScriptResponse } from "@/types/script";
import { CalendarSuggestion } from "@/types/calendar";

export type ContentPlannerStatus = 
  | "idea" 
  | "script_generated" 
  | "approved" 
  | "scheduled" 
  | "published";

export interface ContentPlannerItem {
  id: string;
  title: string;
  description?: string;
  status: ContentPlannerStatus;
  tags: string[];
  scriptId?: string;
  script?: ScriptResponse;
  format: ContentFormat;
  objective: ContentObjective | MarketingObjectiveType;
  distribution: ContentDistribution;
  equipmentId?: string;
  equipmentName?: string;
  responsibleId?: string;
  responsibleName?: string;
  scheduledDate?: string;
  calendarEventId?: string;
  aiGenerated: boolean;
  createdAt: string;
  updatedAt: string;
  createdById: string;
}

export interface ContentPlannerFilter {
  status?: ContentPlannerStatus | ContentPlannerStatus[];
  objective?: ContentObjective | MarketingObjectiveType;
  distribution?: ContentDistribution;
  format?: ContentFormat;
  equipmentId?: string;
  responsibleId?: string;
  dateRange?: {
    from?: Date;
    to?: Date;
  };
}

export interface ContentPlannerColumn {
  id: ContentPlannerStatus;
  title: string;
  icon: string;
  items: ContentPlannerItem[];
}
