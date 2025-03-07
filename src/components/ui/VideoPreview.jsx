'use client';

import { useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

export default function VideoPreview({ src, poster, className }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className={`relative overflow-hidden rounded-lg ${className}`}>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        onClick={togglePlay}
        muted={isMuted}
        playsInline
        className="w-full h-full object-cover cursor-pointer"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      />

      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
        <button
          onClick={togglePlay}
          className="w-16 h-16 rounded-full bg-white bg-opacity-60 flex items-center justify-center focus:outline-none hover:bg-opacity-80 transition-all"
        >
          {isPlaying ? (
            <Pause className="h-8 w-8 text-gray-900" />
          ) : (
            <Play className="h-8 w-8 text-gray-900 ml-1" />
          )}
        </button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-3 flex justify-between items-center bg-gradient-to-t from-black to-transparent opacity-0 hover:opacity-100 transition-opacity">
        <div className="text-white text-sm font-medium">
          {isPlaying ? 'En lecture' : 'Cliquez pour lire'}
        </div>
        <button
          onClick={toggleMute}
          className="p-1 rounded-full bg-white bg-opacity-10 hover:bg-opacity-20 focus:outline-none transition-all"
        >
          {isMuted ? (
            <VolumeX className="h-5 w-5 text-white" />
          ) : (
            <Volume2 className="h-5 w-5 text-white" />
          )}
        </button>
      </div>
    </div>
  );
}
