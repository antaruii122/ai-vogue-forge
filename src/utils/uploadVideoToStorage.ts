import { supabase } from "@/integrations/supabase/client";

export async function uploadVideoToStorage() {
  try {
    // Fetch the video file from public folder
    const response = await fetch('/videos/BOLD.mp4');
    const blob = await response.blob();
    
    // Upload to storage bucket
    const { data, error } = await supabase.storage
      .from('videos')
      .upload('BOLD.mp4', blob, {
        contentType: 'video/mp4',
        upsert: true
      });

    if (error) throw error;
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('videos')
      .getPublicUrl('BOLD.mp4');
    
    return publicUrl;
  } catch (error) {
    throw error instanceof Error ? error : new Error('Video upload failed');
  }
}
