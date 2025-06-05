import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Search, Filter, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import ContentPreview from "@/components/content-preview";
import { Link } from "wouter";

export default function ContentLibrary() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPlatform, setFilterPlatform] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  const { data: content = [], isLoading } = useQuery({
    queryKey: ["/api/content"],
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/analytics/stats"],
  });

  const filteredContent = content.filter((item: any) => {
    const matchesSearch = searchTerm === "" || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPlatform = filterPlatform === "all" || item.platform === filterPlatform;
    
    return matchesSearch && matchesPlatform;
  });

  const platforms = stats?.byPlatform ? Object.keys(stats.byPlatform) : [];

  return (
    <>
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-neutral-800">Content Library</h1>
              <p className="text-neutral-600">Manage and organize your generated content</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto">
          {/* Stats Bar */}
          {stats && (
            <div className="bg-white rounded-lg p-4 mb-6 border border-neutral-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-neutral-800">{stats.totalContent}</div>
                    <div className="text-sm text-neutral-600">Total Content</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-neutral-800">{stats.platforms}</div>
                    <div className="text-sm text-neutral-600">Platforms</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {Object.entries(stats.byPlatform).map(([platform, count]) => (
                    <Badge key={platform} variant="secondary">
                      {platform}: {count}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="bg-white rounded-lg p-4 mb-6 border border-neutral-200">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <Input
                    placeholder="Search content..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-neutral-600" />
                <Select value={filterPlatform} onValueChange={setFilterPlatform}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Platforms</SelectItem>
                    {platforms.map((platform) => (
                      <SelectItem key={platform} value={platform}>
                        {platform.charAt(0).toUpperCase() + platform.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="bg-white rounded-lg p-8 border border-neutral-200">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-neutral-600">Loading your content...</p>
              </div>
            </div>
          ) : filteredContent.length === 0 ? (
            <div className="bg-white rounded-lg p-8 border border-neutral-200">
              <div className="text-center">
                <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-neutral-400" />
                </div>
                <h3 className="text-lg font-medium text-neutral-800 mb-2">
                  {searchTerm || filterPlatform !== "all" ? "No matching content" : "No content yet"}
                </h3>
                <p className="text-neutral-600 mb-4">
                  {searchTerm || filterPlatform !== "all" 
                    ? "Try adjusting your search or filters"
                    : "Create your first piece of content to get started"
                  }
                </p>
                {(!searchTerm && filterPlatform === "all") && (
                  <Link href="/create">
                    <Button>Create Content</Button>
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <ContentPreview limit={undefined} />
          )}
        </div>
      </main>
    </>
  );
}
