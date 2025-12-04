import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export interface StorageFile {
  name: string;
  url: string;
  created_at: string;
  size: number;
  type: 'uploads' | 'generated';
}

/**
 * Create an authenticated Supabase client with Clerk token
 */
function createAuthClient(clerkToken?: string) {
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
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
}

/**
 * Get all uploaded images for a user
 */
export async function getUserUploads(userId: string, clerkToken?: string): Promise<StorageFile[]> {
  const supabase = createAuthClient(clerkToken);
  
  try {
    const { data: files, error } = await supabase.storage
      .from('product-images')
      .list(`${userId}/uploads`, {
        sortBy: { column: 'created_at', order: 'desc' }
      });

    if (error) throw error;
    if (!files) return [];

    return files
      .filter(file => file.name !== '.emptyFolderPlaceholder')
      .map(file => {
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(`${userId}/uploads/${file.name}`);
        
        return {
          name: file.name,
          url: publicUrl,
          created_at: file.created_at || new Date().toISOString(),
          size: file.metadata?.size || 0,
          type: 'uploads' as const
        };
      });
  } catch (error) {
    console.error('Error fetching uploads:', error);
    throw error instanceof Error ? error : new Error('Failed to fetch uploads');
  }
}

/**
 * Get all generated images for a user
 */
export async function getUserGenerated(userId: string, clerkToken?: string): Promise<StorageFile[]> {
  const supabase = createAuthClient(clerkToken);
  
  try {
    const { data: files, error } = await supabase.storage
      .from('product-images')
      .list(`${userId}/generated`, {
        sortBy: { column: 'created_at', order: 'desc' }
      });

    if (error) throw error;
    if (!files) return [];

    return files
      .filter(file => file.name !== '.emptyFolderPlaceholder')
      .map(file => {
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(`${userId}/generated/${file.name}`);
        
        return {
          name: file.name,
          url: publicUrl,
          created_at: file.created_at || new Date().toISOString(),
          size: file.metadata?.size || 0,
          type: 'generated' as const
        };
      });
  } catch (error) {
    console.error('Error fetching generated:', error);
    throw error instanceof Error ? error : new Error('Failed to fetch generated images');
  }
}

/**
 * Get all images (uploads + generated) for a user
 */
export async function getAllUserImages(userId: string, clerkToken?: string): Promise<StorageFile[]> {
  try {
    const [uploads, generated] = await Promise.all([
      getUserUploads(userId, clerkToken),
      getUserGenerated(userId, clerkToken)
    ]);

    return [...uploads, ...generated].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  } catch (error) {
    console.error('Error fetching all images:', error);
    throw error instanceof Error ? error : new Error('Failed to fetch all images');
  }
}

/**
 * Delete a user's file from storage
 */
export async function deleteUserFile(
  userId: string,
  fileName: string,
  type: 'uploads' | 'generated',
  clerkToken?: string
): Promise<void> {
  const supabase = createAuthClient(clerkToken);
  
  try {
    const filePath = `${userId}/${type}/${fileName}`;
    
    const { error } = await supabase.storage
      .from('product-images')
      .remove([filePath]);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error instanceof Error ? error : new Error('Failed to delete file');
  }
}
