
export interface CalendarPreferences {
  defaultView: 'day' | 'week' | 'month';
  firstDayOfWeek: number; // 0 for Sunday, 1 for Monday
  showWeekends: boolean;
  autoScheduleSuggestions: boolean;
  reminderTime: '30m' | '1h' | '3h' | '1d';
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
