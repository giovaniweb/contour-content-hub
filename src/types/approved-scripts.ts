
export interface ApprovedScript {
  id: string;
  user_id: string;
  script_content: string;
  title: string;
  format: 'carrossel' | 'stories' | 'imagem' | 'reels';
  equipment_used: string[];
  approval_status: 'pending' | 'approved' | 'rejected';
  approval_notes?: string;
  approved_by?: string;
  approved_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ScriptPerformance {
  id: string;
  approved_script_id: string;
  performance_rating: 'bombou' | 'flopou' | 'neutro' | 'pending';
  metrics: {
    views?: number;
    likes?: number;
    comments?: number;
    shares?: number;
    saves?: number;
    reach?: number;
    impressions?: number;
    engagement_rate?: number;
    conversion_rate?: number;
  };
  feedback_notes?: string;
  evaluated_by?: string;
  evaluated_at?: string;
  created_at: string;
}

export interface ApprovedScriptWithPerformance extends ApprovedScript {
  performance?: ScriptPerformance;
}
