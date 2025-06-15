import React, { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { getMediaItems } from "@/lib/media";
import { MediaItem } from "@/components/media-library/mockData";
import FeatureBanner from "@/components/media-library/FeatureBanner";
import MediaTrendingSection from "@/components/media-library/MediaTrendingSection";
import MediaCreationSection from "@/components/media-library/MediaCreationSection";
import MediaCard from "@/components/media-library/MediaCard";
import DownloadIdeasModal from "@/components/media-library/DownloadIdeasModal";

const MediaLibrary: React.FC = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [showIdeasModal, setShowIdeasModal] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { toast } = useToast();

  // Fetch media items when component mounts or filters change
  React.useEffect(() => {
    const fetchMedia = async () => {
      setLoading(true);
      try {
        // Get media items and map them to the mockData MediaItem structure
        const items = await getMediaItems({
          type: activeTab === "all" ? undefined : activeTab,
          search: searchQuery || undefined,
        });
        
        // Convert the API MediaItem type to the mockData MediaItem type
        const convertedItems = items.map(item => ({
          id: item.id,
          title: item.title,
          description: item.description || '',
          type: item.type,
          thumbnailUrl: item.thumbnailUrl,
          videoUrl: item.videoUrl,
          isFavorite: item.isFavorite,
          rating: item.rating,
          equipment: item.equipment,
          purpose: item.purpose,
          duration: item.duration,
          viewCount: 0, // Add default values for missing properties
          downloadCount: 0,
          url: item.videoUrl || '',
          featured: false
        }));
        
        setMediaItems(convertedItems);
      } catch (error) {
        console.error("Failed to fetch media items:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load media content. Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, [activeTab, searchQuery, toast]);

  // Handle download and show ideas modal
  const handleDownloadAndShowIdeas = (item: MediaItem) => {
    setSelectedMedia(item);
    setShowIdeasModal(true);
  };

  // Mock data for trending sections
  const trendingVideos = mediaItems.filter(item => item.type === "video_pronto").slice(0, 4);
  const trendingImages = mediaItems.filter(item => item.type === "image").slice(0, 4);
  const trendingFiles = mediaItems.filter(item => item.type === "take").slice(0, 4);

  return (
    <AppLayout>
      <div className="container mx-auto py-6">
        {/* Hero Section */}
        <FeatureBanner />

        {/* Trending Sections */}
        <div className="space-y-10 mt-10">
          <MediaTrendingSection 
            title="Trending Videos" 
            type="video" 
            items={trendingVideos}
            onDownload={handleDownloadAndShowIdeas}
          />

          <MediaTrendingSection 
            title="Popular Images" 
            type="image" 
            items={trendingImages}
            onDownload={handleDownloadAndShowIdeas}
          />

          <MediaTrendingSection 
            title="Top Documents" 
            type="file" 
            items={trendingFiles}
            onDownload={handleDownloadAndShowIdeas}
          />
        </div>

        {/* Media Creation Section */}
        <MediaCreationSection />

        {/* Media Library Main Content */}
        <div className="mt-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold">Media Library</h2>
              <p className="text-muted-foreground">Browse and download videos, images, and documents</p>
            </div>
            
            <div className="flex items-center gap-2 mt-4 md:mt-0">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              >
                {viewMode === "grid" ? "List View" : "Grid View"}
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search media..." 
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex gap-4">
                <Select defaultValue="recent">
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button variant="outline" size="icon">
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-4 sm:grid-cols-5 md:w-fit">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="video_pronto">Videos</TabsTrigger>
                <TabsTrigger value="image">Images</TabsTrigger>
                <TabsTrigger value="take">Takes</TabsTrigger>
                <TabsTrigger value="document">Documents</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Media Content Grid */}
          <div className={viewMode === "grid" 
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" 
            : "space-y-4"
          }>
            {loading ? (
              // Skeleton loading
              Array.from({ length: 8 }).map((_, index) => (
                <Card key={index} className={`${viewMode === "list" ? "h-24" : "h-64"} animate-pulse bg-muted`}>
                  <CardContent className="p-0 h-full"></CardContent>
                </Card>
              ))
            ) : mediaItems.length > 0 ? (
              mediaItems.map((item) => (
                <div key={item.id} onClick={() => handleDownloadAndShowIdeas(item)}>
                  <MediaCard 
                    media={item} 
                    viewMode={viewMode}
                  />
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center">
                <p className="text-muted-foreground">No media items found. Try adjusting your search.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Ideas Modal */}
      <DownloadIdeasModal 
        open={showIdeasModal}
        onClose={() => setShowIdeasModal(false)}
        item={selectedMedia}
      />
    </AppLayout>
  );
};

export default MediaLibrary;
