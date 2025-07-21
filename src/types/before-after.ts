
export interface BeforeAfterPhoto {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  before_image_url: string;
  after_image_url: string;
  equipment_used: string[];
  procedure_date?: string;
  is_public: boolean;
  approved_script_id?: string;
  created_at: string;
  updated_at: string;
  // Campos do protocolo
  equipment_parameters?: {
    intensity?: string;
    frequency?: string;
    time?: string;
    other?: string;
  };
  treated_areas?: string[];
  treatment_objective?: string;
  associated_therapies?: string[];
  session_interval?: number;
  session_count?: number;
  session_notes?: string;
}

export interface BeforeAfterUploadData {
  title: string;
  description?: string;
  equipment_used: string[];
  procedure_date?: string;
  is_public: boolean;
  approved_script_id?: string;
  // Parâmetros do equipamento
  equipment_parameters?: {
    intensity?: string;
    frequency?: string;
    time?: string;
    other?: string;
  };
  // Protocolo completo
  treated_areas?: string[];
  treatment_objective?: string;
  associated_therapies?: string[];
  session_interval?: number; // em dias
  session_count?: number;
  session_notes?: string;
}
