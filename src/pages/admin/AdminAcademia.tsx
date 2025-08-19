import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Users, Award, Clock, Eye, Edit, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { useAcademyStats } from '@/hooks/useAcademyStats';
import { useAcademyCourses } from '@/hooks/useAcademyCourses';
import { useAcademyAccessRequests } from '@/hooks/useAcademyAccessRequests';

import { AccessRequestActions } from '@/components/academy/AccessRequestActions';
import { InviteUserDialog } from '@/components/academy/InviteUserDialog';
import { InvitesManagement } from '@/components/academy/InvitesManagement';
import { AcademyCourse } from '@/types/academy';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

const AdminAcademia = () => {
  const navigate = useNavigate();
  const { stats, isLoading: statsLoading } = useAcademyStats();
  const { 
    courses, 
    isLoading: coursesLoading, 
    createCourse, 
    toggleCourseStatus,
    deleteCourse 
  } = useAcademyCourses();
  const { 
    requests, 
    isLoading: requestsLoading, 
    approveRequest, 
    rejectRequest 
  } = useAcademyAccessRequests();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Ativo</Badge>;
      case 'inactive':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Inativo</Badge>;
      case 'draft':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Rascunho</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-50">Academia</h1>
            <p className="text-slate-400">Gerencie cursos e acessos da academia</p>
          </div>
          <div className="flex gap-3">
            <InviteUserDialog />
            <Button onClick={() => navigate('/admin/academia/curso/novo')}>
              Novo Curso
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Cursos Totais</CardTitle>
              <BookOpen className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-50">
                {statsLoading ? '...' : stats.totalCourses}
              </div>
              <p className="text-xs text-slate-400">cursos disponíveis</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Estudantes Ativos</CardTitle>
              <Users className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-50">
                {statsLoading ? '...' : stats.activeStudents}
              </div>
              <p className="text-xs text-slate-400">estudantes matriculados</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Solicitações Pendentes</CardTitle>
              <Clock className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-50">
                {statsLoading ? '...' : stats.pendingRequests}
              </div>
              <p className="text-xs text-slate-400">aguardando aprovação</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Certificados Emitidos</CardTitle>
              <Award className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-50">
                {statsLoading ? '...' : stats.certificatesIssued}
              </div>
              <p className="text-xs text-slate-400">cursos concluídos</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="courses" className="space-y-6">
          <TabsList className="bg-slate-800/50 border border-slate-700">
            <TabsTrigger value="courses" className="data-[state=active]:bg-slate-700">
              Cursos
            </TabsTrigger>
            <TabsTrigger value="requests" className="data-[state=active]:bg-slate-700">
              Solicitações
            </TabsTrigger>
            <TabsTrigger value="invites" className="data-[state=active]:bg-slate-700">
              Convites
            </TabsTrigger>
          </TabsList>

          {/* Courses Tab */}
          <TabsContent value="courses">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-50">Cursos</CardTitle>
                <CardDescription className="text-slate-400">
                  Gerencie os cursos disponíveis na academia
                </CardDescription>
              </CardHeader>
              <CardContent>
                {coursesLoading ? (
                  <div className="text-center py-8">
                    <p className="text-slate-400">Carregando cursos...</p>
                  </div>
                ) : courses.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-slate-400">Nenhum curso encontrado</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {courses.map((course) => (
                      <div
                        key={course.id}
                        className="flex items-center justify-between p-4 border border-slate-700 rounded-lg bg-slate-700/30"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-slate-50">{course.title}</h3>
                            {getStatusBadge(course.status || 'active')}
                          </div>
                          <p className="text-slate-400 text-sm mb-2">{course.description}</p>
                          <div className="flex items-center gap-4 text-xs text-slate-500">
                            {course.equipment_name && <span>Equipamento: {course.equipment_name}</span>}
                            <span>Duração: {course.estimated_duration_hours || 0}h</span>
                            {course.created_at && <span>Criado em: {formatDate(course.created_at)}</span>}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-slate-600"
                            onClick={() => navigate(`/admin/academia/curso/${course.id}/aulas`)}
                          >
                            <BookOpen className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-slate-600"
                            onClick={() => navigate(`/admin/academia/curso/${course.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-slate-600"
                            onClick={() => navigate(`/admin/academia/curso/editar/${course.id}`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-slate-600"
                            onClick={() => toggleCourseStatus(
                              course.id, 
                              course.status === 'active' ? 'inactive' : 'active'
                            )}
                          >
                            {course.status === 'active' ? (
                              <ToggleRight className="h-4 w-4 text-green-400" />
                            ) : (
                              <ToggleLeft className="h-4 w-4 text-slate-400" />
                            )}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-red-600 text-red-400 hover:bg-red-600/20"
                            onClick={() => deleteCourse(course.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Requests Tab */}
          <TabsContent value="requests">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-50">Solicitações de Acesso</CardTitle>
                <CardDescription className="text-slate-400">
                  Gerencie as solicitações de acesso aos cursos
                </CardDescription>
              </CardHeader>
              <CardContent>
                {requestsLoading ? (
                  <div className="text-center py-8">
                    <p className="text-slate-400">Carregando solicitações...</p>
                  </div>
                ) : requests.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-slate-400">Nenhuma solicitação encontrada</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {requests.filter(req => req.status === 'pending').map((request) => (
                      <div
                        key={request.id}
                        className="flex items-center justify-between p-4 border border-slate-700 rounded-lg bg-slate-700/30"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-slate-50">{request.user_name}</h3>
                            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                              Pendente
                            </Badge>
                          </div>
                          <p className="text-slate-400 text-sm mb-2">{request.user_email}</p>
                          <div className="flex items-center gap-4 text-xs text-slate-500">
                            <span>Curso: {request.course_title}</span>
                            {request.requested_at && (
                              <span>Solicitado em: {formatDate(request.requested_at)}</span>
                            )}
                          </div>
                        </div>
                        <AccessRequestActions
                          requestId={request.id}
                          onApprove={approveRequest}
                          onReject={rejectRequest}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Invites Tab */}
          <TabsContent value="invites">
            <InvitesManagement />
          </TabsContent>
        </Tabs>
      </div>

    </AdminLayout>
  );
};

export default AdminAcademia;