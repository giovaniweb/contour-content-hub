
export interface CalendarPreferences {
  defaultView: "day" | "week" | "month" | "agenda";
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
  timeZone?: string;
  theme?: string;
}
