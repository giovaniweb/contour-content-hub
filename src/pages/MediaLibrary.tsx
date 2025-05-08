
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ListFilter, LayoutGrid, List } from "lucide-react";
import MediaTrendingSection from "@/components/media-library/MediaTrendingSection";
import MediaGallery from "@/components/media-library/MediaGallery";
import MediaTypeTabs from "@/components/media-library/MediaTypeTabs";
import { useToast } from "@/hooks/use-toast";
import { MediaItem, mockMediaItems } from "@/components/media-library/mockData";
import DownloadIdeasModal from "@/components/media-library/DownloadIdeasModal";

const MediaLibrary: React.FC = () => {
  // State
  const [mediaType, setMediaType] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredItems, setFilteredItems] = useState<MediaItem[]>(mockMediaItems);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [downloadItem, setDownloadItem] = useState<MediaItem | null>(null);
  const [showIdeasModal, setShowIdeasModal] = useState<boolean>(false);
  const { toast } = useToast();
  
  // Filter media items when type or search changes
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      const filtered = mockMediaItems.filter(item => {
        // Type filter
        const matchesType = mediaType === "all" || item.type === mediaType;
        
        // Search filter
        const matchesSearch = 
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.equipment.some(e => e.toLowerCase().includes(searchQuery.toLowerCase())) ||
          item.purpose.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()));
        
        return matchesType && matchesSearch;
      });
      
      setFilteredItems(filtered);
      setIsLoading(false);
    }, 500); // Simulate loading delay
  }, [mediaType, searchQuery]);
  
  // Reset filters
  const handleReset = () => {
    setSearchQuery("");
    setMediaType("all");
  };
  
  // Handle media download
  const handleDownload = (item: MediaItem) => {
    setDownloadItem(item);
    setShowIdeasModal(true);
    
    toast({
      title: "Download started",
      description: `${item.title} is being downloaded.`,
    });
  };
  
  // Handle closing the ideas modal
  const handleCloseIdeasModal = () => {
    setShowIdeasModal(false);
    setDownloadItem(null);
  };
  
  // Handle media update
  const handleMediaUpdate = () => {
    // Refresh the media items
    const updatedItems = [...filteredItems];
    setFilteredItems(updatedItems);
  };
  
  return (
    <Layout title="Media Library">
      <div className="container mx-auto py-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl mb-6">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
            Media Library
          </h1>
          <p className="text-muted-foreground text-lg mt-1">
            Browse, download, and get AI-generated ideas for your content
          </p>
        </div>
        
        {/* Trending Sections */}
        <div className="mb-8 space-y-8">
          <MediaTrendingSection 
            title="Trending Videos" 
            type="video" 
            items={mockMediaItems.filter(item => item.type === "video").slice(0, 4)}
            onDownload={handleDownload}
          />
          
          <MediaTrendingSection 
            title="Trending Photos" 
            type="image" 
            items={mockMediaItems.filter(item => item.type === "arte").slice(0, 4)}
            onDownload={handleDownload}
          />
          
          <MediaTrendingSection 
            title="Top Downloads" 
            type="file" 
            items={mockMediaItems.filter(item => ["documentacao", "artigo"].includes(item.type)).slice(0, 4)}
            onDownload={handleDownload}
          />
        </div>
        
        {/* Filtering and Search */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-4">
            <h2 className="text-2xl font-semibold">Browse All Media</h2>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setViewMode("grid")}
                className={viewMode === "grid" ? "bg-muted" : ""}
              >
                <LayoutGrid className="h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setViewMode("list")}
                className={viewMode === "list" ? "bg-muted" : ""}
              >
                <List className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search media by title, equipment, purpose..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="w-full md:w-auto" 
                onClick={handleReset}
              >
                Reset
              </Button>
              <Button className="w-full md:w-auto flex items-center gap-2">
                <ListFilter className="h-4 w-4" />
                <span>Filters</span>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Media Type Tabs */}
        <MediaTypeTabs mediaType={mediaType} setMediaType={setMediaType} />
        
        {/* Media Gallery */}
        <MediaGallery 
          mediaType={mediaType}
          filteredItems={filteredItems}
          isLoading={isLoading}
          viewMode={viewMode}
          handleReset={handleReset}
          handleMediaUpdate={handleMediaUpdate}
          onDownload={handleDownload}
        />
      </div>
      
      {/* Download Ideas Modal */}
      {downloadItem && (
        <DownloadIdeasModal
          item={downloadItem}
          open={showIdeasModal}
          onOpenChange={setShowIdeasModal}
          onClose={handleCloseIdeasModal}
        />
      )}
    </Layout>
  );
};

export default MediaLibrary;
