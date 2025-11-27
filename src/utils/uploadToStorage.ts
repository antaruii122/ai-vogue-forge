import { supabase } from "@/integrations/supabase/client";

export async function uploadImageToStorage(
  file: File,
  userId: string,
  uploadType: 'uploads' | 'generated' = 'uploads'
): Promise<string> {
  try {
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.id !== userId) {
      throw new Error('User must be authenticated to upload files');
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileExt = file.name.split('.').pop();
    const fileName = `${timestamp}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    
    // Construct path: {userId}/{uploadType}/{filename}
    const filePath = `${userId}/${uploadType}/${fileName}`;
    
    // Upload to storage bucket
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false
      });

    if (error) {
      throw error;
    }
    
    // Get public URL (access controlled by RLS)
    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);
    
    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}
