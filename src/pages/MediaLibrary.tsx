
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { getMediaItems, MediaItem } from "@/utils/api";
import MediaCard from "@/components/MediaCard";
import { useToast } from "@/hooks/use-toast";
import { Search, Video, Film, Camera, LoaderIcon } from "lucide-react";

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
  
  // Equipment, body area, and purpose options based on the updated database schema
  const equipmentOptions = [
    "Adélla Laser",
    "Enygma X-Orbital",
    "Focuskin",
    "Hipro",
    "Hive Pro",
    "Laser Crystal 3D Plus",
    "MultiShape",
    "Reverso",
    "Supreme Pro",
    "Ultralift - Endolaser",
    "Unyque PRO",
    "X-Tonus"
  ];
  
  const bodyAreaOptions = [
    "Face", 
    "Pescoço", 
    "Abdômen", 
    "Coxas", 
    "Glúteos", 
    "Braços",
    "Corpo todo"
  ];
  
  const purposeOptions = [
    "Rugas",
    "Emagrecimento", 
    "Tonificação", 
    "Hidratação", 
    "Flacidez",
    "Gordura localizada",
    "Lipedema",
    "Sarcopenia"
  ];
  
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
        item.bodyArea.some(area => area.toLowerCase().includes(searchLower)) ||
        item.purpose.some(purpose => purpose.toLowerCase().includes(searchLower))
      );
    }
    
    // Filter by equipment
    if (selectedEquipment) {
      filtered = filtered.filter(item => 
        item.equipment.includes(selectedEquipment)
      );
    }
    
    // Filter by body area
    if (selectedBodyArea) {
      filtered = filtered.filter(item => 
        item.bodyArea.includes(selectedBodyArea)
      );
    }
    
    // Filter by purpose
    if (selectedPurpose) {
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
  
  const getMediaTypeIcon = (type: string) => {
    switch (type) {
      case "video_pronto":
        return <Video className="h-4 w-4 mr-2" />;
      case "take":
        return <Film className="h-4 w-4 mr-2" />;
      case "image":
        return <Camera className="h-4 w-4 mr-2" />;
      default:
        return null;
    }
  };
  
  return (
    <Layout title="Media Library">
      <div className="grid gap-6">
        {/* Filters */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search media..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <Button 
              variant="outline" 
              onClick={handleReset}
              className="w-full sm:w-auto"
            >
              Reset Filters
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Select value={selectedEquipment} onValueChange={setSelectedEquipment}>
                <SelectTrigger>
                  <SelectValue placeholder="Equipment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Equipment</SelectItem>
                  {equipmentOptions.map((equipment) => (
                    <SelectItem key={equipment} value={equipment}>
                      {equipment}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Select value={selectedBodyArea} onValueChange={setSelectedBodyArea}>
                <SelectTrigger>
                  <SelectValue placeholder="Body Area" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Body Areas</SelectItem>
                  {bodyAreaOptions.map((area) => (
                    <SelectItem key={area} value={area}>
                      {area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Select value={selectedPurpose} onValueChange={setSelectedPurpose}>
                <SelectTrigger>
                  <SelectValue placeholder="Purpose" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Purposes</SelectItem>
                  {purposeOptions.map((purpose) => (
                    <SelectItem key={purpose} value={purpose}>
                      {purpose}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {/* Media type tabs */}
        <Tabs value={mediaType} onValueChange={setMediaType}>
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="video_pronto" className="flex items-center">
              <Video className="h-4 w-4 mr-1.5" />
              <span className="hidden sm:inline">Vídeos Prontos</span>
              <span className="sm:hidden">Vídeos</span>
            </TabsTrigger>
            <TabsTrigger value="take" className="flex items-center">
              <Film className="h-4 w-4 mr-1.5" />
              <span className="hidden sm:inline">Takes Brutos</span>
              <span className="sm:hidden">Takes</span>
            </TabsTrigger>
            <TabsTrigger value="image" className="flex items-center">
              <Camera className="h-4 w-4 mr-1.5" />
              <span className="hidden sm:inline">Images</span>
              <span className="sm:hidden">Images</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value={mediaType} className="mt-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center">
                  <LoaderIcon className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Loading media...</p>
                </div>
              </div>
            ) : filteredItems.length > 0 ? (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    {mediaType !== "all" && getMediaTypeIcon(mediaType)}
                    <span>
                      {mediaType === "all" ? "Todos os itens" : 
                       mediaType === "video_pronto" ? "Vídeos Prontos" :
                       mediaType === "take" ? "Takes Brutos" : "Imagens"}
                    </span>
                  </h3>
                  <Badge variant="outline">{filteredItems.length} items</Badge>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredItems.map((item) => (
                    <MediaCard 
                      key={item.id} 
                      media={item}
                      onUpdate={handleMediaUpdate}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center">
                  <Search className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No media found</p>
                  <Button 
                    variant="outline" 
                    onClick={handleReset}
                    className="mt-4"
                  >
                    Reset Filters
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default MediaLibrary;
