const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

/**
 * Upload an image to storage via edge function with Clerk authentication.
 * The edge function validates the Clerk token and uses service_role key for storage.
 */
export async function uploadImageToStorage(
  file: File,
  userId: string,
  uploadType: 'uploads' | 'generated' = 'uploads',
  clerkToken?: string
): Promise<string> {
  try {
    if (!clerkToken) {
      throw new Error('Authentication required');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('bucket', 'product-images');
    formData.append('uploadType', uploadType);

    const response = await fetch(`${supabaseUrl}/functions/v1/storage-upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${clerkToken}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Upload failed');
    }

    const result = await response.json();
    return result.url;
  } catch (error) {
    console.error('Upload failed:', error);
    throw error instanceof Error ? error : new Error('Upload failed');
  }
}

/**
 * Delete an image from storage via edge function with Clerk authentication.
 */
export async function deleteImageFromStorage(
  userId: string,
  fileName: string,
  uploadType: 'uploads' | 'generated' = 'uploads',
  clerkToken?: string
): Promise<void> {
  try {
    if (!clerkToken) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${supabaseUrl}/functions/v1/storage-delete`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${clerkToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileName,
        fileType: uploadType,
        bucket: 'product-images',
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Delete failed');
    }
  } catch (error) {
    console.error('Delete failed:', error);
    throw error instanceof Error ? error : new Error('Delete failed');
  }
}
