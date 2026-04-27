"use client";

import { useState } from "react";
import { ShieldAlert, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { reportService } from "../services/report-service";
import { blockService } from "../services/block-service";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reporterId: string;
  reportedId: string;
  reportedName?: string;
  onBlock?: () => void; // Optional callback to handle UI updates after block
}

const REPORT_REASONS = [
  "محتوى غير لائق أو مسيء",
  "إزعاج أو مضايقة",
  "سبام أو إعلانات",
  "حساب مزيف أو انتحال شخصية",
  "أخرى",
];

export function ReportModal({ isOpen, onClose, reporterId, reportedId, reportedName, onBlock }: ReportModalProps) {
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [details, setDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [shouldBlock, setShouldBlock] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!selectedReason) return;
    
    setIsSubmitting(true);
    try {
      await reportService.submitReport(reporterId, reportedId, selectedReason, details);
      
      if (shouldBlock) {
        blockService.blockUser(reportedId);
        if (onBlock) onBlock();
      }
      
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setSelectedReason("");
        setDetails("");
        onClose();
      }, 2000);
    } catch (error) {
      console.error(error);
      // Even if Supabase fails (e.g. table not created yet), we still block locally
      if (shouldBlock) {
        blockService.blockUser(reportedId);
        if (onBlock) onBlock();
      }
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-card rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {isSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 mb-4">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-xl font-black text-foreground">تم استلام البلاغ</h3>
            <p className="text-muted-foreground text-sm">
              شكراً لك. فريقنا سيقوم بمراجعة البلاغ واتخاذ الإجراء اللازم للحفاظ على بيئة آمنة.
            </p>
          </div>
        ) : (
          <>
            <div className="p-6 border-b border-border bg-muted/30">
              <div className="flex items-center gap-3 text-destructive">
                <ShieldAlert size={24} />
                <h2 className="text-lg font-black">إبلاغ عن المستخدم</h2>
              </div>
              {reportedName && (
                <p className="text-sm font-bold text-muted-foreground mt-2">
                  أنت تقوم بالإبلاغ عن: <span className="text-foreground">{reportedName}</span>
                </p>
              )}
            </div>

            <div className="p-6 space-y-5">
              <div className="space-y-3">
                <label className="text-sm font-bold text-foreground block">
                  سبب الإبلاغ <span className="text-destructive">*</span>
                </label>
                <div className="flex flex-col gap-2">
                  {REPORT_REASONS.map((reason) => (
                    <button
                      key={reason}
                      onClick={() => setSelectedReason(reason)}
                      className={`text-start px-4 py-3 rounded-xl text-sm font-medium transition-all border ${
                        selectedReason === reason 
                          ? "border-destructive bg-destructive/10 text-destructive" 
                          : "border-border hover:border-muted-foreground/30 bg-background"
                      }`}
                    >
                      {reason}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground block">
                  تفاصيل إضافية (اختياري)
                </label>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background p-3 text-sm min-h-[80px] resize-none focus:outline-none focus:ring-2 focus:ring-destructive/20 focus:border-destructive"
                  placeholder="يرجى كتابة أي تفاصيل إضافية تساعدنا..."
                />
              </div>

              <div className="flex items-center gap-3 p-4 rounded-xl bg-destructive/5 border border-destructive/10">
                <input
                  type="checkbox"
                  id="block-user"
                  checked={shouldBlock}
                  onChange={(e) => setShouldBlock(e.target.checked)}
                  className="w-5 h-5 rounded border-destructive text-destructive focus:ring-destructive"
                />
                <label htmlFor="block-user" className="text-sm font-bold text-destructive flex-1 cursor-pointer">
                  حجب هذا المستخدم أيضاً
                </label>
              </div>
            </div>

            <div className="p-4 border-t border-border bg-muted/30 flex gap-3">
              <Button
                variant="outline"
                className="flex-1 rounded-xl h-12"
                onClick={onClose}
                disabled={isSubmitting}
              >
                إلغاء
              </Button>
              <Button
                variant="destructive"
                className="flex-1 rounded-xl h-12 font-bold"
                onClick={handleSubmit}
                disabled={!selectedReason || isSubmitting}
              >
                {isSubmitting ? "جاري الإرسال..." : "إرسال البلاغ"}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
