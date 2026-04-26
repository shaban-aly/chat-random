"use client";

import { useState, useEffect, useCallback } from "react";
import { X, LogOut, User, Shield, Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { profileService } from "../services/profile-service";
import { Profile } from "../types";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  guestId: string;
}

export function ProfileModal({ isOpen, onClose, guestId }: ProfileModalProps) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [name, setName] = useState("");
  const [age, setAge] = useState<number>(18);
  const [gender, setGender] = useState<"male" | "female">("male");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const loadProfile = useCallback(async () => {
    const data = await profileService.getProfile(guestId);
    if (data) {
      setProfile(data);
      setName(data.name || "");
      setAge(data.age || 18);
      setGender(data.gender || "male");
    }
  }, [guestId]);

  useEffect(() => {
    if (isOpen && guestId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadProfile();
    }
  }, [isOpen, guestId, loadProfile]);

  const handleSave = async () => {
    if (!name.trim()) return;
    setIsLoading(true);
    setError("");
    
    const available = await profileService.isNameAvailable(name.trim(), guestId);
    if (!available) {
      setError("هذا الاسم مستخدم بالفعل، اختر اسماً آخر.");
      setIsLoading(false);
      return;
    }

    const updated = await profileService.upsertProfile({
      guest_id: guestId,
      name: name.trim(),
      age: age,
      gender: gender,
    });

    if (updated) {
      // Also save to the room profile storage for consistency
      localStorage.setItem("random-chat-profile", JSON.stringify({
        name: name.trim(),
        age: age,
        gender: gender
      }));
      setProfile(updated);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
    setIsLoading(false);
  };

  const [showConfirmLogout, setShowConfirmLogout] = useState(false);

  const handleLogout = async () => {
    if (!showConfirmLogout) {
      setShowConfirmLogout(true);
      return;
    }

    setIsLoading(true);
    try {
      // Clear profile from DB
      await profileService.deleteProfile(guestId);
      // Clear local storage
      localStorage.removeItem("random-chat-guest-id");
      localStorage.removeItem("random-chat-profile");
      // Redirect to home using replace to prevent back button issues
      window.location.replace("/");
    } catch (err) {
      console.error("Logout error:", err);
      // Fallback: still try to clear local storage and redirect
      localStorage.removeItem("random-chat-guest-id");
      window.location.replace("/");
    }
  };

  const copyId = () => {
    navigator.clipboard.writeText(guestId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  const isChanged = 
    name !== (profile?.name || "") || 
    age !== (profile?.age || 18) || 
    gender !== (profile?.gender || "male");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-card border border-border shadow-2xl rounded-4xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <User size={20} />
            </div>
            <h2 className="text-xl font-black text-foreground">الملف الشخصي</h2>
          </div>
          <button 
            onClick={onClose}
            className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-6">
          {/* Guest ID Section */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">
              معرف الجلسة الآمن
            </label>
            <div 
              onClick={copyId}
              className="flex items-center justify-between p-4 rounded-2xl bg-muted/50 border border-border/50 cursor-pointer hover:bg-muted transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Shield size={16} className="text-emerald-500" />
                <code className="text-xs font-mono text-foreground font-medium">
                  {guestId.slice(0, 18)}...
                </code>
              </div>
              {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} className="text-muted-foreground group-hover:text-foreground" />}
            </div>
          </div>

          {/* Name Section */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">
              اسم العرض
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="أدخل اسمك..."
              className="h-14 rounded-2xl border-border bg-card focus:ring-primary/20"
            />
            {error && <p className="text-xs font-bold text-destructive px-1">{error}</p>}
          </div>

          {/* Age & Gender Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">
                العمر
              </label>
              <Input
                type="number"
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value) || 0)}
                className="h-14 rounded-2xl border-border bg-card"
                min={12}
                max={99}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">
                الجنس
              </label>
              <div className="flex bg-muted p-1 rounded-2xl h-14">
                <button
                  onClick={() => setGender("male")}
                  className={`flex-1 rounded-xl text-xs font-bold transition-all ${gender === "male" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
                >
                  ذكر
                </button>
                <button
                  onClick={() => setGender("female")}
                  className={`flex-1 rounded-xl text-xs font-bold transition-all ${gender === "female" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
                >
                  أنثى
                </button>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleSave}
            disabled={isLoading || !isChanged}
            className="h-14 w-full rounded-2xl font-bold mt-2"
          >
            {isLoading ? "جاري الحفظ..." : isSaved ? <><Check size={20} className="ml-2" /> تم الحفظ</> : "حفظ التغييرات"}
          </Button>

          <div className="pt-2">
            <button
              onClick={handleLogout}
              disabled={isLoading}
              className={`w-full flex items-center justify-center gap-3 h-14 rounded-2xl transition-all font-bold border ${
                showConfirmLogout 
                  ? "bg-destructive text-white border-destructive animate-pulse" 
                  : "text-destructive hover:bg-destructive/5 border-destructive/10"
              }`}
            >
              {showConfirmLogout ? (
                <>
                  <Check size={20} />
                  <span>تأكيد حذف الحساب؟</span>
                </>
              ) : (
                <>
                  <LogOut size={20} />
                  <span>حذف الحساب وتسجيل الخروج</span>
                </>
              )}
            </button>
            {showConfirmLogout && (
              <button 
                onClick={() => setShowConfirmLogout(false)}
                className="w-full text-[10px] font-bold text-muted-foreground mt-2 hover:text-foreground transition-colors"
              >
                تراجع عن الحذف
              </button>
            )}
            <p className="text-[10px] text-center text-muted-foreground mt-4 font-medium px-4">
              حذف الحساب سيؤدي لمسح كافة الرسائل والمحادثات بشكل نهائي.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
