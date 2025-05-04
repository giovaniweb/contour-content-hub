
export interface CalendarSuggestion {
  id: string;
  date: string;
  title: string;
  description: string;
  format: "video" | "story" | "image";
  completed: boolean;
  equipment: string;
  purpose?: string;
  hook?: string;
  caption?: string;
}

export interface CalendarPreferences {
  frequency: "daily" | "weekly" | "custom";
  topics: string[];
  equipment: string[];
  autoGenerate: boolean;
  formats?: ("video" | "image" | "story")[];
  purpose?: string[];
}

export interface NewCalendarEvent {
  date: string;
  title: string;
  description: string;
  format: "video" | "story" | "image";
  completed: boolean;
  equipment: string;
}
