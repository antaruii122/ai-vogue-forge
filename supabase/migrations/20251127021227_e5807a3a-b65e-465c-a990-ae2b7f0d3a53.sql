-- Create user_generations table
CREATE TABLE public.user_generations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  original_image_url TEXT NOT NULL,
  style TEXT NOT NULL,
  aspect_ratio TEXT NOT NULL,
  background TEXT,
  lighting TEXT,
  camera_angle TEXT,
  generated_images JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'processing',
  credits_used INTEGER NOT NULL DEFAULT 1
);

-- Enable Row Level Security
ALTER TABLE public.user_generations ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view only their own generations
CREATE POLICY "Users can view their own generations"
ON public.user_generations
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- RLS Policy: Users can insert only with their own user_id
CREATE POLICY "Users can insert their own generations"
ON public.user_generations
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can update only their own generations
CREATE POLICY "Users can update their own generations"
ON public.user_generations
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- RLS Policy: Users can delete only their own generations
CREATE POLICY "Users can delete their own generations"
ON public.user_generations
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_user_generations_user_id ON public.user_generations(user_id);
CREATE INDEX idx_user_generations_created_at ON public.user_generations(created_at DESC);