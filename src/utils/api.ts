// Mock API functions for script generation

// Different script types
export type ScriptType = 'videoScript' | 'bigIdea' | 'dailySales';

// Script request parameters
export interface ScriptRequest {
  type: ScriptType;
  topic: string;
  equipment?: string[];
  bodyArea?: string;
  purpose?: string;
  additionalInfo?: string;
  tone?: string;
  language?: string;
}

// Script response object
export interface ScriptResponse {
  id: string;
  title: string;
  content: string;
  type: ScriptType;
  createdAt: string;
  suggestedVideos?: MediaItem[];
  suggestedMusic?: {
    id: string;
    title: string;
    artist: string;
    url: string;
  }[];
  suggestedFonts?: {
    name: string;
    style: string;
  }[];
  captionTips?: string[];
}

// Sample script templates for each type
const scriptTemplates: Record<ScriptType, (req: ScriptRequest) => string> = {
  videoScript: (req) => 
    `# ${req.topic || "Treatment"} Video Script\n\n` +
    `## Intro (10 seconds)\n` +
    `"Welcome back to our channel! Today we're exploring ${req.topic || "an exciting treatment"} using ${req.equipment?.join(", ") || "our advanced equipment"}.\n\n` +
    `## Main Content (30 seconds)\n` +
    `This revolutionary approach targets ${req.bodyArea || "problem areas"} and provides ${req.purpose || "amazing results"}.\n\n` +
    `## Tips and Advice (15 seconds)\n` +
    `For best results, we recommend...\n\n` +
    `## Call to Action (5 seconds)\n` +
    `Book your consultation today!`,
  
  bigIdea: (req) => 
    `# Strategic Big Idea: ${req.topic || "Monthly Treatment Focus"}\n\n` +
    `## Core Concept\n` +
    `Position ${req.topic || "your treatment"} as the go-to solution for ${req.purpose || "client needs"}.\n\n` +
    `## Key Message Points\n` +
    `- Highlight the unique benefits\n` +
    `- Share before/after results\n` +
    `- Emphasize your clinic's expertise\n\n` +
    `## Content Strategy\n` +
    `Create a content series showing progressive results over time.`,
  
  dailySales: (req) => 
    `# Quick Sales Story for Social Media\n\n` +
    `"Did you know that our ${req.topic || "signature treatment"} can transform your ${req.bodyArea || "appearance"} in just one session?\n\n` +
    `We're offering a special promotion this week only!\n\n` +
    `Swipe up to learn more or DM us to book your appointment."`
};

// Generate a mock script based on the request
export const generateScript = async (request: ScriptRequest): Promise<ScriptResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Generate random ID
  const scriptId = `script-${Date.now()}`;
  
  // Get the appropriate template
  const templateFn = scriptTemplates[request.type];
  const content = templateFn(request);
  
  // Generate a title based on the script type
  let title = "";
  switch (request.type) {
    case "videoScript":
      title = `${request.topic || "Treatment"} Video Script`;
      break;
    case "bigIdea":
      title = `Strategic Campaign: ${request.topic || "Monthly Focus"}`;
      break;
    case "dailySales":
      title = `Quick Sale Story: ${request.topic || "Daily Promotion"}`;
      break;
  }
  
  // Mock response with suggested videos that match the MediaItem interface
  return {
    id: scriptId,
    content,
    title,
    type: request.type,
    createdAt: new Date().toISOString(),
    suggestedVideos: [
      {
        id: "video-1",
        title: "Before/After Results",
        thumbnailUrl: "/placeholder.svg",
        duration: "0:45",
        type: "video", // Added required properties
        equipment: ["UltraSonic"],
        bodyArea: ["Face"],
        purpose: ["Content creation"],
        rating: 4.5,
        isFavorite: false
      },
      {
        id: "video-2",
        title: "Treatment Process",
        thumbnailUrl: "/placeholder.svg",
        duration: "1:20",
        type: "video", // Added required properties
        equipment: ["Venus Freeze"],
        bodyArea: ["Abdomen", "Thighs"],
        purpose: ["Education"],
        rating: 4.7,
        isFavorite: false
      },
      {
        id: "video-3",
        title: "Client Testimonial",
        thumbnailUrl: "/placeholder.svg",
        duration: "0:30",
        type: "video", // Added required properties
        equipment: ["UltraSonic"],
        bodyArea: ["Face"],
        purpose: ["Testimonial"],
        rating: 5.0,
        isFavorite: false
      }
    ],
    suggestedMusic: [
      {
        id: "music-1",
        title: "Upbeat Corporate",
        artist: "Audio Library",
        url: "/music/upbeat-corporate.mp3"
      },
      {
        id: "music-2",
        title: "Gentle Ambient",
        artist: "Sound Collection",
        url: "/music/gentle-ambient.mp3"
      },
      {
        id: "music-3",
        title: "Inspirational",
        artist: "Music Library",
        url: "/music/inspirational.mp3"
      }
    ],
    suggestedFonts: [
      {
        name: "Helvetica Neue",
        style: "Sans-serif"
      },
      {
        name: "Montserrat",
        style: "Sans-serif"
      },
      {
        name: "Playfair Display",
        style: "Serif"
      }
    ],
    captionTips: [
      "Keep captions short and punchy",
      "Use emojis strategically",
      "Include a call to action"
    ]
  };
};

// Save feedback for a script
export const saveScriptFeedback = async (
  scriptId: string, 
  feedback: string, 
  approved: boolean
): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // In a real app, this would save to a database
  console.log(`Script ${scriptId} feedback saved:`, { feedback, approved });
};

// Generate PDF from script (mock function)
export const generatePDF = async (scriptId: string): Promise<string> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // In a real app, this would generate and return a PDF URL
  return `/api/pdf/${scriptId}`;
};

// Media library interfaces
export interface MediaItem {
  id: string;
  title: string;
  thumbnailUrl: string;
  videoUrl?: string;
  type: "video" | "raw" | "image";
  equipment: string[];
  bodyArea: string[];
  purpose: string[];
  duration?: string;
  rating: number;
  isFavorite: boolean;
}

// Get media items with filter
export const getMediaItems = async (filters?: {
  type?: string;
  equipment?: string[];
  bodyArea?: string[];
  purpose?: string[];
  query?: string;
}): Promise<MediaItem[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock media items
  const items: MediaItem[] = [
    {
      id: "media-1",
      title: "UltraSonic Face Treatment",
      thumbnailUrl: "/placeholder.svg",
      videoUrl: "#",
      type: "video",
      equipment: ["UltraSonic"],
      bodyArea: ["Face"],
      purpose: ["Anti-aging"],
      duration: "1:45",
      rating: 4.5,
      isFavorite: true
    },
    {
      id: "media-2",
      title: "Venus Freeze Body Treatment",
      thumbnailUrl: "/placeholder.svg",
      videoUrl: "#",
      type: "video",
      equipment: ["Venus Freeze"],
      bodyArea: ["Abdomen", "Thighs"],
      purpose: ["Slimming", "Toning"],
      duration: "2:10",
      rating: 5,
      isFavorite: false
    },
    {
      id: "media-3",
      title: "Raw Footage - Facial Treatment",
      thumbnailUrl: "/placeholder.svg",
      videoUrl: "#",
      type: "raw",
      equipment: ["UltraSonic"],
      bodyArea: ["Face"],
      purpose: ["Content creation"],
      duration: "5:30",
      rating: 4,
      isFavorite: true
    }
  ];
  
  // Apply filters if provided
  let filteredItems = [...items];
  
  if (filters) {
    if (filters.type) {
      filteredItems = filteredItems.filter(item => item.type === filters.type);
    }
    
    if (filters.equipment?.length) {
      filteredItems = filteredItems.filter(item => 
        filters.equipment!.some(e => item.equipment.includes(e))
      );
    }
    
    if (filters.bodyArea?.length) {
      filteredItems = filteredItems.filter(item => 
        filters.bodyArea!.some(b => item.bodyArea.includes(b))
      );
    }
    
    if (filters.purpose?.length) {
      filteredItems = filteredItems.filter(item => 
        filters.purpose!.some(p => item.purpose.includes(p))
      );
    }
    
    if (filters.query) {
      const query = filters.query.toLowerCase();
      filteredItems = filteredItems.filter(item => 
        item.title.toLowerCase().includes(query) ||
        item.equipment.some(e => e.toLowerCase().includes(query)) ||
        item.bodyArea.some(b => b.toLowerCase().includes(query)) ||
        item.purpose.some(p => p.toLowerCase().includes(query))
      );
    }
  }
  
  return filteredItems;
};

// Toggle favorite status
export const toggleFavorite = async (mediaId: string): Promise<boolean> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // In a real app, this would update the database
  return true;
};

// Rate a media item
export const rateMedia = async (mediaId: string, rating: number): Promise<boolean> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // In a real app, this would update the database
  return true;
};

// Calendar suggestion interface
export interface CalendarSuggestion {
  date: string;
  title: string;
  type: ScriptType;
  description: string;
  completed: boolean;
}

// Get calendar suggestions
export const getCalendarSuggestions = async (
  month: number,
  year: number,
  frequency: 1 | 2 | 3 = 2
): Promise<CalendarSuggestion[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const suggestions: CalendarSuggestion[] = [];
  
  // Calculate days to create content based on frequency
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const interval = Math.floor(daysInMonth / (frequency * 4)); // distribute across 4 weeks
  
  // Create suggestions for each selected day
  for (let i = 1; i <= frequency * 4; i++) {
    const day = i * interval;
    if (day <= daysInMonth) {
      // Alternate between different script types
      const scriptType: ScriptType = i % 3 === 0 ? "dailySales" : i % 2 === 0 ? "bigIdea" : "videoScript";
      
      // Create the suggestion
      suggestions.push({
        date: `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        title: scriptType === "videoScript" 
          ? "Create a treatment video" 
          : scriptType === "bigIdea" 
            ? "Develop a strategic campaign" 
            : "Share a quick promotion",
        type: scriptType,
        description: scriptType === "videoScript"
          ? "Showcase your expertise with an informative treatment video"
          : scriptType === "bigIdea"
            ? "Build brand authority with a strategic content series"
            : "Drive conversions with a time-sensitive offer",
        completed: false
      });
    }
  }
  
  return suggestions;
};

// Update calendar suggestion completion status
export const updateCalendarCompletion = async (
  date: string,
  completed: boolean
): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // In a real app, this would update the database
  console.log(`Calendar entry ${date} marked as ${completed ? 'completed' : 'not completed'}`);
};
