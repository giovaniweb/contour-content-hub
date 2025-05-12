
import React, { useState } from 'react';
import { VideoStatus } from '@/types/video-storage';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface VideoFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedStatuses: VideoStatus[];
  onApplyFilters: (statuses: VideoStatus[]) => void;
}

const VideoFilterDialog: React.FC<VideoFilterDialogProps> = ({
  open,
  onOpenChange,
  selectedStatuses,
  onApplyFilters,
}) => {
  // Create a local state for the selected statuses to avoid modifying the parent state directly
  const [localSelectedStatuses, setLocalSelectedStatuses] = useState<VideoStatus[]>(selectedStatuses);

  // Status options
  const statusOptions: { label: string; value: VideoStatus }[] = [
    { label: 'Ready', value: 'ready' },
    { label: 'Processing', value: 'processing' },
    { label: 'Uploading', value: 'uploading' },
    { label: 'Error', value: 'error' },
    { label: 'Failed', value: 'failed' },
  ];

  // Handle checkbox change
  const handleStatusChange = (status: VideoStatus, checked: boolean) => {
    if (checked) {
      setLocalSelectedStatuses(prev => [...prev, status]);
    } else {
      setLocalSelectedStatuses(prev => prev.filter(s => s !== status));
    }
  };

  // Handle apply filters
  const handleApply = () => {
    onApplyFilters(localSelectedStatuses);
  };

  // Handle clear all
  const handleClearAll = () => {
    setLocalSelectedStatuses([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Filter Videos</DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="space-y-4">
            <h3 className="font-medium">Status</h3>
            <div className="grid grid-cols-2 gap-2">
              {statusOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`status-${option.value}`}
                    checked={localSelectedStatuses.includes(option.value)}
                    onCheckedChange={(checked) => 
                      handleStatusChange(option.value, checked as boolean)
                    }
                  />
                  <label 
                    htmlFor={`status-${option.value}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <div className="flex justify-between w-full">
            <Button 
              variant="outline" 
              onClick={handleClearAll}
            >
              Clear All
            </Button>
            <div className="flex space-x-2">
              <Button 
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleApply}>Apply Filters</Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VideoFilterDialog;
