"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { usePathname } from "next/navigation";

export function AudioPlayer({ src = "/bg-music.mp3" }: { src?: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.2); // Default to 20% volume
  const audioRef = useRef<HTMLAudioElement>(null);
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return null;

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // Browsers may block autoplay, so we catch the promise
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((e) => {
        console.error("Playback failed:", e);
      });
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    } else if (newVolume === 0 && !isMuted) {
      setIsMuted(true);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-neutral-900/80 backdrop-blur-md border border-neutral-800/50 p-2 pr-4 rounded-full shadow-2xl transition-all duration-300 hover:border-primary-500/50 group hover:shadow-primary-500/20">
      {/* Hidden Audio Element */}
      <audio 
        ref={audioRef} 
        src={src} 
        loop 
        onEnded={() => setIsPlaying(false)}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
      />
      
      <div className="px-3 flex items-center">
        <div className="flex gap-1 h-3 items-end">
          <div className={`w-1 bg-primary-500 rounded-t-sm transition-all duration-200 ${isPlaying ? 'h-3 animate-pulse' : 'h-1'}`}></div>
          <div className={`w-1 bg-primary-500 rounded-t-sm transition-all duration-300 ${isPlaying ? 'h-2 animate-pulse delay-75' : 'h-1'}`}></div>
          <div className={`w-1 bg-primary-500 rounded-t-sm transition-all duration-150 ${isPlaying ? 'h-full animate-pulse delay-150' : 'h-1'}`}></div>
        </div>
        <span className="text-xs text-neutral-300 font-medium ml-3 tracking-wider hidden sm:block">
          {isPlaying ? "NOW PLAYING" : "PAUSED"}
        </span>
      </div>

      <button 
        onClick={togglePlay}
        className="h-10 w-10 flex shrink-0 items-center justify-center rounded-full bg-neutral-800 hover:bg-primary-600 text-white transition-colors duration-300"
        aria-label={isPlaying ? "Pause music" : "Play music"}
      >
        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
      </button>

      <div className="flex items-center gap-2 group/volume relative">
        <button 
          onClick={toggleMute}
          className="h-10 w-10 flex shrink-0 items-center justify-center rounded-full bg-neutral-800 hover:bg-neutral-700 text-white transition-colors duration-300"
          aria-label={isMuted ? "Unmute music" : "Mute music"}
        >
          {isMuted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>
        
        {/* Volume Slider (expands on hover on desktop) */}
        <div className="w-0 overflow-hidden group-hover:w-24 transition-all duration-300 ease-in-out opacity-0 group-hover:opacity-100 flex items-center">
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={isMuted ? 0 : volume} 
            onChange={handleVolumeChange}
            className="w-full h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-primary-500"
          />
        </div>
      </div>
    </div>
  );
}
