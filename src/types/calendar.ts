
export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  resourceId?: string;
  color?: string;
  location?: string;
  description?: string;
  status?: 'confirmed' | 'tentative' | 'cancelled';
  type?: string;
}

export interface CalendarResource {
  id: string;
  title: string;
  color?: string;
  subResources?: CalendarResource[];
}

export interface CalendarPreferences {
  defaultView: 'day' | 'week' | 'month' | 'agenda';
  firstDayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  workingHours: {
    start: string;
    end: string;
  };
  timeZone: string;
  showWeekends: boolean;
  autoGenerate: boolean;
  theme: 'light' | 'dark' | 'system';
  notifications: {
    email: boolean;
    push: boolean;
    desktop: boolean;
  };
}

export interface CalendarSettings {
  preferences: CalendarPreferences;
  resources: CalendarResource[];
}
