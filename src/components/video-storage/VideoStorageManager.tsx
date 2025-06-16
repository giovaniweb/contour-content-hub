
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  RefreshCcw, 
  Filter, 
  Grid2x2, 
  LayoutList,
  Settings 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import VideoList from '@/components/video-storage/VideoList';
import VideoFilterDialog from '@/components/video-storage/VideoFilterDialog';
import { VideoStatus } from '@/types/video-storage';
import { getVideos } from '@/services/videoStorage/videoManagementService';

const VideoStorageManager: React.FC = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [statusFilters, setStatusFilters] = useState<VideoStatus[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(12);
  const [totalVideos, setTotalVideos] = useState(0);

  // Function to load videos with current filters
  const loadVideos = async () => {
    setIsLoading(true);
    try {
      const filters = {
        search: searchQuery,
        status: statusFilters.length > 0 ? statusFilters : undefined
      };
      
      const { videos, total, error } = await getVideos(
        filters, 
        { field: 'created_at', direction: 'desc' },
        page,
        pageSize
      );
      
      if (error) {
        throw new Error(error);
      }
      
      setTotalVideos(total);
      
      // Pass data to the VideoList component for rendering
      // This will be handled by VideoList itself
      
    } catch (error) {
      console.error('Failed to load videos:', error);
      toast({
        variant: "destructive",
        title: "Error loading videos",
        description: "There was a problem fetching the video data."
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load videos when filters, search or page changes
  useEffect(() => {
    loadVideos();
  }, [searchQuery, statusFilters, page]);

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1); // Reset to first page on new search
  };

  // Handle status filter change
  const handleFilterChange = (selectedStatuses: VideoStatus[]) => {
    setStatusFilters(selectedStatuses);
    setPage(1); // Reset to first page on filter change
    setIsFilterDialogOpen(false);
  };

  // Handle refresh
  const handleRefresh = () => {
    loadVideos();
    toast({
      title: "Refreshing videos",
      description: "The video list is being updated."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setViewMode('grid')}
              className={viewMode === 'grid' ? 'bg-muted' : ''}
            >
              <Grid2x2 className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setViewMode('list')}
              className={viewMode === 'list' ? 'bg-muted' : ''}
            >
              <LayoutList className="h-4 w-4" />
            </Button>
          </div>
          
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setIsFilterDialogOpen(true)}
          >
            <Filter className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleRefresh}
          >
            <RefreshCcw className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search videos..."
            className="pl-10"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </div>
      
      {/* Active filters display */}
      {statusFilters.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Filters:</span>
          {statusFilters.map(status => (
            <Badge 
              key={status} 
              variant="secondary"
              className="flex items-center gap-1"
            >
              {status}
            </Badge>
          ))}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setStatusFilters([])}
            className="h-6 px-2 text-xs"
          >
            Clear filters
          </Button>
        </div>
      )}
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Videos</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="ready">Ready</TabsTrigger>
          <TabsTrigger value="error">Error</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <VideoList 
            filters={{
              search: searchQuery,
              status: statusFilters.length > 0 ? statusFilters : undefined
            }}
            page={page}
            pageSize={pageSize}
            viewMode={viewMode}
            onPageChange={setPage}
          />
        </TabsContent>
        
        <TabsContent value="processing">
          <VideoList 
            filters={{
              search: searchQuery,
              status: ['processing', 'uploading']
            }}
            page={page}
            pageSize={pageSize}
            viewMode={viewMode}
            onPageChange={setPage}
          />
        </TabsContent>
        
        <TabsContent value="ready">
          <VideoList 
            filters={{
              search: searchQuery,
              status: ['ready']
            }}
            page={page}
            pageSize={pageSize}
            viewMode={viewMode}
            onPageChange={setPage}
          />
        </TabsContent>
        
        <TabsContent value="error">
          <VideoList 
            filters={{
              search: searchQuery,
              status: ['error', 'failed']
            }}
            page={page}
            pageSize={pageSize}
            viewMode={viewMode}
            onPageChange={setPage}
          />
        </TabsContent>
      </Tabs>
      
      {isFilterDialogOpen && (
        <VideoFilterDialog
          open={isFilterDialogOpen}
          onOpenChange={setIsFilterDialogOpen}
          selectedStatuses={statusFilters}
          onApplyFilters={handleFilterChange}
        />
      )}
    </div>
  );
};

export default VideoStorageManager;
