"use client";

import { useState } from "react";
import { User, Calendar, Users, ChevronRight } from "lucide-react";
import { Profile } from "../types";

interface JoinRoomModalProps {
  roomName: string;
  onJoin: (profile: Omit<Profile, "guest_id">) => void;
  onClose: () => void;
}

export function JoinRoomModal({ roomName, onJoin, onClose }: JoinRoomModalProps) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "">("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("الرجاء إدخال اسمك");
      return;
    }
    
    if (name.trim().length < 2) {
      setError("الاسم يجب أن يكون حرفين على الأقل");
      return;
    }

    const ageNum = parseInt(age);
    if (!ageNum || ageNum < 13 || ageNum > 99) {
      setError("الرجاء إدخال عمر صحيح (13-99)");
      return;
    }

    if (!gender) {
      setError("الرجاء تحديد الجنس");
      return;
    }

    onJoin({
      name: name.trim(),
      age: ageNum,
      gender: gender as "male" | "female",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-sm rounded-3xl bg-card shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        dir="rtl"
      >
        <div className="bg-primary/5 p-6 border-b border-border text-center relative">
          <button 
            onClick={onClose}
            className="absolute top-4 left-4 p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-black/5 transition-colors"
          >
            ✕
          </button>
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Users className="h-7 w-7" />
          </div>
          <h2 className="text-xl font-black text-foreground">الدخول للغرفة</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            أنت تنضم الآن إلى <span className="font-bold text-primary">{roomName}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-bold text-muted-foreground">الاسم المستعار</label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="كيف نناديك؟"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 pl-10 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all text-foreground placeholder:text-muted-foreground"
                  maxLength={20}
                />
                <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground/50" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-bold text-muted-foreground">العمر</label>
                <div className="relative">
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="العمر"
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 pl-10 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all text-foreground placeholder:text-muted-foreground"
                    min="13"
                    max="99"
                  />
                  <Calendar className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground/50" />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-muted-foreground">النوع</label>
                <div className="flex w-full overflow-hidden rounded-xl border border-border bg-background p-1 text-sm h-[46px]">
                  <button
                    type="button"
                    onClick={() => setGender("male")}
                    className={`flex-1 rounded-lg font-bold transition-all ${
                      gender === "male" 
                        ? "bg-blue-500/10 text-blue-600 dark:text-blue-400" 
                        : "text-muted-foreground hover:bg-muted/50"
                    }`}
                  >
                    ذكر
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender("female")}
                    className={`flex-1 rounded-lg font-bold transition-all ${
                      gender === "female" 
                        ? "bg-pink-500/10 text-pink-600 dark:text-pink-400" 
                        : "text-muted-foreground hover:bg-muted/50"
                    }`}
                  >
                    أنثى
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-red-500/10 p-3 text-center text-xs font-bold text-red-500">
                {error}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 active:scale-[0.98]"
          >
            <span>دخول الغرفة</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
