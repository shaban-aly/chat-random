"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, Square, Trash2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VoiceRecorderProps {
  onSend: (audioBlob: Blob) => void;
}

export function VoiceRecorder({ onSend }: VoiceRecorderProps) {
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    setIsSupported(!!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia));
  }, []);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // No need for useEffect check here as we do it in the initializer

  const startRecording = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("عذراً، متصفحك لا يدعم تسجيل الصوت أو أنك تتصفح عبر رابط غير آمن (يجب استخدام HTTPS).");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("فشل الوصول إلى الميكروفون. يرجى التأكد من منح الإذن.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSend = () => {
    if (audioBlob) {
      onSend(audioBlob);
      setAudioBlob(null);
    }
  };

  const handleDiscard = () => {
    setAudioBlob(null);
  };

  if (!isSupported) {
    return (
      <div className="group relative">
        <Button
          variant="ghost"
          size="icon"
          disabled
          className="rounded-full opacity-30"
          title="التسجيل الصوتي غير متاح (يتطلب HTTPS)"
        >
          <Mic className="h-5 w-5" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {!isRecording && !audioBlob && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={startRecording}
          aria-label="بدء التسجيل الصوتي"
          className="rounded-full hover:bg-red-50 hover:text-red-500"
          title="تسجيل صوتي"
        >
          <Mic className="h-5 w-5" />
        </Button>
      )}

      {isRecording && (
        <div className="flex items-center gap-2 bg-red-50 px-3 py-1 rounded-full animate-pulse text-red-600 font-medium text-sm">
          <span className="w-2 h-2 bg-red-600 rounded-full animate-ping" />
          جاري التسجيل...
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={stopRecording}
            aria-label="إيقاف التسجيل"
            className="h-8 w-8 rounded-full text-red-600 hover:bg-red-100"
          >
            <Square className="h-4 w-4 fill-current" />
          </Button>
        </div>
      )}

      {audioBlob && !isRecording && (
        <div className="flex items-center gap-2 bg-primary/10 px-2 py-1 rounded-full border border-primary/20">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleDiscard}
            aria-label="حذف التسجيل"
            className="h-8 w-8 rounded-full text-muted-foreground hover:text-red-500"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <div className="text-xs font-bold text-primary px-1">صوت جاهز</div>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleSend}
            aria-label="إرسال التسجيل الصوتي"
            className="h-8 rounded-full px-3 text-[10px]"
          >
            <Send className="h-3 w-3 mr-1" />
            إرسال
          </Button>
        </div>
      )}
    </div>
  );
}
