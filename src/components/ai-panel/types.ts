
export interface VersionHistory {
  id: string;
  prompt: string;
  timestamp: string;
  user: string;
  tag?: "Tested" | "Beta" | "Live";
}

export interface AIModule {
  id: string;
  name: string;
  description: string;
  prompt: string;
  status: "Active" | "Inactive";
  lastModified: string;
  tag?: "Tested" | "Beta" | "Live";
  versionHistory: VersionHistory[];
}
