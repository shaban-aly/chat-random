"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Search, XCircle } from "lucide-react";
import { AdUnit } from "@/components/ad-unit";

interface SearchingScreenProps {
  onCancel: () => void;
  searchCount: number;
}

export function SearchingScreen({ onCancel, searchCount }: SearchingScreenProps) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedTime = `00:${seconds.toString().padStart(2, "0")}`;

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-6 text-center screen-enter">
      <div className="max-w-md w-full flex flex-col items-center space-y-12">
        {/* Radar Animation */}
        <div className="relative flex items-center justify-center h-40 w-40">
          <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-radar-1" />
          <div className="absolute inset-0 rounded-full border-2 border-primary/40 animate-radar-2" />
          <div className="absolute inset-0 rounded-full border-2 border-primary/60 animate-radar-3" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/30 z-10">
            <Search size={32} className="animate-pulse" />
          </div>
        </div>

        {/* Text Area */}
        <div className="space-y-4">
          <h2 className="text-3xl font-black text-foreground tracking-tight">
            نبحث عن شريك...
          </h2>
          <div className="text-5xl font-mono font-black text-primary tracking-widest opacity-80">
            {formattedTime}
          </div>
          <div className="flex justify-center gap-1.5 pt-2">
            <span className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-2 h-2 rounded-full bg-primary/80 animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        </div>

        {/* Cancel Button */}
        <div className="pt-8 w-full max-w-[280px]">
          <Button
            className="h-14 w-full rounded-full text-base font-bold bg-muted hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-all"
            onClick={onCancel}
            variant="ghost"
            size="lg"
          >
            <XCircle size={20} className="ml-2" />
            إلغاء البحث
          </Button>
        </div>

        {/* Dynamic Ad Unit for users searching more than once */}
        {searchCount > 1 && (
          <div className="w-full pt-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <AdUnit src="//untimely-hello.com/bTXfVOsUd.Gql/0/YHWlcs/leamS9duTZQUPlBkHP/TTYQ5/OrTbE/4/OiDoEStpNZjRkJ5fMYTqg/4/N/QJ" />
          </div>
        )}
      </div>
    </div>
  );
}
