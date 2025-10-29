"use client";
import React, { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface FeedProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

const Feed = ({ videoRef }: FeedProps) => {
  useEffect(() => {
    const interval = setInterval(async () => {
      if (!videoRef.current) return;

      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(async (blob) => {
        if (!blob) return;

        const formData = new FormData();
        formData.append("frame", blob, "frame.jpg");

        try {
          await fetch("/api/send-to-ai", {
            method: "POST",
            body: formData,
          });
        } catch (err) {
          console.error("Failed to send frame:", err);
        }
      }, "image/jpeg");
    }, 5000); // every 5 seconds

    return () => clearInterval(interval);
  }, [videoRef]);

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
