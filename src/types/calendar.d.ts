
export interface CalendarPreferences {
  defaultView: 'day' | 'week' | 'month';
  firstDayOfWeek: number; // 0 for Sunday, 1 for Monday
  showWeekends: boolean;
  autoGenerate?: boolean;
  workingHours?: {
    start: string;
    end: string;
  };
  theme?: string;
  timeZone?: string;
  notifications?: {
    email: boolean;
    push: boolean;
    desktop: boolean;
  };
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: Date | string;
  end: Date | string;
  allDay?: boolean;
  type: 'post' | 'story' | 'video' | 'reminder' | 'other';
  status: 'draft' | 'scheduled' | 'published' | 'cancelled';
}

export interface CalendarSuggestion {
  id: string;
  title: string;
  suggestedDate: Date;
  confidence: number; // 0-100
  type: 'post' | 'story' | 'video';
  reason: string;
}
