import React from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePermissions } from "@/hooks/use-permissions";
import { Navigate } from "react-router-dom";
import { BarChart, LineChart, PieChart } from "recharts";
import { 
  Users, Server, FileText, Activity, FileCheck2, 
  Clock, ArrowUpRight, Video, BookOpen, FileUp,
  BrainCircuit, TrendingUp, AlertTriangle, CheckCircle, 
  AlertCircle, CheckCircle2, Images, FileVideo, FilePlus2,
  BookOpenCheck, FileImage, FileText2, Marketing
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock data for content trends
const contentTrendData = {
  videos: [
    { id: 1, title: "Adella Laser Application Demo", views: 452, thumbnail: "https://picsum.photos/seed/video1/120/80" },
    { id: 2, title: "Hipro FAQ and Tutorial", views: 387, thumbnail: "https://picsum.photos/seed/video2/120/80" },
    { id: 3, title: "Ultralift Before & After", views: 311, thumbnail: "https://picsum.photos/seed/video3/120/80" },
    { id: 4, title: "Advanced Treatment Techniques", views: 278, thumbnail: "https://picsum.photos/seed/video4/120/80" },
  ],
  scripts: [
    { id: 1, title: "Clinical Benefits of Adella", views: 234, thumbnail: "https://picsum.photos/seed/script1/120/80" },
    { id: 2, title: "Customer Testimonial Structure", views: 198, thumbnail: "https://picsum.photos/seed/script2/120/80" },
    { id: 3, title: "Product Comparison Script", views: 176, thumbnail: "https://picsum.photos/seed/script3/120/80" },
    { id: 4, title: "Treatment Results Script", views: 145, thumbnail: "https://picsum.photos/seed/script4/120/80" },
  ],
  files: [
    { id: 1, title: "Treatment Protocol Guide PDF", downloads: 187, thumbnail: "https://picsum.photos/seed/file1/120/80" },
    { id: 2, title: "Clinical Research Paper", downloads: 154, thumbnail: "https://picsum.photos/seed/file2/120/80" },
    { id: 3, title: "Patient Consent Forms", downloads: 132, thumbnail: "https://picsum.photos/seed/file3/120/80" },
    { id: 4, title: "Technical Specifications", downloads: 119, thumbnail: "https://picsum.photos/seed/file4/120/80" },
  ],
  aiModules: [
    { id: 1, title: "Script Generator", usage: 543, thumbnail: "https://picsum.photos/seed/ai1/120/80" },
    { id: 2, title: "Idea Validator", usage: 412, thumbnail: "https://picsum.photos/seed/ai2/120/80" },
    { id: 3, title: "Content Planner", usage: 387, thumbnail: "https://picsum.photos/seed/ai3/120/80" },
    { id: 4, title: "Document Analyzer", usage: 289, thumbnail: "https://picsum.photos/seed/ai4/120/80" },
  ]
};

// Mock data for user behavior
const userBehaviorData = {
  topActions: [
    { action: "Generate Script", count: 1245 },
    { action: "Download Video", count: 876 },
    { action: "Validate Idea", count: 743 },
    { action: "Create Content Plan", count: 621 },
    { action: "Access Documents", count: 512 },
  ],
  frequentBriefs: [
    { brief: "Product demonstration videos", count: 234 },
    { brief: "Before & after results", count: 187 },
    { brief: "Client testimonials", count: 164 },
    { brief: "Treatment explanations", count: 143 },
    { brief: "Technical specifications", count: 98 },
  ],
  platforms: [
    { platform: "Instagram", percentage: 42 },
    { platform: "TikTok", percentage: 27 },
    { platform: "YouTube", percentage: 18 },
    { platform: "Facebook", percentage: 13 },
  ],
};

// Mock data for system health
const systemHealthData = {
  bugs: [
    { id: 1, title: "Video player loading issue", occurrences: 12, status: "investigating", severity: "medium" },
    { id: 2, title: "PDF download timeout", occurrences: 8, status: "resolved", severity: "low" },
    { id: 3, title: "Script generation error", occurrences: 5, status: "fixed", severity: "high" },
    { id: 4, title: "Content planner blank screen", occurrences: 3, status: "investigating", severity: "high" },
  ],
  aiModules: [
    { module: "Script Generator", status: "active" },
    { module: "Idea Validator", status: "active" },
    { module: "Content Planner", status: "active" },
    { module: "Document Analyzer", status: "inactive" },
    { module: "Strategy Assistant", status: "maintenance" },
  ],
  integrations: [
    { name: "OpenAI API", status: "active" },
    { name: "Vimeo Integration", status: "active" },
    { name: "Calendar API", status: "warning" },
    { name: "Storage Service", status: "active" },
  ],
};

// Mock recommendations
const recommendations = [
  { type: "video", title: "Quick-start guide for new Hipro users", reason: "High search volume, low content coverage" },
  { type: "pdf", title: "Comparison chart of treatment protocols", reason: "Most requested by new users" },
  { type: "script", title: "Clinical results explanations", reason: "High engagement on similar content" },
  { type: "equipment", title: "Ultralift troubleshooting guide", reason: "Common support tickets" },
];

const AdminDashboard: React.FC = () => {
  const { isAdmin } = usePermissions();
  
  // If not admin, redirect to dashboard
  if (!isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  // Links para gerenciamento de conteúdo
  const contentManagementLinks = [
    { title: "Vídeos", description: "Gerenciar vídeos para download", icon: FileVideo, path: "/admin/content?tab=videos" },
    { title: "Artigos Científicos", description: "Gerenciar artigos científicos", icon: BookOpenCheck, path: "/admin/content?tab=articles" },
    { title: "Fotos & Imagens", description: "Gerenciar banco de imagens", icon: FileImage, path: "/admin/content?tab=images" },
    { title: "Materiais de Marketing", description: "Gerenciar materiais promocionais", icon: FileText2, path: "/admin/content?tab=materials" }
  ];

  return (
    <Layout title="Admin Dashboard">
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            System insights, content trends, and platform analytics
          </p>
        </div>
        
        {/* Status Overview Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">142</div>
                <Users className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-600">↑ 12%</span> from last week
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Content Created</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">3,842</div>
                <FileText className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-600">↑ 8%</span> from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">AI Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">72%</div>
                <BrainCircuit className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Of monthly tokens consumed</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">System Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-green-600">Healthy</div>
                <Server className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">3 minor alerts</p>
            </CardContent>
          </Card>
        </div>

        {/* Content Management Quick Access */}
        <h2 className="text-xl font-bold mb-4 mt-8">Gerenciamento de Conteúdo</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {contentManagementLinks.map((link, index) => (
            <Card key={index} className="hover:shadow-md transition-all">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center gap-3 mb-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <link.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-center">{link.title}</h3>
                  <p className="text-xs text-muted-foreground text-center">{link.description}</p>
                </div>
                <Button variant="outline" className="w-full" size="sm" asChild>
                  <Link to={link.path}>
                    Gerenciar <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Content Trend Panels */}
        <h2 className="text-xl font-bold mb-4">Content Trends</h2>
        <Tabs defaultValue="7days" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="7days">Last 7 Days</TabsTrigger>
            <TabsTrigger value="30days">Last 30 Days</TabsTrigger>
          </TabsList>
          <TabsContent value="7days">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Most Downloaded Videos */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Most Downloaded Videos</CardTitle>
                    <Video className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <CardDescription>Top performing video content</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {contentTrendData.videos.map(video => (
                      <div key={video.id} className="flex items-center gap-3">
                        <img 
                          src={video.thumbnail} 
                          alt={video.title}
                          className="h-12 w-16 object-cover rounded" 
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium truncate">{video.title}</h4>
                          <p className="text-xs text-muted-foreground">{video.views} views</p>
                        </div>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Most Accessed Scripts */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Most Accessed Scripts</CardTitle>
                    <BookOpen className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <CardDescription>Popular script templates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {contentTrendData.scripts.map(script => (
                      <div key={script.id} className="flex items-center gap-3">
                        <div className="h-12 w-16 bg-muted rounded flex items-center justify-center">
                          <FileText className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium truncate">{script.title}</h4>
                          <p className="text-xs text-muted-foreground">{script.views} views</p>
                        </div>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Most Downloaded Files */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Most Downloaded Files</CardTitle>
                    <FileUp className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <CardDescription>Popular documents and resources</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {contentTrendData.files.map(file => (
                      <div key={file.id} className="flex items-center gap-3">
                        <div className="h-12 w-16 bg-muted rounded flex items-center justify-center">
                          <FileText className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium truncate">{file.title}</h4>
                          <p className="text-xs text-muted-foreground">{file.downloads} downloads</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Most Used AI Modules */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Most Used AI Modules</CardTitle>
                    <BrainCircuit className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <CardDescription>Popular AI features</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {contentTrendData.aiModules.map(module => (
                      <div key={module.id} className="flex items-center gap-3">
                        <div className="h-12 w-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded flex items-center justify-center">
                          <BrainCircuit className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium truncate">{module.title}</h4>
                          <p className="text-xs text-muted-foreground">{module.usage} uses</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="30days">
            <div className="p-8 text-center text-muted-foreground">
              <p>30-day trend data would appear here with similar structure but different values</p>
            </div>
          </TabsContent>
        </Tabs>

        {/* User Behavior Insights */}
        <h2 className="text-xl font-bold mb-4">User Behavior Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Top Actions Performed */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Top Actions</CardTitle>
              <CardDescription>Most frequent user activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userBehaviorData.topActions.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm">{item.action}</span>
                    <span className="text-sm font-medium">{item.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Most Frequent Briefs */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Common Brief Requests</CardTitle>
              <CardDescription>Frequent content needs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userBehaviorData.frequentBriefs.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm truncate max-w-[70%]">{item.brief}</span>
                    <span className="text-sm font-medium">{item.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Most Requested Platforms */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Most Requested Platforms</CardTitle>
              <CardDescription>Popular social platforms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userBehaviorData.platforms.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm">{item.platform}</span>
                    <div className="flex items-center">
                      <div className="w-32 h-2 bg-muted rounded-full mr-2 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{item.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Internal Recommendations */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-[#0094fb] to-[#f300fc] p-0.5 rounded-xl mb-6">
            <div className="bg-card p-6 rounded-[calc(0.75rem-1px)]">
              <h2 className="text-xl font-bold mb-4">What Should Fluida Produce Next?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {recommendations.map((rec, index) => (
                  <Card key={index} className="bg-muted/50">
                    <CardContent className="pt-6">
                      <div className="mb-2">
                        {rec.type === "video" && <Video className="h-10 w-10 text-[#0094fb] mb-2" />}
                        {rec.type === "pdf" && <FileText className="h-10 w-10 text-[#0094fb] mb-2" />}
                        {rec.type === "script" && <BookOpen className="h-10 w-10 text-[#0094fb] mb-2" />}
                        {rec.type === "equipment" && <Server className="h-10 w-10 text-[#0094fb] mb-2" />}
                      </div>
                      <h3 className="font-semibold mb-1">{rec.title}</h3>
                      <p className="text-xs text-muted-foreground">{rec.reason}</p>
                      <div className="mt-4">
                        <Button variant="outline" size="sm" className="w-full">
                          Create
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* System Health & Diagnostics */}
        <h2 className="text-xl font-bold mb-4">System Health & Diagnostics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Bug Logs */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Bug Logs</CardTitle>
                <AlertTriangle className="h-5 w-5 text-amber-500" />
              </div>
              <CardDescription>Recent errors and issues</CardDescription>
            </CardHeader>
            <CardContent className="max-h-80 overflow-y-auto">
              <div className="space-y-4">
                {systemHealthData.bugs.map((bug) => (
                  <div key={bug.id} className="border rounded-lg p-3">
                    <div className="flex justify-between">
                      <h4 className="font-medium text-sm">{bug.title}</h4>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        bug.severity === "high" 
                          ? "bg-red-100 text-red-700" 
                          : bug.severity === "medium"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-green-100 text-green-700"
                      }`}>
                        {bug.severity}
                      </span>
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className="text-xs text-muted-foreground">{bug.occurrences} occurrences</span>
                      <span className={`text-xs ${
                        bug.status === "resolved" || bug.status === "fixed"
                          ? "text-green-600"
                          : "text-amber-600"
                      }`}>
                        {bug.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="ghost" size="sm" className="mt-4 w-full">
                View Full Log
              </Button>
            </CardContent>
          </Card>
          
          {/* AI Modules Status */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">AI Module Status</CardTitle>
                <BrainCircuit className="h-5 w-5 text-[#0094fb]" />
              </div>
              <CardDescription>Module availability</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {systemHealthData.aiModules.map((module, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm">{module.module}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      module.status === "active" 
                        ? "bg-green-100 text-green-700" 
                        : module.status === "inactive"
                          ? "bg-red-100 text-red-700"
                          : "bg-amber-100 text-amber-700"
                    } flex items-center gap-1`}>
                      {module.status === "active" && <CheckCircle className="h-3 w-3" />}
                      {module.status === "inactive" && <AlertCircle className="h-3 w-3" />}
                      {module.status === "maintenance" && <Clock className="h-3 w-3" />}
                      {module.status}
                    </span>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="mt-6 w-full" asChild>
                <a href="/admin/system-intelligence">
                  Manage AI Modules
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
          
          {/* Integration Status */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Integration Status</CardTitle>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plug-2 text-muted-foreground"><path d="M9 2v6"/><path d="M15 2v6"/><path d="M12 17v5"/><path d="M5 8h14"/><path d="M6 11V8h12v3a6 6 0 1 1-12 0v0z"/></svg>
              </div>
              <CardDescription>External connections</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {systemHealthData.integrations.map((integration, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm">{integration.name}</span>
                    <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${
                      integration.status === "active" 
                        ? "bg-green-100 text-green-700" 
                        : integration.status === "warning"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-red-100 text-red-700"
                    }`}>
                      {integration.status === "active" && <CheckCircle2 className="h-3 w-3" />}
                      {integration.status === "warning" && <AlertTriangle className="h-3 w-3" />}
                      {integration.status === "inactive" && <AlertCircle className="h-3 w-3" />}
                      {integration.status}
                    </span>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="mt-6 w-full" asChild>
                <a href="/admin/integrations">
                  Manage Integrations
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
