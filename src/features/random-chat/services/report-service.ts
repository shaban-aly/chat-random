import { supabase } from "@/lib/supabase";

export const reportService = {
  async submitReport(reporterId: string, reportedId: string, reason: string, details?: string) {
    const { error } = await supabase.from("reports").insert({
      reporter_id: reporterId,
      reported_id: reportedId,
      reason: reason,
      details: details || null,
    });

    if (error) {
      console.error("Error submitting report:", error);
      throw error;
    }
  },
};
