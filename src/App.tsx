import React from 'react';
import { CivicProvider, useCivic } from './context/CivicContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { Toast } from './components/common/Toast';
import { DashboardView } from './components/views/DashboardView';
import { IncidentsView } from './components/views/IncidentsView';
import { PriorityQueueView } from './components/views/PriorityQueueView';
import { MapView } from './components/views/MapView';
import { CivicMemoryView } from './components/views/CivicMemoryView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { ReportsView } from './components/views/ReportsView';
import { SettingsView } from './components/views/SettingsView';
import { MethodologyView } from './components/views/MethodologyView';
import { FieldOfficerView } from './components/views/FieldOfficerView';
import { CitizenView } from './components/views/CitizenView';
import { MunicipalDashboardPage } from './pages/MunicipalDashboardPage';
import { IncidentDetailDrawer } from './components/views/IncidentDetailDrawer';
import { ScoreExplanationModal } from './components/intelligence/ScoreExplanationModal';
import { EvidenceDrawer } from './components/intelligence/EvidenceDrawer';
import { SmartClosureModal } from './components/intelligence/SmartClosureModal';
import { AuthPage } from './pages/AuthPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import {
  LayoutDashboard,
  AlertOctagon,
  ListOrdered,
  MapPin,
  History,
  BarChart3,
  FileText
} from 'lucide-react';
import { MunicipalTab } from './types/civic';

const MainShell: React.FC = () => {
  const { user, logout } = useAuth();
  const { activeTab, setActiveTab } = useCivic();
  const persona = user?.role === 'COMMAND_ADMIN' ? 'municipal' : user?.role === 'FIELD_OFFICER' ? 'field_officer' : 'citizen';

  const mobileNavItems: { id: MunicipalTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'incidents', label: 'Incidents', icon: <AlertOctagon className="w-4 h-4" /> },
    { id: 'priority_queue', label: 'Queue', icon: <ListOrdered className="w-4 h-4" /> },
    { id: 'map_view', label: 'Map', icon: <MapPin className="w-4 h-4" /> },
    { id: 'civic_memory', label: 'Memory', icon: <History className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen isolate bg-[#FBFBF9] text-[#191B1F] flex flex-col selection:bg-[#2C5E48]/20 selection:text-[#1E4333]">
      <Header onLogout={logout} />

      {/* Main Content Router based on Persona */}
      {persona === 'municipal' && (
        <div className="flex-1 flex overflow-hidden">
          {/* Desktop Left Sidebar */}
          <div className="hidden md:block">
            <Sidebar />
          </div>

          {/* Main Scrollable View Area */}
          <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 pb-20 md:pb-8 max-w-7xl mx-auto w-full">
            {activeTab === 'dashboard' && <MunicipalDashboardPage />}
            {activeTab === 'incidents' && <IncidentsView />}
            {activeTab === 'priority_queue' && <PriorityQueueView />}
            {activeTab === 'map_view' && <MapView />}
            {activeTab === 'civic_memory' && <CivicMemoryView />}
            {activeTab === 'analytics' && <AnalyticsView />}
            {activeTab === 'reports' && <ReportsView />}
            {activeTab === 'settings' && <SettingsView />}
            {activeTab === 'methodology' && <MethodologyView />}
          </main>

          {/* Mobile Bottom Navigation Bar */}
          <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-[#E5E3DC] z-30 flex items-center justify-around py-2 px-1 shadow-lg">
            {mobileNavItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg text-[10px] font-semibold transition-colors ${
                    isActive ? 'text-[#2C5E48] font-bold' : 'text-[#7E8592]'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      )}

      {persona === 'field_officer' && (
        <main className="flex-1 px-4 py-6 max-w-xl mx-auto w-full">
          <FieldOfficerView />
        </main>
      )}

      {persona === 'citizen' && (
        <main className="flex-1 px-4 py-6 max-w-xl mx-auto w-full">
          <CitizenView />
        </main>
      )}

      {/* Global SANKET Intelligence Modals & Drawers */}
      <IncidentDetailDrawer />
      <ScoreExplanationModal />
      <EvidenceDrawer />
      <SmartClosureModal />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AuthenticatedApp />
    </AuthProvider>
  );
}

function AuthenticatedApp() {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div className="min-h-screen bg-[#FBFBF9] flex items-center justify-center text-sm text-[#565C68]">Restoring session…</div>;
  if (!user) return <AuthPage />;
  return <CivicProvider><MainShell /></CivicProvider>;
}
