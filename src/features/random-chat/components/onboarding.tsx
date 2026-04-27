"use client";

import { useState, useEffect } from "react";
import { X, Play, ShieldCheck, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

const ONBOARDING_KEY = "random-chat-onboarding-seen";

const STEPS = [
  {
    title: "مرحباً بك في شات عشوائي",
    description: "أسرع وسيلة للتواصل مع أشخاص جدد بخصوصية تامة وبدون تعقيدات.",
    icon: <Play className="w-12 h-12 text-primary" />,
    color: "bg-primary/10",
  },
  {
    title: "غرف دردشة عربية",
    description: "انضم لغرفة بلدك وتحدث مع أشخاص قريبين منك في محادثات جماعية حية.",
    icon: <Globe className="w-12 h-12 text-emerald-500" />,
    color: "bg-emerald-500/10",
  },
  {
    title: "خصوصيتك أولاً",
    description: "لا نطلب أي بيانات شخصية. محادثاتك مشفرة وتختفي تماماً بمجرد انتهائها.",
    icon: <ShieldCheck className="w-12 h-12 text-blue-500" />,
    color: "bg-blue-500/10",
  },
];

export function Onboarding() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const seen = localStorage.getItem(ONBOARDING_KEY);
    if (!seen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem(ONBOARDING_KEY, "true");
    setIsOpen(false);
  };

  const next = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-lg bg-card rounded-[2.5rem] shadow-2xl overflow-hidden relative flex flex-col animate-in fade-in zoom-in-95 duration-300">
        
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 flex gap-1 p-4 pt-6">
          {STEPS.map((_, i) => (
            <div 
              key={i} 
              className={`h-full flex-1 rounded-full transition-all duration-500 ${
                i <= currentStep ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>

        {/* Skip Button */}
        <button 
          onClick={handleClose}
          className="absolute top-8 right-6 text-muted-foreground hover:text-foreground p-2 rounded-full hover:bg-muted transition-colors"
        >
          <X size={24} />
        </button>

        {/* Content */}
        <div className="flex-1 p-10 pt-20 flex flex-col items-center text-center space-y-8">
          <div className={`w-24 h-24 rounded-4xl flex items-center justify-center ${STEPS[currentStep].color} animate-in zoom-in duration-500`}>
            {STEPS[currentStep].icon}
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-black text-foreground tracking-tight">
              {STEPS[currentStep].title}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {STEPS[currentStep].description}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 flex items-center justify-between bg-muted/30">
          <Button
            variant="ghost"
            className={`rounded-2xl h-14 px-8 font-bold ${currentStep === 0 ? "invisible" : ""}`}
            onClick={prev}
          >
            السابق
          </Button>

          <Button
            className="rounded-2xl h-14 px-10 font-bold text-lg gradient-primary text-white shadow-lg shadow-primary/20"
            onClick={next}
          >
            {currentStep === STEPS.length - 1 ? "ابدأ الآن" : "التالي"}
          </Button>
        </div>
      </div>
    </div>
  );
}
