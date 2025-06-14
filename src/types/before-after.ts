
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
}

export interface BeforeAfterUploadData {
  title: string;
  description?: string;
  equipment_used: string[];
  procedure_date?: string;
  is_public: boolean;
  approved_script_id?: string;
}
