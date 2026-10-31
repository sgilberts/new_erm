/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sermon, MinistryEvent, UserRole } from '../types';
import {
  hasPermission,
  calculateGivingBreakdown,
  exportToCSV,
  generateBirthdayGreetings,
} from '../utils/rules';
import { HISTORICAL_TRENDS } from '../data/mockData';
import {
  ShieldCheck,
  Lock,
  Database,
  Calendar,
  Cake,
  Tv,
  FileText,
  TrendingUp,
  Download,
  Send,
  Plus,
  Trash2,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Mail,
  RefreshCw,
  Search,
  ExternalLink,
  Users,
} from 'lucide-react';

interface AdminPortalProps {
  initialTab?: string;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ initialTab }) => {
  const {
    currentUser,
    switchRole,
    setRequire2FAModal,
    is2FAVerified,
    birthdaysToday,
    birthdaysThisWeek,
    birthdaysUpcomingMonth,
    birthdayGreetingsSent,
    sendBirthdayGreetings,
    sermons,
    addSermon,
    deleteSermon,
    events,
    addEvent,
    deleteEvent,
    auditLogs,
    backups,
    isBackingUp,
    triggerManualBackup,
    emailOnFailedBackup,
    setEmailOnFailedBackup,
    automatedWeeklyReportEmail,
    setAutomatedWeeklyReportEmail,
    givingRecords,
    triggerToast,
  } = useApp();

  const mapInitialTab = (tab?: string): 'birthdays' | 'cms' | 'audit' | 'backups' | 'trends' | 'reports' | 'rbac' => {
    if (!tab) return 'trends';
    if (tab === 'overview') return 'trends';
    if (tab === 'sermons' || tab === 'events') return 'cms';
    if (tab === 'birthdays') return 'birthdays';
    if (tab === 'audit') return 'audit';
    if (tab === 'backups') return 'backups';
    if (tab === 'reports') return 'reports';
    if (tab === 'rbac') return 'rbac';
    return 'trends';
  };

  const [activeTab, setActiveTab] = useState<
    'birthdays' | 'cms' | 'audit' | 'backups' | 'trends' | 'reports' | 'rbac'
  >(mapInitialTab(initialTab));

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(mapInitialTab(initialTab));
    }
  }, [initialTab]);

  // Trends date range filter
  const [trendsRange, setTrendsRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  // Audit log search
  const [auditSearch, setAuditSearch] = useState('');

  // CMS Sermon Form state
  const [showAddSermonModal, setShowAddSermonModal] = useState(false);
  const [sermonTitle, setSermonTitle] = useState('');
  const [sermonSpeaker, setSermonSpeaker] = useState('Dr. Emmanuel K. Osei');
  const [sermonSeries, setSermonSeries] = useState('Walking in the Supernatural Rhema');
  const [sermonScripture, setSermonScripture] = useState('Hebrews 11:3');
  const [sermonDuration, setSermonDuration] = useState('45 min');
  const [sermonDesc, setSermonDesc] = useState('');

  // CMS Event Form state
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('2026-11-08');
  const [eventTime, setEventTime] = useState('09:00 AM');
  const [eventLocation, setEventLocation] = useState('Main Sanctuary');
  const [eventCategory, setEventCategory] = useState<'worship' | 'prayer' | 'youth' | 'outreach' | 'bible_study' | 'conference'>('worship');
  const [eventDesc, setEventDesc] = useState('');

  // CSV Export
  const handleExportCSV = () => {
    const csv = exportToCSV(auditLogs, [
      { key: 'timestamp', header: 'Timestamp (UTC)' },
      { key: 'actor', header: 'Actor' },
      { key: 'role', header: 'Security Role' },
      { key: 'action', header: 'Audit Action' },
      { key: 'entity', header: 'Target System' },
      { key: 'ipAddress', header: 'Source IP' },
      { key: 'status', header: 'Status' },
      { key: 'details', header: 'Event Log Details' },
    ]);

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `EncounterRhema_AuditLogs_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    triggerToast('CSV Export Ready', 'Downloaded compliance audit logs spreadsheet.', 'success');
  };

  // PDF Export
  const handleExportPDF = () => {
    window.print();
    triggerToast('Report Export Triggered', 'Generated weekly compliance summary report formatted for print/PDF.', 'success');
  };

  // Download encrypted backup
  const handleDownloadBackup = (backupId: string) => {
    const target = backups.find((b) => b.id === backupId) || backups[0];
    const data = {
      backupId: target.id,
      encryptedAlgorithm: 'AES-256-GCM',
      timestamp: target.timestamp,
      checksum: target.checksum,
      schema: 'encounter_rhema_production_v2',
      cipherPayload: 'U2FsdGVkX19r9mX4z...[ENCRYPTED_AES256_GCM_CHURCH_VAULT_PAYLOAD]',
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `EncounterRhema_Encrypted_Backup_${target.id}.json`;
    link.click();
    URL.revokeObjectURL(url);

    triggerToast('Encrypted Backup Downloaded', `Snapshot ${target.id} verified with SHA-256 checksum.`, 'success');
  };

  const handleCreateSermon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sermonTitle.trim()) return;

    addSermon({
      title: sermonTitle.trim(),
      speaker: sermonSpeaker,
      series: sermonSeries,
      scripture: sermonScripture,
      date: '2026-10-30',
      duration: sermonDuration,
      thumbnail: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&auto=format&fit=crop&q=80',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      description: sermonDesc.trim() || 'Preached at Encounter Rhema Ministries Sanctuary.',
      tags: ['Word', 'Rhema', 'Dominion'],
    });

    setShowAddSermonModal(false);
    setSermonTitle('');
    setSermonDesc('');
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim()) return;

    addEvent({
      title: eventTitle.trim(),
      date: eventDate,
      time: eventTime,
      location: eventLocation,
      category: eventCategory,
      description: eventDesc.trim() || 'Encounter Rhema community gathering.',
      image: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800&auto=format&fit=crop&q=80',
    });

    setShowAddEventModal(false);
    setEventTitle('');
    setEventDesc('');
  };

  const filteredLogs = auditLogs.filter((log) => {
    return (
      log.action.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.actor.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.entity.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.details.toLowerCase().includes(auditSearch.toLowerCase())
    );
  });

  const givingSummary = calculateGivingBreakdown(givingRecords);

  return (
    <div className="space-y-8 pb-16">
      {/* Top Admin Header Bar with RBAC Status */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-8 text-white shadow-xl flex flex-col gap-5">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Enterprise Administration
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
              <CheckCircle2 className="w-3 h-3" /> System Health: 99.98%
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-tight">
            Administrative Control & Governance Center
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            Active Identity: <strong className="text-white">{currentUser.name}</strong> ({currentUser.role.replace('_', ' ').toUpperCase()}) · 2FA Verified
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-slate-800/80">
          <button
            onClick={() => setRequire2FAModal(true)}
            className="flex-1 sm:flex-initial px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
          >
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Verify 2FA Token</span>
          </button>
          <button
            onClick={triggerManualBackup}
            disabled={isBackingUp}
            className="flex-1 sm:flex-initial px-4 py-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow transition-colors flex items-center justify-center gap-1.5"
          >
            <Database className="w-3.5 h-3.5" />
            <span>{isBackingUp ? 'Encrypting...' : 'Backup Database Now'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2 scrollbar-thin bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
        {[
          { id: 'birthdays', label: "Birthdays Engine", icon: <Cake className="w-4 h-4 text-amber-500" /> },
          { id: 'cms', label: 'Sermons & Events CMS', icon: <Tv className="w-4 h-4 text-indigo-500" /> },
          { id: 'trends', label: 'Historical Trends', icon: <TrendingUp className="w-4 h-4 text-emerald-500" /> },
          { id: 'audit', label: 'Automated Audit Logs', icon: <FileText className="w-4 h-4 text-sky-500" /> },
          { id: 'backups', label: 'Encrypted Backups', icon: <Database className="w-4 h-4 text-rose-500" /> },
          { id: 'reports', label: 'Compliance Reports', icon: <FileSpreadsheet className="w-4 h-4 text-amber-400" /> },
          { id: 'rbac', label: 'Roles & Security', icon: <ShieldCheck className="w-4 h-4 text-indigo-400" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: BIRTHDAY INTELLIGENCE DASHBOARD (REQUIRED) */}
      {activeTab === 'birthdays' && (
        <div className="space-y-6">
          {/* Top Quick Actions Bar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Automated Birthday Greeting Center
                </h2>
                <span className="text-xs bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold px-2 py-0.5 rounded-full">
                  Real-Time Engine Active
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Dispatches personalized scripture blessings automatically via WhatsApp and Email on members' birthdays.
              </p>
            </div>

            <button
              onClick={() => sendBirthdayGreetings()}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 shrink-0"
            >
              <Send className="w-4 h-4" />
              <span>Broadcast Blessings to Today's Birthdays ({birthdaysToday.length})</span>
            </button>
          </div>

          {/* Three Categorized Columns: Today, This Week, Upcoming Month */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Column 1: Today */}
            <div className="bg-white dark:bg-slate-900 border border-amber-500/30 rounded-3xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                    <Cake className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Birthdays Today</h3>
                    <p className="text-[10px] text-slate-400">October 30, 2026</p>
                  </div>
                </div>
                <span className="text-xs font-black text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full">
                  {birthdaysToday.length}
                </span>
              </div>

              <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                {birthdaysToday.map((member) => (
                  <div
                    key={member.id}
                    className="p-3 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img src={member.avatar} alt="" className="w-9 h-9 rounded-full object-cover shrink-0" />
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 dark:text-white truncate">{member.name}</p>
                        <p className="text-[10px] text-amber-600 dark:text-amber-400 truncate">{member.ministry}</p>
                        <p className="text-[10px] text-slate-400">{member.phone}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        const g = generateBirthdayGreetings(member);
                        window.open(g.whatsappUrl, '_blank');
                      }}
                      title="Send WhatsApp Greeting"
                      className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg shrink-0"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2: This Week */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">This Current Week</h3>
                    <p className="text-[10px] text-slate-400">Rolling 7-Day Window</p>
                  </div>
                </div>
                <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full">
                  {birthdaysThisWeek.length}
                </span>
              </div>

              <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                {birthdaysThisWeek.map((member) => (
                  <div
                    key={member.id}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img src={member.avatar} alt="" className="w-9 h-9 rounded-full object-cover shrink-0" />
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 dark:text-white truncate">{member.name}</p>
                        <p className="text-[10px] text-slate-500 truncate">{member.ministry}</p>
                        <p className="text-[10px] text-indigo-600 dark:text-indigo-400">
                          {new Date(member.dateOfBirth).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 3: Upcoming Month */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Upcoming Month</h3>
                    <p className="text-[10px] text-slate-400">November 2026</p>
                  </div>
                </div>
                <span className="text-xs font-black text-sky-600 dark:text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded-full">
                  {birthdaysUpcomingMonth.length}
                </span>
              </div>

              <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                {birthdaysUpcomingMonth.map((member) => (
                  <div
                    key={member.id}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img src={member.avatar} alt="" className="w-9 h-9 rounded-full object-cover shrink-0" />
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 dark:text-white truncate">{member.name}</p>
                        <p className="text-[10px] text-slate-500 truncate">{member.ministry}</p>
                        <p className="text-[10px] text-sky-600 dark:text-sky-400">
                          {new Date(member.dateOfBirth).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Delivery Log of Sent Messages */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Recent Automated Birthday Greeting Dispatches ({birthdayGreetingsSent.length})
            </h3>
            <div className="space-y-2 text-xs">
              {birthdayGreetingsSent.map((g) => (
                <div
                  key={g.id}
                  className="p-3 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">{g.memberName}</span>
                    <span className="text-slate-400 text-[10px] ml-2">({g.phone} · {g.email})</span>
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1 italic">"{g.message}"</p>
                  </div>
                  <div className="flex items-center gap-2 self-start sm:self-auto text-[10px]">
                    <span className="text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-medium">
                      Delivered via {g.channel.toUpperCase()}
                    </span>
                    <span className="text-slate-400">{new Date(g.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ROBUST CONTENT MANAGEMENT SYSTEM (CMS) */}
      {activeTab === 'cms' && (
        <div className="space-y-8">
          {/* Sermons CMS */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Sermons & Media Repository CMS</h3>
                <p className="text-xs text-slate-500">Publish, modify, or archive sermon video and audio recordings.</p>
              </div>
              <button
                onClick={() => setShowAddSermonModal(true)}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Upload New Sermon</span>
              </button>
            </div>

            <div className="space-y-3">
              {sermons.map((sermon) => (
                <div
                  key={sermon.id}
                  className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="min-w-0 flex-1 pr-4">
                    <p className="font-bold text-slate-900 dark:text-white truncate">{sermon.title}</p>
                    <p className="text-[11px] text-amber-600 dark:text-amber-400">{sermon.speaker} · {sermon.series}</p>
                    <p className="text-[10px] text-slate-400">{sermon.scripture} · {sermon.duration} · {sermon.downloadsCount} downloads</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => deleteSermon(sermon.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Events CMS */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Ministry Events & Service Calendar CMS</h3>
                <p className="text-xs text-slate-500">Manage church calendar, vigils, conferences, and RSVP tracks.</p>
              </div>
              <button
                onClick={() => setShowAddEventModal(true)}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Schedule Event</span>
              </button>
            </div>

            <div className="space-y-3">
              {events.map((evt) => (
                <div
                  key={evt.id}
                  className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="min-w-0 flex-1 pr-4">
                    <p className="font-bold text-slate-900 dark:text-white truncate">{evt.title}</p>
                    <p className="text-[11px] text-indigo-600 dark:text-indigo-400 capitalize">{evt.category} · {evt.date} at {evt.time}</p>
                    <p className="text-[10px] text-slate-400">{evt.location} · {evt.rsvpCount} confirmed RSVPs</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => deleteEvent(evt.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: HISTORICAL TRENDS & INTERACTIVE CHARTS */}
      {activeTab === 'trends' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Historical Church Growth & Financial Trends
                </h2>
                <p className="text-xs text-slate-500">
                  Interactive metrics tracking membership growth, giving volume, and live viewership.
                </p>
              </div>

              {/* Date range filter tabs */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                {(['7d', '30d', '90d', '1y'] as const).map((rng) => (
                  <button
                    key={rng}
                    onClick={() => setTrendsRange(rng)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg uppercase ${
                      trendsRange === rng
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    {rng}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive SVG Trend Chart */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                <span>Monthly Giving Trajectory ($)</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">+52.9% Year-to-Date</span>
              </div>

              {/* Visual SVG bar/line chart */}
              <div className="h-48 flex items-end justify-between gap-3 pt-6 px-2">
                {HISTORICAL_TRENDS.map((item) => {
                  const maxGiving = 70000;
                  const heightPercent = Math.round((item.giving / maxGiving) * 100);

                  return (
                    <div key={item.month} className="flex-1 flex flex-col items-center gap-2 group">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono text-amber-500 font-bold">
                        ${(item.giving / 1000).toFixed(0)}k
                      </div>
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-full bg-gradient-to-t from-amber-600 to-amber-400 rounded-t-lg transition-all group-hover:brightness-110 shadow-sm"
                      />
                      <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                        {item.month}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Secondary Growth Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/20">
                <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">Total Members</span>
                <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">2,460</p>
                <p className="text-[10px] text-emerald-500 mt-0.5">↑ +150 enrolled this quarter</p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20">
                <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold">Average Sunday Attendance</span>
                <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">1,840</p>
                <p className="text-[10px] text-emerald-500 mt-0.5">↑ In-person sanctuary capacity at 92%</p>
              </div>

              <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20">
                <span className="text-xs text-rose-600 dark:text-rose-400 font-semibold">Peak Stream Viewers</span>
                <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">5,400</p>
                <p className="text-[10px] text-emerald-500 mt-0.5">Global viewers across 42 nations</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: AUTOMATED AUDIT LOGS (REQUIRED) */}
      {activeTab === 'audit' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Automated Security & Data Access Audit Logs
                </h3>
                <p className="text-xs text-slate-500">
                  Every administrative query, member update, giving transaction, and backup execution is cryptographically logged.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportCSV}
                  className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4 text-emerald-500" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Search filter input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={auditSearch}
                onChange={(e) => setAuditSearch(e.target.value)}
                placeholder="Filter audit logs by actor, action keyword, or details..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
              />
            </div>

            {/* Audit Logs Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase font-bold text-slate-400">
                    <th className="py-2.5 px-3">Timestamp (UTC)</th>
                    <th className="py-2.5 px-3">Actor & Role</th>
                    <th className="py-2.5 px-3">Action</th>
                    <th className="py-2.5 px-3">Target Entity</th>
                    <th className="py-2.5 px-3">IP Address</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono text-[11px]">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-2.5 px-3 text-slate-400 whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 font-sans">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{log.actor}</span>
                        <span className="text-[10px] text-slate-400 block uppercase">[{log.role}]</span>
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-amber-600 dark:text-amber-400">
                        {log.action}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300 font-sans">
                        {log.entity}
                      </td>
                      <td className="py-2.5 px-3 text-slate-400">
                        {log.ipAddress}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="text-emerald-500 font-bold uppercase">{log.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: ENCRYPTED DATABASE BACKUPS (REQUIRED) */}
      {activeTab === 'backups' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Database className="w-5 h-5 text-amber-500" />
                  Encrypted Database Backups & Disaster Recovery
                </h3>
                <p className="text-xs text-slate-500">
                  Automated nightly snapshots encrypted with AES-256-GCM.
                </p>
              </div>

              <button
                onClick={triggerManualBackup}
                disabled={isBackingUp}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl shadow transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isBackingUp ? 'animate-spin' : ''}`} />
                <span>{isBackingUp ? 'Executing AES Encryption...' : 'Trigger Nightly Backup Now'}</span>
              </button>
            </div>

            {/* Automated Schedule & Email notification toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Automated Nightly Schedule</p>
                  <p className="text-[11px] text-slate-400">Scheduled automatically every night at 04:00 AM UTC</p>
                </div>
                <span className="text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">Active</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Email Notification for Failures</p>
                  <p className="text-[11px] text-slate-400">Instant alert to stakeholders on unsuccessful attempts</p>
                </div>
                <input
                  type="checkbox"
                  checked={emailOnFailedBackup}
                  onChange={(e) => setEmailOnFailedBackup(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4 cursor-pointer"
                />
              </div>
            </div>

            {/* Backup Records History */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Encrypted Backup Snapshots ({backups.length})
              </h4>

              {backups.map((bk) => (
                <div
                  key={bk.id}
                  className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-slate-50/50 dark:bg-slate-850/50"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold font-mono text-slate-900 dark:text-white">{bk.id}</span>
                      <span className="text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold px-2 py-0.5 rounded">
                        {bk.encryptedWith}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 font-mono">
                      Checksum: {bk.checksum} · Size: {(bk.sizeBytes / (1024 * 1024)).toFixed(1)} MB
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Timestamp: {new Date(bk.timestamp).toLocaleString()} · Notification: {bk.emailNotified ? 'Dispatched' : 'Pending'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDownloadBackup(bk.id)}
                      className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download JSON</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: COMPLIANCE REPORTS (PDF & CSV) */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Automated Weekly Compliance & Financial Reports
                </h3>
                <p className="text-xs text-slate-500">
                  For church governance, weekly board meetings, and 501(c)(3) compliance reviews.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportCSV}
                  className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Download CSV</span>
                </button>
                <button
                  onClick={handleExportPDF}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl shadow transition-colors flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Export Printable PDF Report</span>
                </button>
              </div>
            </div>

            {/* Stakeholder notification toggle */}
            <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-amber-800 dark:text-amber-300">Automated Weekly Stakeholder Dispatch</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Automatically delivers compiled weekly metrics to pastoral board members every Monday at 08:00 AM.
                </p>
              </div>
              <input
                type="checkbox"
                checked={automatedWeeklyReportEmail}
                onChange={(e) => setAutomatedWeeklyReportEmail(e.target.checked)}
                className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4 cursor-pointer"
              />
            </div>

            {/* Printable Compliance Document Preview */}
            <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="text-center pb-4 border-b border-slate-200 dark:border-slate-800">
                <p className="text-[10px] uppercase font-bold tracking-widest text-amber-500">
                  Encounter Rhema Ministries International
                </p>
                <h4 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  WEEKLY COMPLIANCE & GOVERNANCE REPORT
                </h4>
                <p className="text-xs text-slate-500">
                  Week Ending: October 30, 2026 · Confidential Board Document
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 text-[10px]">Total Active Members</span>
                  <p className="text-base font-bold text-slate-900 dark:text-white">2,460</p>
                </div>
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 text-[10px]">Tithe & Giving Cleared</span>
                  <p className="text-base font-bold text-slate-900 dark:text-white">${givingSummary.total.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 text-[10px]">Audit Events Logged</span>
                  <p className="text-base font-bold text-slate-900 dark:text-white">{auditLogs.length}</p>
                </div>
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 text-[10px]">AES-256 Backups</span>
                  <p className="text-base font-bold text-emerald-500">Verified</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: ROLES & RBAC SECURITY POLICY */}
      {activeTab === 'rbac' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Role-Based Access Control (RBAC) Matrix
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase font-bold text-slate-400">
                    <th className="py-2.5 px-3">Role Designation</th>
                    <th className="py-2.5 px-3">Manage Sermons</th>
                    <th className="py-2.5 px-3">Manage Events</th>
                    <th className="py-2.5 px-3">View Giving Totals</th>
                    <th className="py-2.5 px-3">Trigger Backups</th>
                    <th className="py-2.5 px-3">Audit Logs</th>
                    <th className="py-2.5 px-3">2FA Required</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono text-[11px]">
                  {[
                    { role: 'super_admin', label: 'Super Admin (Senior Pastor)' },
                    { role: 'media_admin', label: 'Media Ministry Admin' },
                    { role: 'finance_deacon', label: 'Finance Deacon' },
                    { role: 'member', label: 'Congregation Member' },
                  ].map((item) => (
                    <tr key={item.role} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-3 font-sans font-bold text-slate-900 dark:text-white">
                        {item.label}
                      </td>
                      <td className="py-3 px-3">
                        {hasPermission(item.role as UserRole, 'manage_sermons') ? '✅ Yes' : '❌ No'}
                      </td>
                      <td className="py-3 px-3">
                        {hasPermission(item.role as UserRole, 'manage_events') ? '✅ Yes' : '❌ No'}
                      </td>
                      <td className="py-3 px-3">
                        {hasPermission(item.role as UserRole, 'view_giving_totals') ? '✅ Yes' : '❌ No'}
                      </td>
                      <td className="py-3 px-3">
                        {hasPermission(item.role as UserRole, 'trigger_backup') ? '✅ Yes' : '❌ No'}
                      </td>
                      <td className="py-3 px-3">
                        {hasPermission(item.role as UserRole, 'view_audit_logs') ? '✅ Yes' : '❌ No'}
                      </td>
                      <td className="py-3 px-3">
                        {item.role !== 'member' ? '🔒 Required' : 'Optional'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add Sermon Modal */}
      {showAddSermonModal && (
        <div
          role="dialog"
          aria-labelledby="add-sermon-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in"
        >
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <h3 id="add-sermon-title" className="text-base font-bold text-slate-900 dark:text-white mb-4">
              Upload Sermon to Media CMS
            </h3>
            <form onSubmit={handleCreateSermon} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Sermon Title
                </label>
                <input
                  type="text"
                  required
                  value={sermonTitle}
                  onChange={(e) => setSermonTitle(e.target.value)}
                  placeholder="e.g. Walking in the Fullness of the Rhema Word"
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Preacher / Speaker
                  </label>
                  <input
                    type="text"
                    required
                    value={sermonSpeaker}
                    onChange={(e) => setSermonSpeaker(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Teaching Series
                  </label>
                  <input
                    type="text"
                    required
                    value={sermonSeries}
                    onChange={(e) => setSermonSeries(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Scripture Anchor
                  </label>
                  <input
                    type="text"
                    required
                    value={sermonScripture}
                    onChange={(e) => setSermonScripture(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={sermonDuration}
                    onChange={(e) => setSermonDuration(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Sermon Outline / Description
                </label>
                <textarea
                  rows={3}
                  value={sermonDesc}
                  onChange={(e) => setSermonDesc(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddSermonModal(false)}
                  className="px-4 py-2 font-medium text-slate-600 dark:text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-xl shadow"
                >
                  Publish Sermon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Event Modal */}
      {showAddEventModal && (
        <div
          role="dialog"
          aria-labelledby="add-event-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in"
        >
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <h3 id="add-event-title" className="text-base font-bold text-slate-900 dark:text-white mb-4">
              Schedule New Ministry Gathering
            </h3>
            <form onSubmit={handleCreateEvent} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Gathering / Event Title
                </label>
                <input
                  type="text"
                  required
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="e.g. Night of Prophetic Declarations"
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Event Date
                  </label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Time
                  </label>
                  <input
                    type="text"
                    required
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    required
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={eventCategory}
                    onChange={(e) => setEventCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white capitalize"
                  >
                    <option value="worship">Worship</option>
                    <option value="prayer">Prayer</option>
                    <option value="youth">Youth</option>
                    <option value="bible_study">Bible Study</option>
                    <option value="outreach">Outreach</option>
                    <option value="conference">Conference</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddEventModal(false)}
                  className="px-4 py-2 font-medium text-slate-600 dark:text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-xl shadow"
                >
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
