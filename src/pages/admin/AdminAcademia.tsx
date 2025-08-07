import React, { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, BookOpen, Users, Award, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminAcademia: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('courses');

  // Mock data
  const courses = [
    {
      id: '1',
      title: 'Introdução ao HIFU',
      description: 'Curso completo sobre tecnologia HIFU',
      equipment_name: 'HIFU Profissional',
      status: 'active',
      total_students: 25,
      difficulty_level: 'beginner',
      estimated_duration_hours: 3,
      has_final_exam: true
    },
    {
      id: '2',
      title: 'Radiofrequência Avançada',
      description: 'Técnicas avançadas de radiofrequência',
      equipment_name: 'RF Excellence',
      status: 'active',
      total_students: 18,
      difficulty_level: 'advanced',
      estimated_duration_hours: 5,
      has_final_exam: true
    }
  ];

  const accessRequests = [
    {
      id: '1',
      user_name: 'Maria Silva',
      course_title: 'Introdução ao HIFU',
      requested_at: '2024-01-15',
      status: 'pending'
    },
    {
      id: '2',
      user_name: 'João Santos',
      course_title: 'Radiofrequência Avançada',
      requested_at: '2024-01-14',
      status: 'pending'
    }
  ];

  const handleApproveRequest = (requestId: string) => {
    toast({
      title: "Acesso aprovado",
      description: "O usuário foi notificado sobre a aprovação."
    });
  };

  const handleDenyRequest = (requestId: string) => {
    toast({
      title: "Acesso negado",
      description: "O usuário foi notificado sobre a negativa."
    });
  };

  return (
    <AdminLayout>
      <div className="aurora-dark-bg min-h-screen">
        <div className="aurora-particles">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="aurora-particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDuration: `${10 + Math.random() * 20}s`,
                animationDelay: `${Math.random() * 10}s`
              }}
            />
          ))}
        </div>

        <div className="container mx-auto py-8 px-4 relative z-10">
          {/* Header */}
          <div className="aurora-glass rounded-3xl p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-r from-aurora-lavender to-aurora-teal">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="aurora-text-gradient text-4xl font-light mb-2">
                    Academia - Administração
                  </h1>
                  <p className="aurora-body text-white/70">
                    Gerencie cursos, aulas e acessos dos usuários
                  </p>
                </div>
              </div>
              <Button className="aurora-button">
                <Plus className="h-4 w-4 mr-2" />
                Novo Curso
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="aurora-glass p-4 rounded-xl">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-6 w-6 text-aurora-electric-purple" />
                  <div>
                    <p className="text-sm text-white/60">Total de Cursos</p>
                    <p className="text-2xl font-semibold text-white">{courses.length}</p>
                  </div>
                </div>
              </div>
              <div className="aurora-glass p-4 rounded-xl">
                <div className="flex items-center gap-3">
                  <Users className="h-6 w-6 text-aurora-teal" />
                  <div>
                    <p className="text-sm text-white/60">Estudantes Ativos</p>
                    <p className="text-2xl font-semibold text-white">
                      {courses.reduce((acc, course) => acc + course.total_students, 0)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="aurora-glass p-4 rounded-xl">
                <div className="flex items-center gap-3">
                  <Settings className="h-6 w-6 text-aurora-lavender" />
                  <div>
                    <p className="text-sm text-white/60">Solicitações Pendentes</p>
                    <p className="text-2xl font-semibold text-white">
                      {accessRequests.filter(req => req.status === 'pending').length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="aurora-glass p-4 rounded-xl">
                <div className="flex items-center gap-3">
                  <Award className="h-6 w-6 text-aurora-electric-purple" />
                  <div>
                    <p className="text-sm text-white/60">Certificados Emitidos</p>
                    <p className="text-2xl font-semibold text-white">47</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="aurora-glass mb-6">
              <TabsTrigger value="courses" className="text-white">
                Cursos
              </TabsTrigger>
              <TabsTrigger value="requests" className="text-white">
                Solicitações de Acesso
              </TabsTrigger>
              <TabsTrigger value="analytics" className="text-white">
                Relatórios
              </TabsTrigger>
            </TabsList>

            {/* Courses Tab */}
            <TabsContent value="courses">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <Card key={course.id} className="aurora-glass border-aurora-electric-purple/20">
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <Badge className={`${
                          course.difficulty_level === 'beginner' ? 'bg-green-500' : 
                          course.difficulty_level === 'intermediate' ? 'bg-yellow-500' : 'bg-red-500'
                        } text-white`}>
                          {course.difficulty_level}
                        </Badge>
                        <Badge variant={course.status === 'active' ? 'default' : 'secondary'}>
                          {course.status}
                        </Badge>
                      </div>
                      <CardTitle className="aurora-text-gradient text-xl">
                        {course.title}
                      </CardTitle>
                      <Badge variant="outline" className="text-aurora-teal border-aurora-teal w-fit">
                        {course.equipment_name}
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      <p className="aurora-body text-white/70 mb-4">
                        {course.description}
                      </p>
                      <div className="space-y-2 text-sm text-white/60 mb-4">
                        <div className="flex justify-between">
                          <span>Estudantes:</span>
                          <span>{course.total_students}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Duração:</span>
                          <span>{course.estimated_duration_hours}h</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Prova Final:</span>
                          <span>{course.has_final_exam ? 'Sim' : 'Não'}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="aurora-button flex-1">
                          Editar
                        </Button>
                        <Button size="sm" variant="outline" className="aurora-glass">
                          Ver Detalhes
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Access Requests Tab */}
            <TabsContent value="requests">
              <div className="aurora-glass rounded-3xl p-8">
                <h2 className="aurora-text-gradient text-2xl font-light mb-6">
                  Solicitações de Acesso Pendentes
                </h2>
                <div className="space-y-4">
                  {accessRequests.map((request) => (
                    <Card key={request.id} className="aurora-glass border-aurora-electric-purple/20">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-white mb-1">
                              {request.user_name}
                            </h3>
                            <p className="text-white/70 mb-2">
                              Curso: {request.course_title}
                            </p>
                            <p className="text-sm text-white/60">
                              Solicitado em: {new Date(request.requested_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleApproveRequest(request.id)}
                            >
                              Aprovar
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleDenyRequest(request.id)}
                            >
                              Negar
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics">
              <div className="aurora-glass rounded-3xl p-8">
                <h2 className="aurora-text-gradient text-2xl font-light mb-6">
                  Relatórios e Analytics
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="aurora-glass border-aurora-electric-purple/20">
                    <CardHeader>
                      <CardTitle className="text-white">Cursos Mais Populares</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {courses.map((course, index) => (
                          <div key={course.id} className="flex justify-between items-center">
                            <span className="text-white/70">{index + 1}. {course.title}</span>
                            <span className="text-aurora-electric-purple font-semibold">
                              {course.total_students} estudantes
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="aurora-glass border-aurora-electric-purple/20">
                    <CardHeader>
                      <CardTitle className="text-white">Taxa de Conclusão</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-white/70">Introdução ao HIFU</span>
                          <span className="text-green-500 font-semibold">85%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white/70">Radiofrequência Avançada</span>
                          <span className="text-yellow-500 font-semibold">72%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAcademia;