import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { FileText, Video, Image } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

interface LibraryStats {
  totalVideos: number;
  totalDocuments: number;
  totalPhotos: number;
}

const RealLibrarySummarySection: React.FC = () => {
  const { user } = useAuth();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['library-stats', user?.id],
    queryFn: async (): Promise<LibraryStats> => {
      if (!user?.id) return { totalVideos: 0, totalDocuments: 0, totalPhotos: 0 };

      const [videosResponse, documentsResponse, photosResponse] = await Promise.all([
        supabase.from('videos').select('id', { count: 'exact' }),
        supabase.from('unified_documents').select('id', { count: 'exact' }),
        supabase.from('before_after_photos').select('id', { count: 'exact' }).eq('user_id', user.id)
      ]);

      return {
        totalVideos: videosResponse.count || 0,
        totalDocuments: documentsResponse.count || 0,
        totalPhotos: photosResponse.count || 0,
      };
    },
    enabled: !!user?.id,
  });

  if (isLoading) {
    return (
      <Card className="aurora-glass-enhanced aurora-border-enhanced animate-pulse">
        <CardHeader>
          <div className="h-6 bg-white/20 rounded w-2/3"></div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="h-8 bg-white/10 rounded"></div>
          <div className="h-8 bg-white/10 rounded"></div>
          <div className="h-8 bg-white/10 rounded"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="aurora-glass-enhanced aurora-border-enhanced">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-green-400" />
          Biblioteca de Conteúdo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Link to="/videos" className="flex items-center gap-2 hover-scale px-2 py-2 rounded transition-all bg-gradient-to-r from-green-900/10 to-green-700/10">
          <Video className="w-5 h-5" />
          <div className="flex-1">
            <span>Vídeos</span>
            <span className="text-sm text-white/60 ml-2">({stats?.totalVideos || 0})</span>
          </div>
        </Link>
        <Link to="/scientific-articles" className="flex items-center gap-2 hover-scale px-2 py-2 rounded transition-all bg-gradient-to-r from-blue-900/10 to-blue-700/10">
          <FileText className="w-5 h-5" />
          <div className="flex-1">
            <span>Artigos Científicos</span>
            <span className="text-sm text-white/60 ml-2">({stats?.totalDocuments || 0})</span>
          </div>
        </Link>
        <Link to="/before-after" className="flex items-center gap-2 hover-scale px-2 py-2 rounded transition-all bg-gradient-to-r from-purple-900/10 to-purple-700/10">
          <Image className="w-5 h-5" />
          <div className="flex-1">
            <span>Antes e Depois</span>
            <span className="text-sm text-white/60 ml-2">({stats?.totalPhotos || 0})</span>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
};

export default RealLibrarySummarySection;