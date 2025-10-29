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
    const sections = ['hero-left-1', 'hero-left-2', 'hero-left-3', 'hero-right-1', 'hero-right-2', 'hero-right-3'];
    const sectionVideos = sections.map(s => localStorage.getItem(`video_${s}`));
    
    return files.map((f) => {
      const { data } = supabase.storage.from(bucket).getPublicUrl(f.name);
      const url = data.publicUrl;
      
      const usedIn: string[] = [];
      sections.forEach((section, idx) => {
        if (url === sectionVideos[idx]) {
          const label = section.replace('hero-', 'Hero ').replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
          usedIn.push(label);
        }
      });
      
      return { ...f, publicUrl: url, usedIn } as typeof f & { publicUrl: string; usedIn: string[] };
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
    const sectionLabel = targetSection.replace('hero-', 'Hero ').replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
    toast.success(`Video applied to ${sectionLabel}. Refresh the homepage to see changes.`);
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
          <CardTitle>Apply Media to Website Sections</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Hero Left Column Slot 1 */}
            <Card className="p-4">
              <h3 className="font-semibold mb-2 text-sm">Hero - Left Column (Top)</h3>
              {selectedFile && (
                <div className="mb-2">
                  <video src={rows.find(r => r.name === selectedFile)?.publicUrl} className="w-full h-24 object-cover rounded" muted />
                </div>
              )}
              <Button 
                onClick={() => { setTargetSection("hero-left-1"); applyToSection(); }} 
                disabled={!selectedFile}
                className="w-full"
                size="sm"
              >
                <Check className="h-4 w-4 mr-2" /> Apply Here
              </Button>
            </Card>

            {/* Hero Left Column Slot 2 */}
            <Card className="p-4">
              <h3 className="font-semibold mb-2 text-sm">Hero - Left Column (Middle)</h3>
              {selectedFile && (
                <div className="mb-2">
                  <video src={rows.find(r => r.name === selectedFile)?.publicUrl} className="w-full h-24 object-cover rounded" muted />
                </div>
              )}
              <Button 
                onClick={() => { setTargetSection("hero-left-2"); applyToSection(); }} 
                disabled={!selectedFile}
                className="w-full"
                size="sm"
              >
                <Check className="h-4 w-4 mr-2" /> Apply Here
              </Button>
            </Card>

            {/* Hero Left Column Slot 3 */}
            <Card className="p-4">
              <h3 className="font-semibold mb-2 text-sm">Hero - Left Column (Bottom)</h3>
              {selectedFile && (
                <div className="mb-2">
                  <video src={rows.find(r => r.name === selectedFile)?.publicUrl} className="w-full h-24 object-cover rounded" muted />
                </div>
              )}
              <Button 
                onClick={() => { setTargetSection("hero-left-3"); applyToSection(); }} 
                disabled={!selectedFile}
                className="w-full"
                size="sm"
              >
                <Check className="h-4 w-4 mr-2" /> Apply Here
              </Button>
            </Card>

            {/* Hero Right Column Slot 1 */}
            <Card className="p-4">
              <h3 className="font-semibold mb-2 text-sm">Hero - Right Column (Top)</h3>
              {selectedFile && (
                <div className="mb-2">
                  <video src={rows.find(r => r.name === selectedFile)?.publicUrl} className="w-full h-24 object-cover rounded" muted />
                </div>
              )}
              <Button 
                onClick={() => { setTargetSection("hero-right-1"); applyToSection(); }} 
                disabled={!selectedFile}
                className="w-full"
                size="sm"
              >
                <Check className="h-4 w-4 mr-2" /> Apply Here
              </Button>
            </Card>

            {/* Hero Right Column Slot 2 */}
            <Card className="p-4">
              <h3 className="font-semibold mb-2 text-sm">Hero - Right Column (Middle)</h3>
              {selectedFile && (
                <div className="mb-2">
                  <video src={rows.find(r => r.name === selectedFile)?.publicUrl} className="w-full h-24 object-cover rounded" muted />
                </div>
              )}
              <Button 
                onClick={() => { setTargetSection("hero-right-2"); applyToSection(); }} 
                disabled={!selectedFile}
                className="w-full"
                size="sm"
              >
                <Check className="h-4 w-4 mr-2" /> Apply Here
              </Button>
            </Card>

            {/* Hero Right Column Slot 3 */}
            <Card className="p-4">
              <h3 className="font-semibold mb-2 text-sm">Hero - Right Column (Bottom)</h3>
              {selectedFile && (
                <div className="mb-2">
                  <video src={rows.find(r => r.name === selectedFile)?.publicUrl} className="w-full h-24 object-cover rounded" muted />
                </div>
              )}
              <Button 
                onClick={() => { setTargetSection("hero-right-3"); applyToSection(); }} 
                disabled={!selectedFile}
                className="w-full"
                size="sm"
              >
                <Check className="h-4 w-4 mr-2" /> Apply Here
              </Button>
            </Card>
          </div>
          
          {selectedFile && (
            <p className="text-sm text-muted-foreground text-center pt-4 border-t">
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
                <TableHead>Used In</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6}>No files yet</TableCell>
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
                  <TableCell>
                    {f.usedIn.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {f.usedIn.map(section => (
                          <span key={section} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                            {section}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">Not used</span>
                    )}
                  </TableCell>
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
