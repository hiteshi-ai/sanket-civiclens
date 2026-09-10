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
import { MOCK_INCIDENTS, MOCK_NOTIFICATIONS } from '../data/mockIncidents';

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
  const [offlineQueue, setOfflineQueue] = useState<OfflineReport[]>([
    {
      id: 'off-01',
      timestamp: '2026-09-09T14:10:00Z',
      category: 'pothole',
      location: 'Near Old Forest Checkpost, Sukhna Enclave',
      sector: 'Rural Fringe',
      latitude: 30.758,
      longitude: 76.825,
      description: 'Asphalt edge wash-out observed during low connectivity patrol.',
      synced: false
    },
    {
      id: 'off-02',
      timestamp: '2026-09-09T15:25:00Z',
      category: 'drainage',
      location: 'Kishangarh Canal Bund Drain Gate 4',
      sector: 'Kishangarh',
      latitude: 30.732,
      longitude: 76.831,
      description: 'Silt blockage detected in remote catchment line.',
      synced: false
    }
  ]);
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
    const nextState = !isOffline;
    setIsOffline(nextState);
    if (nextState) {
      showToast(
        'Offline Mode Activated',
        'Simulating low-connectivity / remote region. Reports will be saved locally.',
        'warning'
      );
    } else {
      showToast(
        'Connection Restored',
        'Online link established with SANKET municipal servers.',
        'info'
      );
    }
  };

  const syncOfflineQueue = () => {
    if (offlineQueue.length === 0) return;
    setIsSyncing(true);
    showToast(
      'Synchronizing Data',
      `Transmitting ${offlineQueue.length} offline signals to SANKET intelligence engine...`,
      'info'
    );

    setTimeout(() => {
      // Create new incidents from offline queue
      const converted: Incident[] = offlineQueue.map((item, idx) => ({
        id: `inc-sync-${Date.now()}-${idx}`,
        ticketNumber: `CHD-2026-SYNC${Math.floor(100 + Math.random() * 900)}`,
        title: `${item.category.toUpperCase()}: ${item.location}`,
        category: item.category,
        location: item.location,
        sector: item.sector,
        latitude: item.latitude,
        longitude: item.longitude,
        reportedAt: item.timestamp,
        waitingDays: 1,
        status: 'reported' as IncidentStatus,
        riskScore: 68,
        riskLevel: 'high',
        severity: 7,
        publicImpact: 7,
        locationExposure: 6,
        waitingScore: 2,
        riskReasoning: 'Newly synchronized remote signal. Prioritized for field reconnaissance.',
        confidenceScore: 84,
        confidenceEvidence: {
          relatedReportsCount: 2,
          locationMatchRadiusMeters: 8.5,
          visualSimilarityPercentage: 82,
          timeClusteringScore: 85,
          citizenSignalSources: ['Offline Remote Sync Buffer (1)'],
          lastCalculatedAgo: 'Just now'
        },
        isRecurring: false,
        recurrenceCount: 1,
        agingCurve: [
          { day: 1, label: 'Day 1 Intake', riskBoost: 0, isPast: true, isCurrent: true },
          { day: 15, label: 'Day 15 Escalation', riskBoost: 10, isPast: false, isCurrent: false },
          { day: 30, label: 'Day 30 SLA Breach', riskBoost: 22, isPast: false, isCurrent: false },
          { day: 45, label: 'Day 45 Emergency Tier', riskBoost: 32, isPast: false, isCurrent: false }
        ],
        agingThresholdCrossed: false,
        beforeImageUrl: item.imageDataUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
        description: item.description,
        sourceAttribution: 'Offline Field Sync — Chandigarh Remote Division',
        lastUpdated: new Date().toISOString()
      }));

      setIncidents((prev) => [...converted, ...prev]);
      setOfflineQueue([]);
      setIsSyncing(false);
      showToast(
        'Synchronization Complete',
        `${converted.length} reports submitted and processed through SANKET intelligence engine.`,
        'success'
      );
    }, 1800);
  };

  const submitCitizenReport = (data: {
    category: IssueCategory;
    description: string;
    sector: string;
    location: string;
    imageDataUrl?: string;
  }) => {
    if (isOffline) {
      const offlineItem: OfflineReport = {
        id: `off-${Date.now()}`,
        timestamp: new Date().toISOString(),
        category: data.category,
        location: data.location,
        sector: data.sector,
        latitude: 30.74 + (Math.random() - 0.5) * 0.04,
        longitude: 76.78 + (Math.random() - 0.5) * 0.04,
        description: data.description,
        imageDataUrl: data.imageDataUrl,
        synced: false
      };
      setOfflineQueue((prev) => [offlineItem, ...prev]);
      showToast(
        'Report Saved Offline',
        'Network disconnected. Report cached securely and will sync once back online.',
        'warning'
      );
      return;
    }

    const newTicket = `CHD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newInc: Incident = {
      id: `inc-${Date.now()}`,
      ticketNumber: newTicket,
      title: `${data.category.toUpperCase()} Report — ${data.sector}`,
      category: data.category,
      location: data.location,
      sector: data.sector,
      latitude: 30.7415 + (Math.random() - 0.5) * 0.03,
      longitude: 76.7794 + (Math.random() - 0.5) * 0.03,
      reportedAt: new Date().toISOString(),
      waitingDays: 0,
      status: 'reported',
      riskScore: 71,
      riskLevel: 'high',
      severity: 7,
      publicImpact: 7,
      locationExposure: 7,
      waitingScore: 1,
      riskReasoning: 'Newly received citizen signal. SANKET AI is clustering with existing municipal telemetry.',
      confidenceScore: 92,
      confidenceEvidence: {
        relatedReportsCount: 1,
        locationMatchRadiusMeters: 2.5,
        visualSimilarityPercentage: 91,
        timeClusteringScore: 93,
        citizenSignalSources: ['CivicLens Citizen Mobile App (1)'],
        lastCalculatedAgo: 'Just now'
      },
      isRecurring: false,
      recurrenceCount: 1,
      agingCurve: [
        { day: 1, label: 'Day 1 Intake', riskBoost: 0, isPast: true, isCurrent: true },
        { day: 15, label: 'Day 15 Escalation', riskBoost: 10, isPast: false, isCurrent: false },
        { day: 30, label: 'Day 30 SLA Breach', riskBoost: 22, isPast: false, isCurrent: false },
        { day: 45, label: 'Day 45 Emergency Tier', riskBoost: 32, isPast: false, isCurrent: false }
      ],
      agingThresholdCrossed: false,
      beforeImageUrl: data.imageDataUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
      description: data.description,
      sourceAttribution: 'Citizen Signal — CivicLens App',
      lastUpdated: new Date().toISOString()
    };

    setIncidents((prev) => [newInc, ...prev]);
    setSelectedIncidentId(newInc.id);
    showToast(
      'Signal Received & Verified',
      `Ticket #${newTicket} registered with 92% Civic Confidence.`,
      'success'
    );
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
            smartClosure: {
              matchConfidence: status === 'resolved' ? 96 : 58,
              distanceMeters: 8,
              isLikelyMatch: status === 'resolved',
              visualMatchScore: status === 'resolved' ? 94 : 52,
              explanation:
                status === 'resolved'
                  ? 'Location coordinates match within 8 metres. Structural perimeter landmarks and asphalt aggregate texture align with 94% visual confidence.'
                  : 'Visual match score below threshold (52%). Secondary supervisory inspection required.',
              inspectedAt: new Date().toISOString()
            },
            lastUpdated: new Date().toISOString()
          };
        }
        return inc;
      })
    );

    if (status === 'resolved') {
      showToast(
        'SANKET Smart Closure Match: 96% Verified',
        'Before & after repair photos matched within 8m GPS radius. Incident marked as RESOLVED.',
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
