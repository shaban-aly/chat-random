"use client";

import { Button } from "@/components/ui/button";
import { LogOut, User, ArrowRight, ShieldAlert } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

interface ChatHeaderProps {
  statusLabel: string;
  onEndChat: () => void;
  onReport?: () => void;
}

export function ChatHeader({ statusLabel, onEndChat, onReport }: ChatHeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b border-border/50 bg-background/80 px-4 backdrop-blur-md sm:h-20 sm:px-8">
      <div className="flex items-center gap-3 sm:gap-4">
        <ThemeToggle />
        <button
          onClick={onEndChat}
          aria-label="الرجوع وإنهاء الدردشة"
          className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:bg-muted transition-colors lg:hidden"
        >
          <ArrowRight size={20} />
        </button>

        <div className="relative group" aria-label="صورة المستخدم" role="img">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform group-hover:scale-105 sm:h-12 sm:w-12">
            <User size={22} />
          </div>
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" title="متصل" />
        </div>

        <div className="flex flex-col">
          <h2 className="text-sm font-black text-foreground sm:text-base">
            شخص مجهول
          </h2>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            {statusLabel}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {onReport && (
          <button
            onClick={onReport}
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
            title="إبلاغ عن المستخدم"
          >
            <ShieldAlert size={18} />
          </button>
        )}
        <Button
          variant="secondary"
          size="sm"
          onClick={onEndChat}
          className="h-9 rounded-full border border-destructive/20 bg-destructive/5 px-3 text-destructive hover:bg-destructive hover:text-white sm:h-10 sm:px-5 transition-all"
        >
          <LogOut size={16} className="sm:ml-2" />
          <span className="hidden sm:inline">إنهاء الدردشة</span>
          <span className="sm:hidden">إنهاء</span>
        </Button>
      </div>
    </header>
  );
}
