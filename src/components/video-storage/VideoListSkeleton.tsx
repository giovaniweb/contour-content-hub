
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface VideoListSkeletonProps {
  count?: number;
}

const VideoListSkeleton: React.FC<VideoListSkeletonProps> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array(count)
        .fill(0)
        .map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <Skeleton className="w-full aspect-video" />
            <CardContent className="pt-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <div className="flex gap-1">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-9 rounded-full" />
            </CardFooter>
          </Card>
        ))}
    </div>
  );
};

export default VideoListSkeleton;
