
export interface CalendarPreferences {
  defaultView: "day" | "week" | "month";
  firstDayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  showWeekends: boolean;
  autoGenerate: boolean;
  workingHours: {
    start: string;
    end: string;
  };
  notifications: {
    email: boolean;
    push: boolean;
    desktop: boolean;
  };
}

export interface CalendarSuggestion {
  id: string;
  title: string;
  date: Date;
  type: string;
  priority: "low" | "medium" | "high";
  description?: string;
  tags?: string[];
}
