import { supabase } from "@/integrations/supabase/client";

export interface StorageFile {
  name: string;
  url: string;
  created_at: string;
  size: number;
  type: 'uploads' | 'generated';
}

/**
 * Get all uploaded images for the authenticated user
 */
export async function getUserUploads(userId: string): Promise<StorageFile[]> {
  try {
    // Verify authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.id !== userId) {
      throw new Error('User must be authenticated');
    }

    // List files from user's uploads folder
    const { data: files, error } = await supabase.storage
      .from('product-images')
      .list(`${userId}/uploads`, {
        sortBy: { column: 'created_at', order: 'desc' }
      });

    if (error) throw error;
    if (!files) return [];

    // Convert to StorageFile format with public URLs
    return files
      .filter(file => file.name !== '.emptyFolderPlaceholder')
      .map(file => {
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(`${userId}/uploads/${file.name}`);

        return {
          name: file.name,
          url: publicUrl,
          created_at: file.created_at,
          size: file.metadata?.size || 0,
          type: 'uploads' as const
        };
      });
  } catch (error) {
    throw error instanceof Error ? error : new Error('Failed to fetch uploads');
  }
}

/**
 * Get all generated images for the authenticated user
 */
export async function getUserGenerated(userId: string): Promise<StorageFile[]> {
  try {
    // Verify authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.id !== userId) {
      throw new Error('User must be authenticated');
    }

    // List files from user's generated folder
    const { data: files, error } = await supabase.storage
      .from('product-images')
      .list(`${userId}/generated`, {
        sortBy: { column: 'created_at', order: 'desc' }
      });

    if (error) throw error;
    if (!files) return [];

    // Convert to StorageFile format with public URLs
    return files
      .filter(file => file.name !== '.emptyFolderPlaceholder')
      .map(file => {
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(`${userId}/generated/${file.name}`);

        return {
          name: file.name,
          url: publicUrl,
          created_at: file.created_at,
          size: file.metadata?.size || 0,
          type: 'generated' as const
        };
      });
  } catch (error) {
    throw error instanceof Error ? error : new Error('Failed to fetch generated images');
  }
}

/**
 * Get all images (both uploads and generated) for the authenticated user
 */
export async function getAllUserImages(userId: string): Promise<StorageFile[]> {
  try {
    const [uploads, generated] = await Promise.all([
      getUserUploads(userId),
      getUserGenerated(userId)
    ]);

    // Combine and sort by date, newest first
    return [...uploads, ...generated].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  } catch (error) {
    throw error instanceof Error ? error : new Error('Failed to fetch all images');
  }
}

/**
 * Delete a file from storage (user can only delete their own files)
 */
export async function deleteUserFile(
  userId: string, 
  fileName: string, 
  type: 'uploads' | 'generated'
): Promise<void> {
  try {
    // Verify authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.id !== userId) {
      throw new Error('User must be authenticated');
    }

    const filePath = `${userId}/${type}/${fileName}`;

    const { error } = await supabase.storage
      .from('product-images')
      .remove([filePath]);

    if (error) throw error;
  } catch (error) {
    throw error instanceof Error ? error : new Error('Failed to delete file');
  }
}
