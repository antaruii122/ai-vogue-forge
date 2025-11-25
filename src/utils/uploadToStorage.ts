import { supabase } from "@/integrations/supabase/client";

export async function uploadImageToStorage(file: File): Promise<string> {
  try {
    // Generate unique filename
    const timestamp = Date.now();
    const fileExt = file.name.split('.').pop();
    const fileName = `${timestamp}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    
    // Upload to storage bucket
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(fileName, file, {
        contentType: file.type,
        upsert: false
      });

    if (error) {
      throw error;
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName);
    
    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}
