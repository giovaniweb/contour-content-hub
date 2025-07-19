import { supabase } from '@/integrations/supabase/client';

export interface EquipmentPhoto {
  id: string;
  equipment_id: string;
  user_id: string;
  title: string;
  description?: string;
  image_url: string;
  thumbnail_url?: string;
  file_size?: number;
  likes_count: number;
  downloads_count: number;
  tags: string[];
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface EquipmentPhotoLike {
  id: string;
  photo_id: string;
  user_id: string;
  created_at: string;
}

export interface EquipmentPhotoDownload {
  id: string;
  photo_id: string;
  user_id: string;
  download_type: 'single' | 'zip';
  created_at: string;
}

// Get photos for equipment
export const getEquipmentPhotos = async (equipmentId: string): Promise<EquipmentPhoto[]> => {
  const { data, error } = await supabase
    .from('equipment_photos')
    .select('*')
    .eq('equipment_id', equipmentId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching equipment photos:', error);
    throw error;
  }

  return data || [];
};

// Check if user liked a photo
export const getUserPhotoLike = async (photoId: string): Promise<EquipmentPhotoLike | null> => {
  const { data: user } = await supabase.auth.getUser();
  if (!user?.user) return null;

  const { data, error } = await supabase
    .from('equipment_photo_likes')
    .select('*')
    .eq('photo_id', photoId)
    .eq('user_id', user.user.id)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error checking photo like:', error);
    throw error;
  }

  return data;
};

// Like a photo
export const likePhoto = async (photoId: string): Promise<void> => {
  const { data: user } = await supabase.auth.getUser();
  if (!user?.user) throw new Error('User not authenticated');

  const { error } = await supabase
    .from('equipment_photo_likes')
    .insert({ 
      photo_id: photoId,
      user_id: user.user.id 
    });

  if (error) {
    console.error('Error liking photo:', error);
    throw error;
  }
};

// Unlike a photo
export const unlikePhoto = async (photoId: string): Promise<void> => {
  const { error } = await supabase
    .from('equipment_photo_likes')
    .delete()
    .eq('photo_id', photoId)
    .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

  if (error) {
    console.error('Error unliking photo:', error);
    throw error;
  }
};

// Download a photo
export const downloadPhoto = async (photoId: string, downloadType: 'single' | 'zip' = 'single'): Promise<void> => {
  const { data: user } = await supabase.auth.getUser();
  if (!user?.user) throw new Error('User not authenticated');

  const { error } = await supabase
    .from('equipment_photo_downloads')
    .insert({ 
      photo_id: photoId, 
      download_type: downloadType,
      user_id: user.user.id
    });

  if (error) {
    console.error('Error recording photo download:', error);
    throw error;
  }
};

// Upload a new photo
export const uploadEquipmentPhoto = async (
  equipmentId: string,
  file: File,
  title: string,
  description?: string,
  tags: string[] = []
): Promise<EquipmentPhoto> => {
  const { data: user } = await supabase.auth.getUser();
  if (!user?.user) throw new Error('User not authenticated');

  // Upload file to storage (placeholder - would need actual file upload implementation)
  const fileUrl = URL.createObjectURL(file);
  
  const { data, error } = await supabase
    .from('equipment_photos')
    .insert({
      equipment_id: equipmentId,
      user_id: user.user.id,
      title,
      description,
      image_url: fileUrl,
      thumbnail_url: fileUrl,
      file_size: file.size,
      tags
    })
    .select()
    .single();

  if (error) {
    console.error('Error uploading equipment photo:', error);
    throw error;
  }

  return data;
};

// Delete a photo
export const deleteEquipmentPhoto = async (photoId: string): Promise<void> => {
  const { error } = await supabase
    .from('equipment_photos')
    .delete()
    .eq('id', photoId);

  if (error) {
    console.error('Error deleting equipment photo:', error);
    throw error;
  }
};