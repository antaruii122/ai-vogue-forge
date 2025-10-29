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
          <CardTitle>Hero Section - Media Slots</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <div className="h-1 w-1 rounded-full bg-primary"></div>
                Left Column (Scrolls Up)
              </h3>
              <div className="space-y-4">
                {['hero-left-1', 'hero-left-2', 'hero-left-3'].map((slot, idx) => {
                  const currentUrl = localStorage.getItem(`video_${slot}`);
                  const currentFile = rows.find(r => r.publicUrl === currentUrl);
                  return (
                    <Card key={slot} className="p-4 bg-muted/30">
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground mb-2">Slot {idx + 1}</p>
                          {currentUrl ? (
                            <div className="space-y-2">
                              <video src={currentUrl} className="w-full h-32 object-cover rounded border" muted loop autoPlay />
                              <p className="text-xs font-medium truncate">{currentFile?.name || 'Unknown'}</p>
                            </div>
                          ) : (
                            <div className="w-full h-32 rounded border-2 border-dashed border-border flex items-center justify-center bg-background">
                              <p className="text-sm text-muted-foreground">Empty</p>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button 
                            size="sm"
                            onClick={() => { setTargetSection(slot); applyToSection(); }}
                            disabled={!selectedFile}
                          >
                            {currentUrl ? 'Replace' : 'Set'}
                          </Button>
                          {currentUrl && (
                            <Button 
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                localStorage.removeItem(`video_${slot}`);
                                toast.success('Slot cleared');
                                fetchFiles();
                              }}
                            >
                              Clear
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Right Column */}
            <div>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <div className="h-1 w-1 rounded-full bg-primary"></div>
                Right Column (Scrolls Down)
              </h3>
              <div className="space-y-4">
                {['hero-right-1', 'hero-right-2', 'hero-right-3'].map((slot, idx) => {
                  const currentUrl = localStorage.getItem(`video_${slot}`);
                  const currentFile = rows.find(r => r.publicUrl === currentUrl);
                  return (
                    <Card key={slot} className="p-4 bg-muted/30">
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground mb-2">Slot {idx + 1}</p>
                          {currentUrl ? (
                            <div className="space-y-2">
                              <video src={currentUrl} className="w-full h-32 object-cover rounded border" muted loop autoPlay />
                              <p className="text-xs font-medium truncate">{currentFile?.name || 'Unknown'}</p>
                            </div>
                          ) : (
                            <div className="w-full h-32 rounded border-2 border-dashed border-border flex items-center justify-center bg-background">
                              <p className="text-sm text-muted-foreground">Empty</p>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button 
                            size="sm"
                            onClick={() => { setTargetSection(slot); applyToSection(); }}
                            disabled={!selectedFile}
                          >
                            {currentUrl ? 'Replace' : 'Set'}
                          </Button>
                          {currentUrl && (
                            <Button 
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                localStorage.removeItem(`video_${slot}`);
                                toast.success('Slot cleared');
                                fetchFiles();
                              }}
                            >
                              Clear
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
          
          {selectedFile && (
            <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
              <p className="text-sm font-medium">
                Currently selected: <span className="text-primary">{selectedFile}</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Click "Set" or "Replace" on any slot above to place this video
              </p>
            </div>
          )}
          {!selectedFile && (
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                Select a video from the table below to place it in a slot
              </p>
            </div>
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
