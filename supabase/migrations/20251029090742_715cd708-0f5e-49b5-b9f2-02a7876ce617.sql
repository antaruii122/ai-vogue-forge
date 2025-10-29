-- Create storage bucket for videos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('videos', 'videos', true)
ON CONFLICT (id) DO NOTHING;

-- Create policy to allow public read access
CREATE POLICY "Public video access"
ON storage.objects FOR SELECT
USING (bucket_id = 'videos');

-- Create policy to allow authenticated users to upload
CREATE POLICY "Authenticated users can upload videos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'videos' AND auth.role() = 'authenticated');

-- Create policy to allow authenticated users to update their videos
CREATE POLICY "Authenticated users can update videos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'videos' AND auth.role() = 'authenticated');

-- Create policy to allow authenticated users to delete their videos
CREATE POLICY "Authenticated users can delete videos"
ON storage.objects FOR DELETE
USING (bucket_id = 'videos' AND auth.role() = 'authenticated');