"use client";

import { Button } from "@/components/ui/button";
import { Play, ShieldCheck, CheckCircle2, MessageSquare } from "lucide-react";

interface HomeScreenProps {
  onStart: () => void;
  onOpenConversations: () => void;
  guestId: string;
  isEnded?: boolean;
}

export function HomeScreen({ onStart, onOpenConversations, guestId, isEnded = false }: HomeScreenProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-6 text-center screen-enter">
      <div className="max-w-md w-full space-y-10">
        {/* Main Icon */}
        <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-[2.5rem] bg-card shadow-2xl shadow-primary/5 text-primary/80 relative">
          <div className="absolute inset-0 rounded-[2.5rem] bg-linear-to-br from-primary/20 to-transparent opacity-50" />
          {isEnded ? <CheckCircle2 size={64} /> : <ShieldCheck size={64} />}
        </div>

        {/* Text Content */}
        <div className="space-y-4">
          <h1 className="text-4xl font-black text-foreground leading-tight tracking-tight">
            {isEnded ? "انتهت المحادثة" : (
              <>
                دردشة آمنة،<br />
                تواصل هادئ
              </>
            )}
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed font-medium px-4">
            {isEnded
              ? "نأمل أن تكون قد استمتعت بوقتك. يمكنك بدء محادثة جديدة في أي وقت."
              : "تحدث مع الغرباء بخصوصية تامة. نحن نؤمن بأن التواصل الإنساني يجب أن يكون بسيطاً وآمناً."}
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-4 space-y-4">
          <Button
            className="h-16 w-full rounded-2xl text-lg font-bold gradient-primary shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] text-white border-0"
            onClick={onStart}
            size="lg"
          >
            <Play size={20} fill="currentColor" className="ml-2" />
            بدء محادثة عشوائية
          </Button>

          {!isEnded && (
            <Button
              variant="outline"
              className="h-14 w-full rounded-2xl text-sm font-bold border-border bg-card hover:bg-muted transition-all"
              onClick={onOpenConversations}
            >
              <MessageSquare size={18} className="ml-2" />
              الرسائل الخاصة
            </Button>
          )}

          {!isEnded && (
            <div className="flex flex-col gap-3 text-sm font-medium text-muted-foreground bg-card p-6 rounded-2xl text-start">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={18} className="text-emerald-500" />
                <span>بدون تسجيل حساب</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 size={18} className="text-emerald-500" />
                <span>محادثة مشفرة وآمنة</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 size={18} className="text-emerald-500" />
                <span>الرسائل تختفي بعد الإنهاء</span>
              </div>
            </div>
          )}
        </div>

        {/* Guest ID */}
        <div className="flex flex-col items-center gap-1 opacity-50 pt-8">
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground">
            معرف الجلسة الآمن
          </span>
          <span className="font-mono text-xs tabular-nums text-foreground bg-muted px-3 py-1 rounded-full">
            {guestId.slice(0, 12)}...
          </span>
        </div>
      </div>
    </div>
  );
}
