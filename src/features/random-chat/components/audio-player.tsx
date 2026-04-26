"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AudioPlayerProps {
  src: string;
}

export function AudioPlayer({ src }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
      setDuration(audio.duration);
    };

    const setAudioTime = () => {
      setProgress((audio.currentTime / audio.duration) * 100);
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    audio.addEventListener("loadeddata", setAudioData);
    audio.addEventListener("timeupdate", setAudioTime);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("loadeddata", setAudioData);
      audio.removeEventListener("timeupdate", setAudioTime);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center gap-4 bg-primary/5 dark:bg-primary/10 rounded-2xl px-4 py-3 border border-primary/10 w-full max-w-[280px]">
      <audio ref={audioRef} src={src} preload="metadata" />
      
      <button
        onClick={togglePlay}
        className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all shrink-0"
        aria-label={isPlaying ? "إيقاف مؤقت" : "تشغيل"}
      >
        {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
      </button>

      <div className="flex flex-col flex-1 gap-2 overflow-hidden">
        {/* Waveform Simulation */}
        <div className="h-6 flex items-end gap-[2px] px-1 opacity-80">
          {[0.4, 0.7, 0.5, 0.9, 0.6, 0.8, 0.4, 0.7, 0.5, 0.9, 0.6, 0.8, 0.4, 0.7, 0.5, 0.9, 0.6].map((h, i) => (
            <div 
              key={i} 
              className={`flex-1 rounded-full transition-all duration-300 ${
                (i / 17) * 100 < progress ? "bg-primary" : "bg-primary/20"
              }`}
              style={{ 
                height: isPlaying ? `${h * 100}%` : `${Math.max(0.2, h * 0.5) * 100}%`,
                transitionDelay: `${i * 30}ms`
              }}
            />
          ))}
        </div>
        
        <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground/80 font-mono">
          <span>{formatTime(currentTime)}</span>
          <div className="h-1 flex-1 mx-3 bg-primary/10 rounded-full overflow-hidden relative">
            <div 
              className="absolute left-0 top-0 h-full bg-primary transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
}
