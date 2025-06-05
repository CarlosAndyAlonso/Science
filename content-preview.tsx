import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Eye, Download, RefreshCw, Calendar, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import type { Content } from "@shared/schema";

interface ContentPreviewProps {
  limit?: number;
  showActions?: boolean;
}

export default function ContentPreview({ limit = 3, showActions = true }: ContentPreviewProps) {
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);

  const { data: content = [], isLoading } = useQuery({
    queryKey: ["/api/content"],
  });

  const recentContent = limit ? content.slice(0, limit) : content;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPlatformColor = (platform: string) => {
    const colors = {
      youtube: "bg-red-100 text-red-700",
      instagram: "bg-pink-100 text-pink-700",
      twitter: "bg-blue-100 text-blue-700",
      facebook: "bg-blue-100 text-blue-600",
      linkedin: "bg-blue-100 text-blue-800",
      tiktok: "bg-gray-100 text-gray-700",
    };
    return colors[platform as keyof typeof colors] || "bg-gray-100 text-gray-700";
  };

  const handleExport = (content: Content) => {
    const blob = new Blob([content.generatedContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${content.title.replace(/[^a-z0-9]/gi, "_")}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Creations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-neutral-200 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-neutral-200 rounded w-3/4" />
                    <div className="h-3 bg-neutral-200 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Creations</CardTitle>
      </CardHeader>
      <CardContent>
        {recentContent.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Share2 className="h-8 w-8 text-neutral-400" />
            </div>
            <h3 className="text-lg font-medium text-neutral-800 mb-2">No content yet</h3>
            <p className="text-neutral-600">Create your first piece of content to see it here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentContent.map((item) => (
              <div
                key={item.id}
                className="flex items-center space-x-4 p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-medium">
                    {item.platform.slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-neutral-800">{item.title}</h4>
                  <p className="text-sm text-neutral-600 line-clamp-1">{item.description}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge className={getPlatformColor(item.platform)}>
                      {item.platform}
                    </Badge>
                    <span className="text-xs text-neutral-500 flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(item.createdAt)}
                    </span>
                  </div>
                </div>
                {showActions && (
                  <div className="flex items-center space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedContent(item)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="flex items-center justify-between">
                            <span>{item.title}</span>
                            <div className="flex items-center space-x-2">
                              <Badge className={getPlatformColor(item.platform)}>
                                {item.platform}
                              </Badge>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleExport(item)}
                              >
                                <Download className="h-4 w-4 mr-1" />
                                Export
                              </Button>
                            </div>
                          </DialogTitle>
                        </DialogHeader>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-medium text-neutral-800 mb-3">Generated Content</h4>
                            <Textarea
                              value={item.generatedContent}
                              readOnly
                              className="min-h-[300px] resize-none"
                            />
                            <div className="mt-4 text-sm text-neutral-600">
                              <p><strong>Words:</strong> {item.metadata?.wordCount || 0}</p>
                              <p><strong>Characters:</strong> {item.metadata?.characterCount || 0}</p>
                              <p><strong>Tone:</strong> {item.metadata?.tone || "Not specified"}</p>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium text-neutral-800 mb-3">Content Details</h4>
                            <div className="bg-neutral-50 rounded-lg p-4 space-y-3">
                              <div>
                                <label className="text-sm font-medium text-neutral-700">Brief</label>
                                <p className="text-sm text-neutral-600 mt-1">{item.brief}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-neutral-700">Content Type</label>
                                <p className="text-sm text-neutral-600 mt-1">{item.contentType}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-neutral-700">Target Audience</label>
                                <p className="text-sm text-neutral-600 mt-1">
                                  {item.metadata?.targetAudience || "General audience"}
                                </p>
                              </div>
                              {item.metadata?.estimatedDuration && (
                                <div>
                                  <label className="text-sm font-medium text-neutral-700">Estimated Duration</label>
                                  <p className="text-sm text-neutral-600 mt-1">{item.metadata.estimatedDuration}</p>
                                </div>
                              )}
  </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleExport(item)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {showActions && recentContent.length > 0 && (
          <div className="mt-6">
            <Button variant="outline" className="w-full">
              View All Content
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}