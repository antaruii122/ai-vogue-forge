import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Trash2, Upload as UploadIcon, RefreshCcw, ExternalLink, Check, ArrowLeft } from "lucide-react";

const AdminVideos = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState<Array<{ name: string; created_at?: string; updated_at?: string; id?: string; size?: number }>>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [targetSection, setTargetSection] = useState<string>("hero");

  const bucket = 'videos';

  const fetchFiles = async () => {
    setLoading(true);
    const { data, error } = await supabase.storage.from(bucket).list('', { limit: 100, sortBy: { column: 'created_at', order: 'desc' } });
    setLoading(false);
    if (error) {
      console.error(error);
      toast.error('Failed to load videos');
      return;
    }
    setFiles(data || []);
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const onUpload = async () => {
    if (!file) {
      toast.message('Select a video to upload');
      return;
    }
    setUploading(true);
    const { error } = await supabase.storage.from(bucket).upload(file.name, file, {
      cacheControl: '3600',
      upsert: true,
      contentType: file.type || 'video/mp4',
    });
    setUploading(false);
    if (error) {
      console.error(error);
      toast.error(error.message || 'Upload failed');
      return;
    }
    toast.success('Video uploaded');
    setFile(null);
    await fetchFiles();
  };

  const onDelete = async (name: string) => {
    if (!confirm(`Delete ${name}?`)) return;
    const { error } = await supabase.storage.from(bucket).remove([name]);
    if (error) {
      console.error(error);
      toast.error('Delete failed');
      return;
    }
    toast.success('Video deleted');
    await fetchFiles();
  };

  const rows = useMemo(() => {
    return files.map((f) => {
      const { data } = supabase.storage.from(bucket).getPublicUrl(f.name);
      return { ...f, publicUrl: data.publicUrl } as typeof f & { publicUrl: string };
    });
  }, [files]);

  const applyToSection = () => {
    if (!selectedFile) {
      toast.message("Select a video first");
      return;
    }
    const url = rows.find(r => r.name === selectedFile)?.publicUrl;
    if (!url) {
      toast.error("File not found");
      return;
    }
    
    // Store the selection in localStorage
    localStorage.setItem(`video_${targetSection}`, url);
    toast.success(`Video applied to ${targetSection} section. Refresh the homepage to see changes.`);
  };

  return (
    <main className="container mx-auto px-4 py-10">
      <Button 
        variant="outline" 
        onClick={() => navigate("/")} 
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
      </Button>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Videos Manager</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <Input type="file" accept="video/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="max-w-xs" />
          <div className="flex gap-2">
            <Button onClick={onUpload} disabled={uploading || !file}>
              <UploadIcon className="h-4 w-4 mr-2" /> {uploading ? 'Uploading...' : 'Upload'}
            </Button>
            <Button variant="outline" onClick={fetchFiles} disabled={loading}>
              <RefreshCcw className="h-4 w-4 mr-2" /> Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Apply Video to Website Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Select value={targetSection} onValueChange={setTargetSection}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Select section" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hero">Hero Section</SelectItem>
                <SelectItem value="gallery1">Gallery Slot 1</SelectItem>
                <SelectItem value="gallery2">Gallery Slot 2</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={applyToSection} disabled={!selectedFile}>
              <Check className="h-4 w-4 mr-2" /> Apply to {targetSection}
            </Button>
          </div>
          {selectedFile && (
            <p className="text-sm text-muted-foreground">
              Selected: <span className="font-medium">{selectedFile}</span>
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Files in videos bucket</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Select</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Size (bytes)</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5}>No files yet</TableCell>
                </TableRow>
              )}
              {rows.map((f) => (
                <TableRow 
                  key={f.name}
                  className={selectedFile === f.name ? "bg-primary/10" : ""}
                >
                  <TableCell>
                    <input
                      type="radio"
                      name="selectedFile"
                      checked={selectedFile === f.name}
                      onChange={() => setSelectedFile(f.name)}
                      className="h-4 w-4 cursor-pointer"
                    />
                  </TableCell>
                  <TableCell className="font-medium break-all">
                    <a href={f.publicUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:underline">
                      {f.name}
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </TableCell>
                  <TableCell>{f.created_at ? new Date(f.created_at).toLocaleString() : '-'}</TableCell>
                  <TableCell>{typeof f.size === 'number' ? f.size : '-'}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="destructive" size="sm" onClick={() => onDelete(f.name)}>
                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
};

export default AdminVideos;
