import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { usePermissions } from "@/hooks/use-permissions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScriptResponse, CalendarSuggestion } from "@/utils/api";
import ScriptCard from "@/components/ScriptCard";
import { useToast } from "@/hooks/use-toast";
import { FileText, Calendar, Video, Sparkles, AlertCircle, Users, ShieldCheck, Settings } from "lucide-react";

const Dashboard: React.FC = () => {
  const { user, updatePassword } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const { isAdmin, isOperator } = usePermissions();
  
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  
  const [recentScripts, setRecentScripts] = useState<ScriptResponse[]>([]);
  const [upcomingContent, setUpcomingContent] = useState<CalendarSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Check if first-time login requiring password change
  useEffect(() => {
    if (user && !user.passwordChanged) {
      setShowPasswordDialog(true);
    }
  }, [user]);
  
  // Mock fetching recent scripts and upcoming content
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        // Mock recent scripts
        setRecentScripts([
          {
            id: "script-1",
            title: "UltraSonic Treatment Video",
            content: "# UltraSonic Treatment Video Script\n\n## Intro (10 seconds)\n\"Welcome back to our channel! Today we're exploring the revolutionary UltraSonic facial treatment.\"\n\n## Main Content (30 seconds)\nThis advanced approach targets fine lines and provides instant rejuvenation.\n\n## Call to Action (5 seconds)\nBook your consultation today!",
            type: "videoScript",
            createdAt: new Date().toISOString(),
            suggestedVideos: [
              {
                id: "video-1",
                title: "Before/After Results",
                thumbnailUrl: "/placeholder.svg",
                duration: "0:45"
              }
            ]
          },
          {
            id: "script-2",
            title: "Monthly Promotion: Facial Package",
            content: "# Quick Sales Story for Social Media\n\n\"Did you know that our signature facial package can transform your skin in just one session?\n\nWe're offering a special promotion this week only!\n\nSwipe up to learn more or DM us to book your appointment.\"",
            type: "dailySales",
            createdAt: new Date().toISOString()
          }
        ]);
        
        // Mock upcoming content
        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);
        const nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7);
        
        setUpcomingContent([
          {
            date: tomorrow.toISOString().split("T")[0],
            title: "Create a video about Venus Freeze",
            type: "videoScript",
            description: "Showcase the Venus Freeze body contouring treatment process",
            completed: false
          },
          {
            date: nextWeek.toISOString().split("T")[0],
            title: "Develop a strategic campaign for summer",
            type: "bigIdea",
            description: "Create a summer-themed content series focusing on body treatments",
            completed: false
          }
        ]);
        
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        toast({
          variant: "destructive",
          title: "Failed to load dashboard",
          description: "Could not load your recent activity",
        });
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [toast]);
  
  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords don't match",
        description: "Your new password and confirmation do not match.",
      });
      return;
    }
    
    if (newPassword.length < 8) {
      toast({
        variant: "destructive",
        title: "Password too short",
        description: "Your new password must be at least 8 characters long.",
      });
      return;
    }
    
    setIsUpdatingPassword(true);
    try {
      const success = await updatePassword(currentPassword, newPassword);
      if (success) {
        setShowPasswordDialog(false);
        toast({
          title: "Password updated",
          description: "Your password has been successfully changed.",
        });
      }
    } finally {
      setIsUpdatingPassword(false);
    }
  };
  
  return (
    <Layout title="Dashboard">
      <div className="grid gap-6">
        {/* Welcome section */}
        <Card className="bg-gradient-to-r from-reelline-primary to-reelline-accent text-white">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold mb-2">Bem-vindo, {user?.name}!</h2>
                  {isAdmin() && (
                    <Badge className="bg-white text-reelline-primary hover:bg-white">
                      Administrador
                    </Badge>
                  )}
                  {isOperator() && (
                    <Badge className="bg-white text-reelline-primary hover:bg-white">
                      Operador
                    </Badge>
                  )}
                </div>
                <p>O que você gostaria de criar hoje?</p>
              </div>
              <div className="mt-4 md:mt-0">
                <Button 
                  variant="secondary" 
                  className="bg-white text-reelline-primary hover:bg-gray-100"
                  onClick={() => navigate("/script-generator")}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Criar Novo Conteúdo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Admin Section - Visible only for admins */}
        {isAdmin() && (
          <Card className="border-2 border-reelline-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShieldCheck className="mr-2 h-5 w-5 text-reelline-primary" />
                Painel de Administrador
              </CardTitle>
              <CardDescription>
                Funções exclusivas para administradores do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center gap-2">
                  <Users className="h-6 w-6" />
                  <span>Gerenciar Usuários</span>
                </Button>
                
                <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center gap-2">
                  <Settings className="h-6 w-6" />
                  <span>Configurações do Sistema</span>
                </Button>
                
                <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center gap-2">
                  <FileText className="h-6 w-6" />
                  <span>Relatórios</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Operator Section - Visible for operators and admins */}
        {(isOperator() || isAdmin()) && (
          <Card className="border-2 border-amber-500/20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-amber-500" />
                Área do Operador
              </CardTitle>
              <CardDescription>
                Ferramentas para suporte e operação
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center gap-2">
                  <Users className="h-6 w-6" />
                  <span>Visualizar Clientes</span>
                </Button>
                
                <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center gap-2">
                  <FileText className="h-6 w-6" />
                  <span>Atividade Recente</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Stats overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* ... keep existing code (stats cards) */}
        </div>
        
        {/* Recent scripts */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle>Recent Scripts</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate("/script-generator")}>
                View all
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="grid place-items-center py-8">
                <div className="h-8 w-8 border-4 border-reelline-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : recentScripts.length > 0 ? (
              <div className="grid gap-4">
                {recentScripts.map((script) => (
                  <ScriptCard key={script.id} script={script} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No scripts created yet</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => navigate("/script-generator")}
                >
                  Create your first script
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Upcoming content */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle>Upcoming Content</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate("/calendar")}>
                View calendar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="grid place-items-center py-8">
                <div className="h-8 w-8 border-4 border-reelline-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : upcomingContent.length > 0 ? (
              <div className="space-y-4">
                {upcomingContent.map((item, index) => (
                  <div key={index} className="flex items-start p-3 rounded-md border bg-card">
                    <div className="bg-primary/10 p-2 rounded-md mr-3">
                      {item.type === "videoScript" ? (
                        <FileText className="h-5 w-5 text-primary" />
                      ) : item.type === "bigIdea" ? (
                        <Sparkles className="h-5 w-5 text-primary" />
                      ) : (
                        <Video className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">{item.title}</h4>
                        <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                          {new Date(item.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No upcoming content scheduled</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => navigate("/calendar")}
                >
                  View calendar
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Password change dialog for first time login */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              <span>Change your password</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-sm mb-4">
              For security reasons, please change your default password before continuing.
            </p>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Default: ReelLine@123</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              onClick={handlePasswordChange}
              disabled={isUpdatingPassword}
            >
              {isUpdatingPassword ? "Updating..." : "Update Password"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Dashboard;
