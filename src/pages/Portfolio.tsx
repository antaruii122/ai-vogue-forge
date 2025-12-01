import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Grid3x3, List, Download, Trash2, Eye, Plus, Image as ImageIcon, Video, Package } from "lucide-react";
import { motion } from "framer-motion";

// Mock data structure
const mockPortfolioItems = [
  {
    id: "1",
    user_id: "user_123",
    project_name: "Summer Collection",
    tool_type: "Fashion Photography",
    image_url: "/placeholder.svg",
    created_at: "2024-11-15T10:30:00Z",
  },
  {
    id: "2",
    user_id: "user_123",
    project_name: "Product Launch Video",
    tool_type: "Video Generation",
    image_url: "/placeholder.svg",
    created_at: "2024-11-10T14:20:00Z",
  },
  {
    id: "3",
    user_id: "user_123",
    project_name: "Brand Photoshoot",
    tool_type: "Product Photography",
    image_url: "/placeholder.svg",
    created_at: "2024-11-05T09:15:00Z",
  },
];

const Portfolio = () => {
  const { user, isLoaded } = useUser();
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterTool, setFilterTool] = useState<string>("all");
  const [portfolioItems, setPortfolioItems] = useState(mockPortfolioItems);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");

  const handleCreateProject = () => {
    if (!newProjectName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a project name",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Project Created",
      description: `"${newProjectName}" has been created`,
    });
    setNewProjectName("");
    setIsCreateModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    setPortfolioItems(portfolioItems.filter(item => item.id !== id));
    toast({
      title: "Deleted",
      description: `"${name}" has been removed`,
    });
  };

  const handleDownload = (name: string) => {
    toast({
      title: "Downloading",
      description: `"${name}" is being downloaded`,
    });
  };

  const filteredItems = filterTool === "all" 
    ? portfolioItems 
    : portfolioItems.filter(item => item.tool_type.toLowerCase().includes(filterTool.toLowerCase()));

  const getToolIcon = (toolType: string) => {
    if (toolType.includes("Fashion")) return <ImageIcon className="h-4 w-4" />;
    if (toolType.includes("Video")) return <Video className="h-4 w-4" />;
    return <Package className="h-4 w-4" />;
  };

  if (!isLoaded) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 p-8"
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-heading font-bold text-white mb-2">My Portfolio</h1>
              <p className="text-muted-foreground">View and manage your generated content</p>
            </div>
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Project
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-900 border-gray-700">
                <DialogHeader>
                  <DialogTitle className="text-white">Create New Project</DialogTitle>
                  <DialogDescription className="text-muted-foreground">
                    Give your project a name to organize your content
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="project-name">Project Name</Label>
                    <Input
                      id="project-name"
                      placeholder="e.g., Summer Campaign 2024"
                      value={newProjectName}
                      onChange={(e) => setNewProjectName(e.target.value)}
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateProject} className="bg-gradient-to-r from-purple-600 to-pink-600">
                    Create
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Filters and View Toggle */}
          <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-48">
                <Select value={filterTool} onValueChange={setFilterTool}>
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue placeholder="Filter by tool" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="all">All Projects</SelectItem>
                    <SelectItem value="fashion">Fashion Photography</SelectItem>
                    <SelectItem value="video">Video Generation</SelectItem>
                    <SelectItem value="product">Product Photography</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "grid" | "list")}>
              <TabsList className="bg-gray-800 border border-gray-700">
                <TabsTrigger value="grid" className="data-[state=active]:bg-gray-700">
                  <Grid3x3 className="h-4 w-4 mr-2" />
                  Grid
                </TabsTrigger>
                <TabsTrigger value="list" className="data-[state=active]:bg-gray-700">
                  <List className="h-4 w-4 mr-2" />
                  List
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Content */}
          {filteredItems.length === 0 ? (
            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
              <CardContent className="flex flex-col items-center justify-center py-20">
                <div className="rounded-full bg-gray-800 p-6 mb-6">
                  <ImageIcon className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-2">No content yet</h3>
                <p className="text-muted-foreground mb-6">Start creating your first project!</p>
                <Button asChild className="bg-gradient-to-r from-purple-600 to-pink-600">
                  <a href="/tools/fashion-photography">Get Started</a>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className={viewMode === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
              : "space-y-4"
            }>
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 overflow-hidden group hover:border-purple-500/50 transition-all duration-300">
                    <CardContent className="p-0">
                      {viewMode === "grid" ? (
                        <>
                          <div className="aspect-[3/4] relative overflow-hidden bg-gray-800">
                            <img 
                              src={item.image_url} 
                              alt={item.project_name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                              <Button
                                size="icon"
                                variant="outline"
                                className="bg-white/10 border-white/20 hover:bg-white/20"
                                onClick={() => handleDownload(item.project_name)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="outline"
                                className="bg-white/10 border-white/20 hover:bg-white/20"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="outline"
                                className="bg-white/10 border-white/20 hover:bg-red-500/20"
                                onClick={() => handleDelete(item.id, item.project_name)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="p-4">
                            <h3 className="font-semibold text-white mb-1 truncate">{item.project_name}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                              {getToolIcon(item.tool_type)}
                              <span className="truncate">{item.tool_type}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {new Date(item.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center gap-4 p-4">
                          <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
                            <img 
                              src={item.image_url} 
                              alt={item.project_name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-white mb-1 truncate">{item.project_name}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              {getToolIcon(item.tool_type)}
                              <span>{item.tool_type}</span>
                              <span>•</span>
                              <span>{new Date(item.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="icon"
                              variant="outline"
                              className="border-gray-700 hover:bg-gray-800"
                              onClick={() => handleDownload(item.project_name)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="outline"
                              className="border-gray-700 hover:bg-gray-800"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="outline"
                              className="border-gray-700 hover:bg-red-500/20"
                              onClick={() => handleDelete(item.id, item.project_name)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </AppLayout>
  );
};

export default Portfolio;
