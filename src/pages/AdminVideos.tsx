import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Trash2, Upload as UploadIcon, RefreshCcw, ExternalLink, ArrowLeft } from "lucide-react";

const AdminVideos = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState<Array<{ name: string; created_at?: string; updated_at?: string; id?: string; size?: number }>>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [targetSection, setTargetSection] = useState<string>("hero-left-1");

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
      toast.message('Select a file to upload');
      return;
    }
    
    // Detect content type
    let contentType = file.type;
    if (!contentType) {
      if (file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
        contentType = 'image/' + file.name.split('.').pop()?.toLowerCase();
      } else if (file.name.match(/\.(mp4|webm|mov)$/i)) {
        contentType = 'video/' + file.name.split('.').pop()?.toLowerCase();
      }
    }
    
    setUploading(true);
    const { error } = await supabase.storage.from(bucket).upload(file.name, file, {
      cacheControl: '3600',
      upsert: true,
      contentType: contentType || 'application/octet-stream',
    });
    setUploading(false);
    if (error) {
      console.error(error);
      toast.error(error.message || 'Upload failed');
      return;
    }
    toast.success(file.type.startsWith('image/') ? 'Image uploaded' : 'Video uploaded');
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
    const sections = [
      'hero-left-1', 'hero-left-2', 'hero-left-3',
      'hero-right-1', 'hero-right-2', 'hero-right-3',
      'fashion-feature', 'video-feature', 'product-feature',
      'comparison-original', 'comparison-ours', 'comparison-competitor'
    ];
    const sectionVideos = sections.map(s => localStorage.getItem(`video_${s}`));
    
    return files.map((f) => {
      const { data } = supabase.storage.from(bucket).getPublicUrl(f.name);
      const url = data.publicUrl;
      
      const usedIn: string[] = [];
      sections.forEach((section, idx) => {
        if (url === sectionVideos[idx]) {
          const label = section
            .replace('hero-', 'Hero ')
            .replace('feature', 'Feature')
            .replace('comparison-', 'Compare ')
            .replace(/-/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());
          usedIn.push(label);
        }
      });
      
      return { ...f, publicUrl: url, usedIn } as typeof f & { publicUrl: string; usedIn: string[] };
    });
  }, [files]);

  const applyToSection = (slot: string) => {
    if (!selectedFile) {
      toast.message("Select a video first");
      return;
    }
    const url = rows.find(r => r.name === selectedFile)?.publicUrl;
    if (!url) {
      toast.error("File not found");
      return;
    }
    const bustedUrl = `${url}${url.includes('?') ? '&' : '?'}v=${Date.now()}`;
    localStorage.setItem(`video_${slot}`, bustedUrl);
    const sectionLabel = slot.replace('hero-', 'Hero ').replace('feature', 'Feature').replace('comparison-', 'Compare ').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    toast.success(`Applied to ${sectionLabel}. Refresh homepage to see changes.`);
    fetchFiles();
  };

  const clearSlot = (slot: string) => {
    localStorage.removeItem(`video_${slot}`);
    toast.success('Slot cleared');
    fetchFiles();
  };

  const renderSlotCard = (slot: string, label: string) => {
    const currentUrl = localStorage.getItem(`video_${slot}`);
    const currentFile = rows.find(r => r.publicUrl === currentUrl);
    const isImage = currentFile?.name.match(/\.(jpg|jpeg|png|gif|webp)$/i);
    
    return (
      <Card className="p-4 bg-muted/30">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <p className="text-xs text-muted-foreground mb-2">{label}</p>
            {currentUrl ? (
              <div className="space-y-2">
                {isImage ? (
                  <img src={currentUrl} className="w-full h-32 object-cover rounded border" alt={currentFile?.name} />
                ) : (
                  <video src={currentUrl} className="w-full h-32 object-cover rounded border" muted loop autoPlay />
                )}
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
              onClick={() => applyToSection(slot)}
              disabled={!selectedFile}
            >
              {currentUrl ? 'Replace' : 'Set'}
            </Button>
            {currentUrl && (
              <>
                <Button 
                  size="sm"
                  variant="outline"
                  onClick={() => clearSlot(slot)}
                >
                  Clear
                </Button>
                <Button 
                  size="sm"
                  variant="secondary"
                  onClick={() => applyToSection(slot)}
                >
                  Apply
                </Button>
              </>
            )}
          </div>
        </div>
      </Card>
    );
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
          <CardTitle>Upload & Manage Media</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <Input type="file" accept="video/*,image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="max-w-xs" />
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

      <Accordion type="multiple" defaultValue={["hero", "features", "comparison"]} className="mb-8">
        <AccordionItem value="hero">
          <AccordionTrigger className="text-lg font-semibold px-6">
            Hero Section (6 slots)
          </AccordionTrigger>
          <AccordionContent>
            <Card className="border-0 shadow-none">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-semibold mb-4">Left Column (Scrolls Up)</h3>
                    <div className="space-y-4">
                      {renderSlotCard('hero-left-1', 'Slot 1 - Top')}
                      {renderSlotCard('hero-left-2', 'Slot 2 - Middle')}
                      {renderSlotCard('hero-left-3', 'Slot 3 - Bottom')}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-4">Right Column (Scrolls Down)</h3>
                    <div className="space-y-4">
                      {renderSlotCard('hero-right-1', 'Slot 1 - Top')}
                      {renderSlotCard('hero-right-2', 'Slot 2 - Middle')}
                      {renderSlotCard('hero-right-3', 'Slot 3 - Bottom')}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="features">
          <AccordionTrigger className="text-lg font-semibold px-6">
            Feature Sections (3 slots)
          </AccordionTrigger>
          <AccordionContent>
            <Card className="border-0 shadow-none">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {renderSlotCard('fashion-feature', 'AI Fashion Photography')}
                  {renderSlotCard('video-feature', 'AI Video Generation')}
                  {renderSlotCard('product-feature', 'AI Product Photography')}
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="comparison">
          <AccordionTrigger className="text-lg font-semibold px-6">
            Comparison Section (3 slots)
          </AccordionTrigger>
          <AccordionContent>
            <Card className="border-0 shadow-none">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {renderSlotCard('comparison-original', 'Original Product')}
                  {renderSlotCard('comparison-ours', 'AI Fashion Studio')}
                  {renderSlotCard('comparison-competitor', 'Competitor Result')}
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {selectedFile && (
        <div className="mb-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
          <p className="text-sm font-medium">
            Currently selected: <span className="text-primary">{selectedFile}</span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Click "Set" or "Replace" on any slot above to place this media
          </p>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Media Files</CardTitle>
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
