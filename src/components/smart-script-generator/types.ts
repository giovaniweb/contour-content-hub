
export interface ScriptGenerationData {
  contentType: 'bigIdea' | 'stories' | 'carousel' | 'image' | 'video';
  objective: string;
  channel: string;
  style: string;
  theme: string;
  additionalNotes: string;
  selectedMentor: string;
}

export interface MentorProfile {
  name: string;
  focus: string;
  style: string;
}

export interface GeneratedContent {
  type: 'bigIdea' | 'stories' | 'carousel' | 'image' | 'video';
  content: string;
  mentor: string;
  suggestions?: {
    generateImage?: boolean;
    generateVoice?: boolean;
    relatedVideos?: string[];
  };
}
