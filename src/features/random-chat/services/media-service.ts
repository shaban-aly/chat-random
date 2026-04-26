import { supabase } from "@/lib/supabase";

export const mediaService = {
  async uploadAudio(file: Blob, fileName: string): Promise<string | null> {
    const filePath = `audio/${Date.now()}_${fileName}.webm`;
    
    const { error: uploadError } = await supabase.storage
      .from("chat-media")
      .upload(filePath, file);

    if (uploadError) {
      console.error("Error uploading audio:", uploadError);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("chat-media")
      .getPublicUrl(filePath);

    return publicUrl;
  },
};
