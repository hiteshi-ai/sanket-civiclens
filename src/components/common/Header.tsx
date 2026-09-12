import React, { useState } from 'react';
import { useCivic } from '../../context/CivicContext';
import {
  Bell,
  Wifi,
  WifiOff,
  RefreshCw,
  Building2,
  CheckCircle2,
  Clock,
  Flame,
  AlertTriangle
} from 'lucide-react';

export const Header: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const {
    isOffline,
    toggleOffline,
    offlineQueue,
    syncOfflineQueue,
    isSyncing,
    notifications,
    unreadNotificationCount,
    markNotificationRead,
    clearAllNotifications,
    selectIncident,
    setActiveTab
  } = useCivic();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 bg-[#FBFBF9]/90 backdrop-blur-md border-b border-[#E5E3DC] px-4 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Organization & Context */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F4F3EF] border border-[#E5E3DC] text-xs font-semibold text-[#191B1F]">
            <Building2 className="w-3.5 h-3.5 text-[#2C5E48]" />
            <span>CivicLens</span>
          </div>
        </div>

        {/* Right Controls: Offline Simulator, Notifications, User Profile */}
        <div className="flex items-center gap-2.5">
          {/* Offline Simulator Switcher */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={toggleOffline}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                isOffline
                  ? 'bg-[#FDF0ED] border-[#F8D2CA] text-[#C54E38]'
                  : 'bg-[#F4F3EF] border-[#E5E3DC] text-[#565C68] hover:bg-[#ECEAE3]'
              }`}
              title="Toggle Offline Simulation for Remote Regions"
            >
              {isOffline ? (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-[#C54E38]" />
                  <span className="font-semibold">Simulate: Offline</span>
                </>
              ) : (
                <>
                  <Wifi className="w-3.5 h-3.5 text-[#1E6B42]" />
                  <span className="hidden sm:inline">Online</span>
                </>
              )}
            </button>

            {/* Offline Sync Button when items pending */}
            {offlineQueue.length > 0 && !isOffline && (
              <button
                onClick={syncOfflineQueue}
                disabled={isSyncing}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-[#2C5E48] text-white hover:bg-[#1E4333] transition-colors shadow-sm disabled:opacity-50"
                title="Sync offline cached reports with SANKET"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>Sync ({offlineQueue.length})</span>
              </button>
            )}
          </div>

          {/* Notifications Trigger */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative p-2 rounded-lg bg-[#F4F3EF] hover:bg-[#ECEAE3] border border-[#E5E3DC] text-[#565C68] transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#C54E38] text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadNotificationCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-[#E5E3DC] py-2 z-50">
                <div className="flex items-center justify-between px-4 py-2 border-b border-[#E5E3DC]">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#191B1F]">Municipal Alerts</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#FDF0ED] text-[#C54E38]">
                      {unreadNotificationCount} new
                    </span>
                  </div>
                  <button
                    onClick={clearAllNotifications}
                    className="text-[11px] text-[#2C5E48] hover:underline font-semibold"
                  >
                    Mark all read
                  </button>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-[#F4F3EF]">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-xs text-[#7E8592]">No notifications</div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          markNotificationRead(notif.id);
                          if (notif.incidentId) {
                            selectIncident(notif.incidentId, true);
                            setActiveTab('incidents');
                            setIsNotifOpen(false);
                          }
                        }}
                        className={`p-3 text-left hover:bg-[#FBFBF9] cursor-pointer transition-colors ${
                          !notif.read ? 'bg-[#FAF9F5]' : ''
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          {notif.type === 'urgent' && <Flame className="w-4 h-4 text-[#C54E38] shrink-0 mt-0.5" />}
                          {notif.type === 'warning' && <AlertTriangle className="w-4 h-4 text-[#C88427] shrink-0 mt-0.5" />}
                          {notif.type === 'verified' && <CheckCircle2 className="w-4 h-4 text-[#1E6B42] shrink-0 mt-0.5" />}
                          {notif.type === 'info' && <Clock className="w-4 h-4 text-[#2C5E48] shrink-0 mt-0.5" />}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-[#191B1F] truncate">{notif.title}</p>
                            <p className="text-[11px] text-[#565C68] mt-0.5 leading-relaxed">{notif.message}</p>
                            <span className="text-[10px] text-[#7E8592] mt-1 block font-mono">{notif.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-[#E5E3DC]">
            <div className="w-7 h-7 rounded-full bg-[#EBF3EE] border border-[#C5DDD0] text-[#2C5E48] flex items-center justify-center font-bold text-xs">
              VS
            </div>
            <div className="text-left text-xs leading-tight">
              <span className="font-semibold block text-[#191B1F]">Off. V. Sen</span>
              <span className="text-[10px] text-[#7E8592]">PWD Ops Lead</span>
            </div>
          </div>
          <button onClick={onLogout} className="px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-[#E5E3DC] text-[#565C68] hover:bg-[#F4F3EF]">Logout</button>
        </div>
      </div>
    </header>
  );
};
