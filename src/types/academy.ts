export interface AcademyCourse {
  id: string;
  title: string;
  description?: string;
  equipment_id?: string;
  equipment_name?: string;
  difficulty_level?: 'beginner' | 'intermediate' | 'advanced';
  estimated_duration_hours?: number;
  thumbnail_url?: string;
  certificate_template_url?: string;
  gamification_points?: number;
  has_final_exam?: boolean;
  has_satisfaction_survey?: boolean;
  status?: 'active' | 'inactive' | 'draft';
  created_at?: string;
  updated_at?: string;
}

export interface AcademyAccessRequest {
  id: string;
  user_id: string;
  course_id: string;
  status: 'pending' | 'approved' | 'rejected';
  requested_at?: string;
  reviewed_at?: string;
  reviewed_by?: string;
  access_duration_days?: number;
  notes?: string;
  // Joined data
  user_name?: string;
  user_email?: string;
  course_title?: string;
}

export interface AcademyUserAccess {
  id: string;
  user_id: string;
  course_id: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'expired';
  progress_percentage?: number;
  started_at?: string;
  completed_at?: string;
  access_expires_at?: string;
  exam_status?: 'not_taken' | 'passed' | 'failed';
  survey_completed?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AcademyStats {
  totalCourses: number;
  activeStudents: number;
  pendingRequests: number;
  certificatesIssued: number;
}

export interface CourseFormData {
  title: string;
  description: string;
  equipment_id: string;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  estimated_duration_hours: number;
  gamification_points: number;
  has_final_exam: boolean;
  has_satisfaction_survey: boolean;
}

// Academy Invites
export interface AcademyInvite {
  id: string;
  email: string;
  first_name: string;
  course_ids: string[];
  invited_by: string;
  invite_token: string;
  expires_at: string;
  status: 'pending' | 'accepted' | 'expired' | 'cancelled';
  accepted_at?: string;
  created_at: string;
  updated_at: string;
}

export interface InviteFormData {
  email: string;
  first_name: string;
  course_ids: string[];
  expires_hours?: number;
}

// Email Templates
export interface AcademyEmailTemplate {
  id: string;
  template_type: 'welcome' | 'content_released' | 'invite' | 'certificate';
  subject: string;
  html_content: string;
  text_content?: string;
  variables: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}