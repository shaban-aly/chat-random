import { supabase } from "@/lib/supabase";
import { Profile } from "../types";

export const profileService = {
  async getProfile(guestId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("guest_id", guestId)
      .single();

    if (error) {
      if (error.code !== "PGRST116") {
        console.error("Error fetching profile:", error);
      }
      return null;
    }
    return data as Profile;
  },

  async upsertProfile(profile: Profile): Promise<Profile | null> {
    const { data, error } = await supabase
      .from("profiles")
      .upsert(profile, { onConflict: "guest_id" })
      .select()
      .single();

    if (error) {
      console.error("Error upserting profile:", error);
      return null;
    }
    return data as Profile;
  },

  async isNameAvailable(name: string, excludeGuestId?: string): Promise<boolean> {
    let query = supabase
      .from("profiles")
      .select("guest_id")
      .eq("name", name);

    if (excludeGuestId) {
      query = query.neq("guest_id", excludeGuestId);
    }

    const { data, error } = await query;
    if (error) return false;
    return data.length === 0;
  },

  async deleteProfile(guestId: string): Promise<boolean> {
    const { error } = await supabase
      .from("profiles")
      .delete()
      .eq("guest_id", guestId);

    if (error) {
      console.error("Error deleting profile:", error);
      return false;
    }
    return true;
  },
};
