import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

/**
 * Upload an image to Supabase storage with Clerk authentication.
 * Creates an authenticated client using the provided Clerk token.
 */
export async function uploadImageToStorage(
  file: File,
  userId: string,
  uploadType: 'uploads' | 'generated' = 'uploads',
  clerkToken?: string
): Promise<string> {
  try {
    // Create authenticated client with Clerk token
    const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
      global: {
        headers: clerkToken ? {
          Authorization: `Bearer ${clerkToken}`,
        } : {},
      },
    });

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
      console.error('Storage upload error:', error);
      throw error;
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);
    
    return publicUrl;
  } catch (error) {
    console.error('Upload failed:', error);
    throw error instanceof Error ? error : new Error('Upload failed');
  }
}

/**
 * Delete an image from Supabase storage with Clerk authentication.
 */
export async function deleteImageFromStorage(
  userId: string,
  fileName: string,
  uploadType: 'uploads' | 'generated' = 'uploads',
  clerkToken?: string
): Promise<void> {
  try {
    const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
      global: {
        headers: clerkToken ? {
          Authorization: `Bearer ${clerkToken}`,
        } : {},
      },
    });

    const filePath = `${userId}/${uploadType}/${fileName}`;
    
    const { error } = await supabase.storage
      .from('product-images')
      .remove([filePath]);

    if (error) {
      console.error('Storage delete error:', error);
      throw error;
    }
  } catch (error) {
    console.error('Delete failed:', error);
    throw error instanceof Error ? error : new Error('Delete failed');
  }
}
