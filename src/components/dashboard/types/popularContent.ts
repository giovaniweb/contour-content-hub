
export interface PopularItem {
  id: string;
  title: string;
  type: string;
  imageUrl: string;
  views: number;
  likes: number;
  comments: number;
  isHot?: boolean;
  rating?: number;
  date?: string;
  equipment?: string[];
  purpose?: string[];
  videoUrl?: string;
}

