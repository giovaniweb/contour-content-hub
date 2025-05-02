
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { getMediaItems, MediaItem } from "@/utils/api";
import { useToast } from "@/hooks/use-toast";
import MediaActionCards from "@/components/media-library/MediaActionCards";
import MediaCreationSection from "@/components/media-library/MediaCreationSection";
import MediaFilters from "@/components/media-library/MediaFilters";
import MediaTypeTabs from "@/components/media-library/MediaTypeTabs";
import MediaGallery from "@/components/media-library/MediaGallery";
import MediaAnalytics from "@/components/media-library/MediaAnalytics";
import { Tabs, TabsContent } from "@/components/ui/tabs";

const MediaLibrary: React.FC = () => {
  const { toast } = useToast();
  
  // Filter states
  const [mediaType, setMediaType] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [selectedEquipment, setSelectedEquipment] = useState<string>("");
  const [selectedBodyArea, setSelectedBodyArea] = useState<string>("");
  const [selectedPurpose, setSelectedPurpose] = useState<string>("");
  
  // Media data
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch media items on component mount
  useEffect(() => {
    fetchMediaItems();
  }, []);
  
  // Apply filters when filter states change
  useEffect(() => {
    applyFilters();
  }, [mediaType, search, selectedEquipment, selectedBodyArea, selectedPurpose, mediaItems]);
  
  const fetchMediaItems = async () => {
    try {
      setIsLoading(true);
      const items = await getMediaItems();
      setMediaItems(items);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to load media",
        description: "Could not load media library items",
      });
      console.error("Failed to fetch media items:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const applyFilters = () => {
    let filtered = [...mediaItems];
    
    // Filter by type
    if (mediaType !== "all") {
      filtered = filtered.filter(item => item.type === mediaType);
    }
    
    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchLower) ||
        item.equipment.some(eq => eq.toLowerCase().includes(searchLower)) ||
        (item.description && item.description.toLowerCase().includes(searchLower))
      );
    }
    
    // Filter by equipment
    if (selectedEquipment && selectedEquipment !== "none") {
      filtered = filtered.filter(item => 
        item.equipment.includes(selectedEquipment)
      );
    }
    
    // Filter by body area
    if (selectedBodyArea && selectedBodyArea !== "none") {
      filtered = filtered.filter(item => 
        item.bodyArea.includes(selectedBodyArea)
      );
    }
    
    // Filter by purpose
    if (selectedPurpose && selectedPurpose !== "none") {
      filtered = filtered.filter(item => 
        item.purpose.includes(selectedPurpose)
      );
    }
    
    setFilteredItems(filtered);
  };
  
  const handleReset = () => {
    setMediaType("all");
    setSearch("");
    setSelectedEquipment("");
    setSelectedBodyArea("");
    setSelectedPurpose("");
  };
  
  const handleMediaUpdate = () => {
    fetchMediaItems();
  };

  return (
    <Layout title="Media Library">
      <div className="space-y-8">
        {/* Action cards at the top */}
        <MediaActionCards />
        
        {/* "O que quer criar hoje" section */}
        <MediaCreationSection />

        {/* Filters */}
        <MediaFilters 
          search={search}
          setSearch={setSearch}
          selectedEquipment={selectedEquipment}
          setSelectedEquipment={setSelectedEquipment}
          selectedBodyArea={selectedBodyArea}
          setSelectedBodyArea={setSelectedBodyArea}
          selectedPurpose={selectedPurpose}
          setSelectedPurpose={setSelectedPurpose}
          handleReset={handleReset}
        />
        
        {/* Media type tabs and gallery */}
        <Tabs value={mediaType} onValueChange={setMediaType} className="w-full">
          <MediaTypeTabs 
            mediaType={mediaType} 
            setMediaType={setMediaType} 
          />
          
          <TabsContent value="all">
            <MediaGallery 
              mediaType="all"
              filteredItems={filteredItems}
              isLoading={isLoading}
              handleReset={handleReset}
              handleMediaUpdate={handleMediaUpdate}
            />
          </TabsContent>
          
          <TabsContent value="video">
            <MediaGallery 
              mediaType="video"
              filteredItems={filteredItems}
              isLoading={isLoading}
              handleReset={handleReset}
              handleMediaUpdate={handleMediaUpdate}
            />
          </TabsContent>
          
          <TabsContent value="arte">
            <MediaGallery 
              mediaType="arte"
              filteredItems={filteredItems}
              isLoading={isLoading}
              handleReset={handleReset}
              handleMediaUpdate={handleMediaUpdate}
            />
          </TabsContent>
          
          <TabsContent value="artigo">
            <MediaGallery 
              mediaType="artigo"
              filteredItems={filteredItems}
              isLoading={isLoading}
              handleReset={handleReset}
              handleMediaUpdate={handleMediaUpdate}
            />
          </TabsContent>
          
          <TabsContent value="documentacao">
            <MediaGallery 
              mediaType="documentacao"
              filteredItems={filteredItems}
              isLoading={isLoading}
              handleReset={handleReset}
              handleMediaUpdate={handleMediaUpdate}
            />
          </TabsContent>
        </Tabs>

        {/* Analytics/Statistics Section */}
        <MediaAnalytics />
      </div>
    </Layout>
  );
};

export default MediaLibrary;
