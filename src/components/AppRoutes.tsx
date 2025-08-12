import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import AuroraLoadingSkeleton from '@/components/aurora/AuroraLoadingSkeleton';
import PrivateRoute from '@/components/PrivateRoute';
import AdminRoute from '@/components/AdminRoute';

// Lazy loading dos componentes principais
const Dashboard = React.lazy(() => import('@/pages/Dashboard'));
const Login = React.lazy(() => import('@/pages/Login'));
const Register = React.lazy(() => import('@/pages/Register'));
const ForgotPassword = React.lazy(() => import('@/pages/ForgotPassword'));
const ResetPassword = React.lazy(() => import('@/pages/ResetPassword'));
const ScientificArticles = React.lazy(() => import('@/pages/ScientificArticles'));
const ScientificArticleView = React.lazy(() => import('@/pages/ScientificArticleView'));
const AdminScientificArticles = React.lazy(() => import('@/pages/admin/AdminScientificArticles'));
const AdminPhotosUpload = React.lazy(() => import('@/pages/admin/AdminPhotosUpload'));
const AdminScientificArticleView = React.lazy(() => import('@/pages/admin/AdminScientificArticleView'));
const Equipments = React.lazy(() => import('@/pages/Equipments'));
const EquipmentDetails = React.lazy(() => import('@/pages/EquipmentDetails'));
const MestreDaBelezaPage = React.lazy(() => import('@/pages/MestreDaBelezaPage'));
const FluidaRoteiristsPage = React.lazy(() => import('@/pages/FluidaRoteiristsPage'));

// Páginas institucionais
const LandingPage = React.lazy(() => import('@/pages/LandingPage'));
const OQueE = React.lazy(() => import('@/pages/Institucional/OQueE'));
const Contato = React.lazy(() => import('@/pages/Institucional/Contato'));
const Suporte = React.lazy(() => import('@/pages/Institucional/Suporte'));

const Videos = React.lazy(() => import('@/pages/Videos'));
const MarketingConsultant = React.lazy(() => import('@/pages/MarketingConsultant'));
const DiagnosticHistory = React.lazy(() => import('@/pages/DiagnosticHistory'));
const DiagnosticReport = React.lazy(() => import('@/pages/DiagnosticReport'));
const ContentPlanner = React.lazy(() => import('@/pages/ContentPlanner'));
const ContentScripts = React.lazy(() => import('@/pages/ContentScripts'));
const Photos = React.lazy(() => import('@/pages/Photos'));
const Arts = React.lazy(() => import('@/pages/Arts'));
const AdminPanel = React.lazy(() => import('@/pages/admin/AdminPanel'));
const AdminEquipments = React.lazy(() => import('@/pages/admin/AdminEquipments'));
const AdminVideos = React.lazy(() => import('@/pages/admin/AdminVideos'));
const AdminPhotos = React.lazy(() => import('@/pages/admin/AdminPhotos'));
const EditEquipment = React.lazy(() => import('@/pages/admin/EditEquipment'));
const VideoCreatePage = React.lazy(() => import('@/pages/videos/VideoCreatePage'));
const VideoCreatePageAdmin = React.lazy(() => import('@/pages/admin/VideoCreatePageAdmin'));
const BatchDownloadManager = React.lazy(() => import('@/pages/downloads/BatchDownloadManager'));
const DownloadsManager = React.lazy(() => import('@/pages/downloads/DownloadsManager'));
const AdminAIPanel = React.lazy(() => import('@/pages/admin/AdminAIPanel'));
const CopilotPage = React.lazy(() => import('@/pages/Copilot'));

// Lazy loading das novas páginas do perfil
const ApprovedScripts = React.lazy(() => import('@/pages/ApprovedScripts'));
const ProfileDashboard = React.lazy(() => import('@/pages/ProfileDashboard'));
const BeforeAfter = React.lazy(() => import('@/pages/BeforeAfter'));
const VideoStorage = React.lazy(() => import('@/pages/VideoStorage'));
const MyDocuments = React.lazy(() => import('@/pages/MyDocuments'));
const InstagramIntegration = React.lazy(() => import('@/pages/InstagramIntegration'));
const Gamification = React.lazy(() => import('@/pages/Gamification'));
const WorkspaceSettings = React.lazy(() => import('@/pages/WorkspaceSettings'));
const Profile = React.lazy(() => import('@/pages/Profile'));
const VideomakerCadastro = React.lazy(() => import('@/pages/VideomakerCadastro'));
const VideomakerLogin = React.lazy(() => import('@/pages/VideomakerLogin'));
const VideomakerDashboard = React.lazy(() => import('@/pages/VideomakerDashboard'));
const VideomakerEditar = React.lazy(() => import('@/pages/VideomakerEditar'));
const VideomakerBusca = React.lazy(() => import('@/pages/VideomakerBusca'));

// Academia pages
const Academia = React.lazy(() => import('@/pages/Academia'));
const CourseDetail = React.lazy(() => import('@/pages/CourseDetail'));
const AdminAcademia = React.lazy(() => import('@/pages/admin/AdminAcademia'));
const AdminAcademyCourseCreate = React.lazy(() => import('@/pages/admin/academy/AdminAcademyCourseCreate'));
const AdminAcademyCourseEdit = React.lazy(() => import('@/pages/admin/academy/AdminAcademyCourseEdit'));
const AdminAcademyCourseView = React.lazy(() => import('@/pages/admin/academy/AdminAcademyCourseView'));

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      
      {/* Landing como página inicial */}
      <Route 
        path="/" 
        element={
          <Suspense fallback={<AuroraLoadingSkeleton />}>
            <LandingPage />
          </Suspense>
        } 
      />
      
      <Route 
        path="/landing" 
        element={
          <Suspense fallback={<AuroraLoadingSkeleton />}>
            <LandingPage />
          </Suspense>
        } 
      />
      
      <Route 
        path="/login" 
        element={
          <Suspense fallback={<AuroraLoadingSkeleton />}>
            <Login />
          </Suspense>
        } 
      />
      
      <Route 
        path="/register" 
        element={
          <Suspense fallback={<AuroraLoadingSkeleton />}>
            <Register />
          </Suspense>
        } 
      />
      
      <Route 
        path="/forgot-password" 
        element={
          <Suspense fallback={<AuroraLoadingSkeleton />}>
            <ForgotPassword />
          </Suspense>
        } 
      />
      
      <Route 
        path="/reset-password" 
        element={
          <Suspense fallback={<AuroraLoadingSkeleton />}>
            <ResetPassword />
          </Suspense>
        } 
      />

      {/* Videomaker Public Routes */}
      <Route 
        path="/videomaker/cadastro" 
        element={
          <Suspense fallback={<AuroraLoadingSkeleton />}>
            <VideomakerCadastro />
          </Suspense>
        } 
      />

      <Route 
        path="/videomaker/login" 
        element={
          <Suspense fallback={<AuroraLoadingSkeleton />}>
            <VideomakerLogin />
          </Suspense>
        } 
      />

      {/* Páginas Institucionais - Públicas */}
      <Route 
        path="/institucional/o-que-e" 
        element={
          <AppLayout>
            <Suspense fallback={<AuroraLoadingSkeleton />}>
              <OQueE />
            </Suspense>
          </AppLayout>
        } 
      />

      <Route 
        path="/institucional/contato" 
        element={
          <AppLayout>
            <Suspense fallback={<AuroraLoadingSkeleton />}>
              <Contato />
            </Suspense>
          </AppLayout>
        } 
      />

      <Route 
        path="/institucional/suporte" 
        element={
          <AppLayout>
            <Suspense fallback={<AuroraLoadingSkeleton />}>
              <Suporte />
            </Suspense>
          </AppLayout>
        } 
      />

      {/* Protected Routes */}
      <Route element={<PrivateRoute />}>        
        <Route 
          path="/dashboard"
          element={
            <AppLayout>
              <Suspense fallback={<AuroraLoadingSkeleton />}>
                <Dashboard />
              </Suspense>
            </AppLayout>
          } 
        />
        
        <Route 
          path="/scientific-articles" 
          element={
            <AppLayout>
              <Suspense fallback={<AuroraLoadingSkeleton />}>
                <ScientificArticles />
              </Suspense>
            </AppLayout>
          } 
        />

        <Route 
          path="/scientific-articles/:id" 
          element={
            <AppLayout>
              <Suspense fallback={<AuroraLoadingSkeleton />}>
                <ScientificArticleView />
              </Suspense>
            </AppLayout>
          } 
        />

        <Route 
          path="/equipments" 
          element={
            <AppLayout>
              <Suspense fallback={<AuroraLoadingSkeleton />}>
                <Equipments />
              </Suspense>
            </AppLayout>
          } 
        />

        <Route 
          path="/equipments/:id" 
          element={
            <AppLayout>
              <Suspense fallback={<AuroraLoadingSkeleton />}>
                <EquipmentDetails />
              </Suspense>
            </AppLayout>
          } 
        />


        <Route 
          path="/videos" 
          element={
            <AppLayout>
              <Suspense fallback={<AuroraLoadingSkeleton />}>
                <Videos />
              </Suspense>
            </AppLayout>
          } 
        />


        <Route 
          path="/marketing-consultant" 
          element={
            <AppLayout>
              <Suspense fallback={<AuroraLoadingSkeleton />}>
                <MarketingConsultant />
              </Suspense>
            </AppLayout>
          } 
        />

        <Route 
          path="/diagnostic-history" 
          element={
            <AppLayout>
              <Suspense fallback={<AuroraLoadingSkeleton />}>
                <DiagnosticHistory />
              </Suspense>
            </AppLayout>
          } 
        />

        <Route 
          path="/diagnostic-report/:id" 
          element={
            <AppLayout>
              <Suspense fallback={<AuroraLoadingSkeleton />}>
                <DiagnosticReport />
              </Suspense>
            </AppLayout>
          } 
        />

        <Route 
          path="/mestre-da-beleza" 
          element={
            <AppLayout>
              <Suspense fallback={<AuroraLoadingSkeleton />}>
                <MestreDaBelezaPage />
              </Suspense>
            </AppLayout>
          } 
        />

        <Route 
          path="/fluidaroteirista" 
          element={
            <AppLayout>
              <Suspense fallback={<AuroraLoadingSkeleton />}>
                <FluidaRoteiristsPage />
              </Suspense>
            </AppLayout>
          } 
        />

        <Route 
          path="/content-planner" 
          element={
            <AppLayout>
              <Suspense fallback={<AuroraLoadingSkeleton />}>
                <ContentPlanner />
              </Suspense>
            </AppLayout>
          } 
        />

        <Route 
          path="/content/scripts" 
          element={
            <AppLayout>
              <Suspense fallback={<AuroraLoadingSkeleton />}>
                <ContentScripts />
              </Suspense>
            </AppLayout>
          } 
        />

        <Route 
          path="/photos" 
          element={
            <AppLayout>
              <Suspense fallback={<AuroraLoadingSkeleton />}>
                <Photos />
              </Suspense>
            </AppLayout>
          } 
        />

        <Route 
          path="/arts" 
          element={
            <AppLayout>
              <Suspense fallback={<AuroraLoadingSkeleton />}>
                <Arts />
              </Suspense>
            </AppLayout>
          } 
        />

        <Route 
          path="/downloads/batch" 
          element={
            <AppLayout>
              <Suspense fallback={<AuroraLoadingSkeleton />}>
                <BatchDownloadManager />
              </Suspense>
            </AppLayout>
          } 
        />

        <Route 
          path="/downloads/manage" 
          element={
            <AppLayout>
              <Suspense fallback={<AuroraLoadingSkeleton />}>
                <DownloadsManager />
              </Suspense>
            </AppLayout>
          } 
        />

        {/* Profile Menu Routes */}
        <Route 
          path="/copilot"
          element={
            <AppLayout>
              <Suspense fallback={<AuroraLoadingSkeleton />}>
                <CopilotPage />
              </Suspense>
            </AppLayout>
          } 
        />
        
        <Route 
          path="/approved-scripts" 
          element={
            <AppLayout>
              <Suspense fallback={<AuroraLoadingSkeleton />}>
                <ApprovedScripts />
              </Suspense>
            </AppLayout>
          } 
        />

        <Route 
          path="/profile-dashboard" 
          element={
            <AppLayout>
              <Suspense fallback={<AuroraLoadingSkeleton />}>
                <ProfileDashboard />
              </Suspense>
            </AppLayout>
          } 
        />

        <Route 
          path="/before-after" 
          element={
            <AppLayout>
              <Suspense fallback={<AuroraLoadingSkeleton />}>
                <BeforeAfter />
              </Suspense>
            </AppLayout>
          } 
        />

        <Route 
          path="/video-storage" 
          element={
            <AppLayout>
              <Suspense fallback={<AuroraLoadingSkeleton />}>
                <VideoStorage />
              </Suspense>
            </AppLayout>
          } 
        />

        <Route 
          path="/my-documents" 
          element={
            <AppLayout>
              <Suspense fallback={<AuroraLoadingSkeleton />}>
                <MyDocuments />
              </Suspense>
            </AppLayout>
          } 
        />

        <Route 
          path="/integrations/instagram" 
          element={
            <AppLayout>
              <Suspense fallback={<AuroraLoadingSkeleton />}>
                <InstagramIntegration />
              </Suspense>
            </AppLayout>
          } 
        />

        <Route 
          path="/gamification" 
          element={
            <AppLayout>
              <Suspense fallback={<AuroraLoadingSkeleton />}>
                <Gamification />
              </Suspense>
            </AppLayout>
          } 
        />

        <Route 
          path="/profile" 
          element={
            <AppLayout>
              <Suspense fallback={<AuroraLoadingSkeleton />}>
                <Profile />
              </Suspense>
            </AppLayout>
          } 
        />

        <Route 
          path="/workspace-settings" 
          element={
            <AppLayout>
              <Suspense fallback={<AuroraLoadingSkeleton />}>
                <WorkspaceSettings />
              </Suspense>
            </AppLayout>
          } 
        />

        {/* Videomaker Routes */}
        <Route 
          path="/videomaker/busca" 
          element={
            <AppLayout>
              <Suspense fallback={<AuroraLoadingSkeleton />}>
                <VideomakerBusca />
              </Suspense>
            </AppLayout>
          } 
        />

        <Route 
          path="/videomaker/dashboard" 
          element={
            <Suspense fallback={<AuroraLoadingSkeleton />}>
              <VideomakerDashboard />
            </Suspense>
          } 
        />

        <Route 
          path="/videomaker/editar" 
          element={
            <Suspense fallback={<AuroraLoadingSkeleton />}>
              <VideomakerEditar />
            </Suspense>
          } 
        />

        {/* Academia Routes */}
        <Route 
          path="/academia" 
          element={
            <AppLayout>
              <Suspense fallback={<AuroraLoadingSkeleton />}>
                <Academia />
              </Suspense>
            </AppLayout>
          } 
        />

        <Route 
          path="/academia/curso/:id" 
          element={
            <AppLayout>
              <Suspense fallback={<AuroraLoadingSkeleton />}>
                <CourseDetail />
              </Suspense>
            </AppLayout>
          } 
        />

        {/* Admin Routes */}
        <Route element={<AdminRoute />}>
          <Route 
            path="/admin" 
            element={
              <AppLayout requireAdmin={true}>
                <Suspense fallback={<AuroraLoadingSkeleton />}>
                  <AdminPanel />
                </Suspense>
              </AppLayout>
            } 
          />

          <Route 
            path="/admin/scientific-articles" 
            element={
              <AppLayout requireAdmin={true}>
                <Suspense fallback={<AuroraLoadingSkeleton />}>
                  <AdminScientificArticles />
                </Suspense>
              </AppLayout>
            } 
          />

          <Route 
            path="/admin/scientific-articles/:id" 
            element={
              <AppLayout requireAdmin={true}>
                <Suspense fallback={<AuroraLoadingSkeleton />}>
                  <AdminScientificArticleView />
                </Suspense>
              </AppLayout>
            } 
          />

          <Route 
            path="/admin/equipments"
            element={
              <AppLayout requireAdmin={true}>
                <Suspense fallback={<AuroraLoadingSkeleton />}>
                  <AdminEquipments />
                </Suspense>
              </AppLayout>
            } 
          />

          <Route 
            path="/admin/equipments/edit/:id"
            element={
              <AppLayout requireAdmin={true}>
                <Suspense fallback={<AuroraLoadingSkeleton />}>
                  <EditEquipment />
                </Suspense>
              </AppLayout>
            } 
          />

          <Route 
            path="/admin/videos"
            element={
              <AppLayout requireAdmin={true}>
                <Suspense fallback={<AuroraLoadingSkeleton />}>
                  <AdminVideos />
                </Suspense>
              </AppLayout>
            } 
          />

          <Route 
            path="/admin/videos/create"
            element={
              <AppLayout requireAdmin={true}>
                <Suspense fallback={<AuroraLoadingSkeleton />}>
                  <VideoCreatePageAdmin />
                </Suspense>
              </AppLayout>
            } 
          />

          <Route 
            path="/admin/photos"
            element={
              <AppLayout requireAdmin={true}>
                <Suspense fallback={<AuroraLoadingSkeleton />}>
                  <AdminPhotos />
                </Suspense>
              </AppLayout>
            } 
          />

          <Route 
            path="/admin/photos/upload"
            element={
              <AppLayout requireAdmin={true}>
                <Suspense fallback={<AuroraLoadingSkeleton />}>
                  <AdminPhotosUpload />
                </Suspense>
              </AppLayout>
            } 
          />

          <Route 
            path="/admin/academia"
            element={
              <AppLayout requireAdmin={true}>
                <Suspense fallback={<AuroraLoadingSkeleton />}>
                  <AdminAcademia />
                </Suspense>
              </AppLayout>
            } 
          />

          <Route 
            path="/admin/academia/curso/novo"
            element={
              <AppLayout requireAdmin={true}>
                <Suspense fallback={<AuroraLoadingSkeleton />}>
                  <AdminAcademyCourseCreate />
                </Suspense>
              </AppLayout>
            } 
          />

          <Route 
            path="/admin/academia/curso/editar/:id"
            element={
              <AppLayout requireAdmin={true}>
                <Suspense fallback={<AuroraLoadingSkeleton />}>
                  <AdminAcademyCourseEdit />
                </Suspense>
              </AppLayout>
            } 
          />

          <Route 
            path="/admin/academia/curso/:id"
            element={
              <AppLayout requireAdmin={true}>
                <Suspense fallback={<AuroraLoadingSkeleton />}>
                  <AdminAcademyCourseView />
                </Suspense>
              </AppLayout>
            } 
          />

          <Route 
            path="/admin/ai-panel"
            element={
              <AppLayout requireAdmin={true}>
                <Suspense fallback={<AuroraLoadingSkeleton />}>
                  <AdminAIPanel />
                </Suspense>
              </AppLayout>
            } 
          />
        </Route>
      </Route>

      {/* Catch all route */}
      <Route 
        path="*" 
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
};

export default AppRoutes;
