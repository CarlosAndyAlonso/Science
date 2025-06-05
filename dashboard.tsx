import { useQuery } from "@tanstack/react-query";
import { 
  FileText, 
  Bot, 
  Share2, 
  Heart, 
  TrendingUp,
  PlusCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ContentForm from "@/components/content-form";
import ContentPreview from "@/components/content-preview";
import { Link } from "wouter";

const platformTemplates = [
  {
    id: "youtube-tutorial",
    name: "YouTube Tutorial",
    description: "Step-by-step guide format",
    platform: "youtube",
    gradient: "from-red-500 to-red-600",
    icon: "fab fa-youtube",
  },
  {
    id: "instagram-carousel",
    name: "Instagram Carousel",
    description: "Multi-slide visual story",
    platform: "instagram",
    gradient: "from-pink-500 to-purple-600",
    icon: "fab fa-instagram",
  },
  {
    id: "twitter-thread",
    name: "Twitter Thread",
    description: "Multi-tweet storytelling",
    platform: "twitter",
    gradient: "from-blue-400 to-blue-500",
    icon: "fab fa-twitter",
  },
];

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/analytics/stats"],
  });

  const formatPercentage = (value: number, total: number) => {
    return total > 0 ? ((value / total) * 100).toFixed(1) : "0";
  };

  return (

      {/* Header */}
      <header className="bg-white border-b border-neutral-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-800">Dashboard</h1>
            <p className="text-neutral-600">Create amazing content for your social media platforms</p>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/create">
              <Button className="gradient-primary text-white">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Content
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-neutral-600 text-sm">Total Content</p>
                  <p className="text-2xl font-bold text-neutral-800">
                    {statsLoading ? "..." : stats?.totalContent || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <TrendingUp className="h-4 w-4 text-emerald-500 mr-1" />
                <span className="text-emerald-500">12%</span>
                <span className="text-neutral-600 ml-1">vs last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-neutral-600 text-sm">AI Generated</p>
                  <p className="text-2xl font-bold text-neutral-800">
                    {statsLoading ? "..." : stats?.aiGenerated || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <Bot className="h-6 w-6 text-secondary" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <TrendingUp className="h-4 w-4 text-emerald-500 mr-1" />
                <span className="text-emerald-500">
                  {stats ? formatPercentage(stats.aiGenerated, stats.totalContent) : "0"}%
                </span>
                <span className="text-neutral-600 ml-1">of total content</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-neutral-600 text-sm">Platforms</p>
                  <p className="text-2xl font-bold text-neutral-800">
                    {statsLoading ? "..." : stats?.platforms || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center">
                  <Share2 className="h-6 w-6 text-cyan-500" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <TrendingUp className="h-4 w-4 text-emerald-500 mr-1" />
                <span className="text-emerald-500">
                  {stats?.platforms ? Math.min(stats.platforms, 2) : 0}
                </span>
                <span className="text-neutral-600 ml-1">new this month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-neutral-600 text-sm">Engagement</p>
                  <p className="text-2xl font-bold text-neutral-800">94.2%</p>
                </div>
                <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                  <Heart className="h-6 w-6 text-emerald-500" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <TrendingUp className="h-4 w-4 text-emerald-500 mr-1" />
                <span className="text-emerald-500">5.3%</span>
                <span className="text-neutral-600 ml-1">vs last month</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Creation Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Quick Create */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Create</CardTitle>
            </CardHeader>
            <CardContent>
              <ContentForm />
            </CardContent>
          </Card>

          {/* Recent Creations */}
          <ContentPreview limit={3} />
        </div>

        {/* Platform Templates */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Platform Templates</CardTitle>
              <Button variant="ghost">View All</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {platformTemplates.map((template) => (
                <div key={template.id} className="group cursor-pointer">
                  <div className={`bg-gradient-to-br ${template.gradient} rounded-lg p-6 text-white mb-3 group-hover:shadow-lg transition-all`}>
                    <i className={`${template.icon} text-2xl mb-3`} />
                    <h4 className="font-semibold">{template.name}</h4>
                    <p className="text-sm opacity-90">{template.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}