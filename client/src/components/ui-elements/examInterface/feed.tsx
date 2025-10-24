import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface FeedProps {
  videoRef: React.RefObject<HTMLVideoElement | null>; 
}

const Feed = ({ videoRef }: FeedProps) => {
  return (
    <Card className="relative w-full rounded-md overflow-hidden border bg-white/80 backdrop-blur-sm shadow-md p-0">
      <div className="aspect-video bg-black overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover -scale-x-100"
        />
      </div>
      <Badge className="absolute top-1 left-3 bg-red-600 text-white animate-pulse">
        REC
      </Badge>
    </Card>
  );
};

export default Feed;
