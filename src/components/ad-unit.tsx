"use client";

import { useEffect, useRef } from "react";

interface AdUnitProps {
  src: string;
  className?: string;
}

/**
 * A safe wrapper for injecting third-party ad scripts that usually rely on 
 * document.scripts[document.scripts.length - 1] hacks.
 * This guarantees the ad renders exactly inside this container.
 */
export function AdUnit({ src, className = "" }: AdUnitProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isLoaded = useRef(false);

  useEffect(() => {
    const currentContainer = containerRef.current;
    if (isLoaded.current || !currentContainer) return;
    
    isLoaded.current = true;

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.referrerPolicy = "no-referrer-when-downgrade";
    // We add an empty settings object to mimic the network's IIFE argument
    (script as HTMLScriptElement & { settings?: unknown }).settings = {}; 

    currentContainer.appendChild(script);

    return () => {
      // Optional cleanup if the ad network supports it, but usually we just leave it or let React unmount the container
      if (currentContainer && script.parentNode) {
        // currentContainer.removeChild(script);
      }
    };
  }, [src]);

  return (
    <div 
      ref={containerRef} 
      className={`ad-container flex items-center justify-center w-full min-h-[50px] ${className}`}
    />
  );
}
