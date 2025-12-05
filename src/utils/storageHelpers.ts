const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

export interface StorageFile {
  name: string;
  url: string;
  created_at: string;
  size: number;
  type: 'uploads' | 'generated';
}

/**
 * Get all uploaded images for a user via edge function
 */
export async function getUserUploads(userId: string, clerkToken?: string): Promise<StorageFile[]> {
  if (!clerkToken) {
    throw new Error('Authentication required');
  }

  const response = await fetch(
    `${supabaseUrl}/functions/v1/storage-list?bucket=product-images&type=uploads`,
    {
      headers: {
        'Authorization': `Bearer ${clerkToken}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch uploads');
  }

  const result = await response.json();
  return result.files.filter((f: StorageFile) => f.type === 'uploads');
}

/**
 * Get all generated images for a user via edge function
 */
export async function getUserGenerated(userId: string, clerkToken?: string): Promise<StorageFile[]> {
  if (!clerkToken) {
    throw new Error('Authentication required');
  }

  const response = await fetch(
    `${supabaseUrl}/functions/v1/storage-list?bucket=product-images&type=generated`,
    {
      headers: {
        'Authorization': `Bearer ${clerkToken}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch generated images');
  }

  const result = await response.json();
  return result.files.filter((f: StorageFile) => f.type === 'generated');
}

/**
 * Get all images (uploads + generated) for a user via edge function
 */
export async function getAllUserImages(userId: string, clerkToken?: string): Promise<StorageFile[]> {
  if (!clerkToken) {
    throw new Error('Authentication required');
  }

  const response = await fetch(
    `${supabaseUrl}/functions/v1/storage-list?bucket=product-images&type=all`,
    {
      headers: {
        'Authorization': `Bearer ${clerkToken}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch images');
  }

  const result = await response.json();
  return result.files;
}

/**
 * Delete a user's file from storage via edge function
 */
export async function deleteUserFile(
  userId: string,
  fileName: string,
  type: 'uploads' | 'generated',
  clerkToken?: string
): Promise<void> {
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
      fileType: type,
      bucket: 'product-images',
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete file');
  }
}
