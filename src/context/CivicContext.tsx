import React, { createContext, useContext, useState, useMemo } from 'react';
import {
  Incident,
  Persona,
  MunicipalTab,
  IssueCategory,
  CivicNotification,
  OfflineReport,
  IncidentStatus
} from '../types/civic';
const MOCK_INCIDENTS: Incident[] = [];
const MOCK_NOTIFICATIONS: CivicNotification[] = [];

interface ToastState {
  title: string;
  message: string;
  type: 'success' | 'urgent' | 'warning' | 'info';
}

interface CivicContextType {
  incidents: Incident[];
  selectedIncidentId: string | null;
  selectedIncident: Incident | null;
  activeTab: MunicipalTab;
  persona: Persona;
  isDetailOpen: boolean;
  isWhyScoreOpen: boolean;
  isEvidenceOpen: boolean;
  isSmartClosureOpen: boolean;
  
  // Filters & Sorting
  search: string;
  categoryFilter: string;
  riskFilter: string;
  statusFilter: string;
  recurringOnly: boolean;
  queueFilter: 'all' | 'high_risk' | 'waiting_too_long' | 'recurring' | 'unassigned' | 'needs_review';
  sortBy: 'risk' | 'age' | 'impact' | 'severity';

  // Offline Simulation
  isOffline: boolean;
  offlineQueue: OfflineReport[];
  isSyncing: boolean;

  // Notifications
  notifications: CivicNotification[];
  unreadNotificationCount: number;

  // Toast
  toast: ToastState | null;

  // Actions
  selectIncident: (id: string | null, openDetail?: boolean) => void;
  setActiveTab: (tab: MunicipalTab) => void;
  setPersona: (persona: Persona) => void;
  setIsDetailOpen: (open: boolean) => void;
  setIsWhyScoreOpen: (open: boolean) => void;
  setIsEvidenceOpen: (open: boolean) => void;
  setIsSmartClosureOpen: (open: boolean) => void;
  setSearch: (query: string) => void;
  setCategoryFilter: (category: string) => void;
  setRiskFilter: (risk: string) => void;
  setStatusFilter: (status: string) => void;
  setRecurringOnly: (recurring: boolean) => void;
  setQueueFilter: (filter: 'all' | 'high_risk' | 'waiting_too_long' | 'recurring' | 'unassigned' | 'needs_review') => void;
  setSortBy: (sort: 'risk' | 'age' | 'impact' | 'severity') => void;
  toggleOffline: () => void;
  submitCitizenReport: (data: {
    category: IssueCategory;
    description: string;
    sector: string;
    location: string;
    imageDataUrl?: string;
  }) => void;
  syncOfflineQueue: () => void;
  resolveFieldIncident: (incidentId: string, afterImageUrl: string, status: 'resolved' | 'needs_review') => void;
  assignTeam: (incidentId: string, team: string, officer?: string) => void;
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  showToast: (title: string, message: string, type?: 'success' | 'urgent' | 'warning' | 'info') => void;
}

const CivicContext = createContext<CivicContextType | undefined>(undefined);

export const CivicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [incidents, setIncidents] = useState<Incident[]>(MOCK_INCIDENTS);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>('inc-001');
  const [activeTab, setActiveTab] = useState<MunicipalTab>('dashboard');
  const [persona, setPersona] = useState<Persona>('municipal');

  // Drawers & Modals
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const [isWhyScoreOpen, setIsWhyScoreOpen] = useState<boolean>(false);
  const [isEvidenceOpen, setIsEvidenceOpen] = useState<boolean>(false);
  const [isSmartClosureOpen, setIsSmartClosureOpen] = useState<boolean>(false);

  // Filters & Sorting
  const [search, setSearch] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [recurringOnly, setRecurringOnly] = useState<boolean>(false);
  const [queueFilter, setQueueFilter] = useState<'all' | 'high_risk' | 'waiting_too_long' | 'recurring' | 'unassigned' | 'needs_review'>('all');
  const [sortBy, setSortBy] = useState<'risk' | 'age' | 'impact' | 'severity'>('risk');

  // Offline Simulation
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [offlineQueue] = useState<OfflineReport[]>([]);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Notifications
  const [notifications, setNotifications] = useState<CivicNotification[]>(MOCK_NOTIFICATIONS);

  // Toast
  const [toast, setToast] = useState<ToastState | null>(null);

  const selectedIncident = useMemo(() => {
    return incidents.find((inc) => inc.id === selectedIncidentId) || incidents[0] || null;
  }, [incidents, selectedIncidentId]);

  const unreadNotificationCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  const showToast = (
    title: string,
    message: string,
    type: 'success' | 'urgent' | 'warning' | 'info' = 'info'
  ) => {
    setToast({ title, message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const selectIncident = (id: string | null, openDetail: boolean = false) => {
    setSelectedIncidentId(id);
    if (openDetail && id) {
      setIsDetailOpen(true);
    }
  };

  const toggleOffline = () => {
    showToast('Offline mode unavailable', 'Reports require a live connection to the SANKET backend.', 'warning');
  };

  const syncOfflineQueue = () => {
    showToast('No offline reports', 'No locally cached reports are available to synchronize.', 'info');
  };

  const submitCitizenReport = (data: {
    category: IssueCategory;
    description: string;
    sector: string;
    location: string;
    imageDataUrl?: string;
  }) => {
    void data;
    showToast('Use the citizen report form', 'The real report form captures photo, GPS, and submits to the backend.', 'info');
  };

  const resolveFieldIncident = (
    incidentId: string,
    afterImageUrl: string,
    status: 'resolved' | 'needs_review'
  ) => {
    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id === incidentId) {
          return {
            ...inc,
            status,
            afterImageUrl,
            smartClosure: undefined,
            lastUpdated: new Date().toISOString()
          };
        }
        return inc;
      })
    );

    if (status === 'resolved') {
      showToast(
        'Repair evidence submitted',
        'The incident status was updated locally; closure verification remains unavailable until backend evidence is evaluated.',
        'success'
      );
    } else {
      showToast(
        'Flagged for Secondary Review',
        'Closure evidence inconclusive. Dispatched to Quality Supervisor for on-site audit.',
        'warning'
      );
    }
  };

  const assignTeam = (incidentId: string, team: string, officer?: string) => {
    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id === incidentId) {
          return {
            ...inc,
            status: 'assigned',
            assignedTeam: team,
            assignedOfficer: officer || 'Senior Field Inspector',
            assignedAt: new Date().toISOString(),
            lastUpdated: new Date().toISOString()
          };
        }
        return inc;
      })
    );
    showToast(
      'Team Dispatched',
      `Incident assigned to ${team} (${officer || 'Duty Officer'}).`,
      'info'
    );
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAllNotifications = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <CivicContext.Provider
      value={{
        incidents,
        selectedIncidentId,
        selectedIncident,
        activeTab,
        persona,
        isDetailOpen,
        isWhyScoreOpen,
        isEvidenceOpen,
        isSmartClosureOpen,
        search,
        categoryFilter,
        riskFilter,
        statusFilter,
        recurringOnly,
        queueFilter,
        sortBy,
        isOffline,
        offlineQueue,
        isSyncing,
        notifications,
        unreadNotificationCount,
        toast,
        selectIncident,
        setActiveTab,
        setPersona,
        setIsDetailOpen,
        setIsWhyScoreOpen,
        setIsEvidenceOpen,
        setIsSmartClosureOpen,
        setSearch,
        setCategoryFilter,
        setRiskFilter,
        setStatusFilter,
        setRecurringOnly,
        setQueueFilter,
        setSortBy,
        toggleOffline,
        submitCitizenReport,
        syncOfflineQueue,
        resolveFieldIncident,
        assignTeam,
        markNotificationRead,
        clearAllNotifications,
        showToast
      }}
    >
      {children}
    </CivicContext.Provider>
  );
};

export const useCivic = (): CivicContextType => {
  const context = useContext(CivicContext);
  if (!context) {
    throw new Error('useCivic must be used within a CivicProvider');
  }
  return context;
};
