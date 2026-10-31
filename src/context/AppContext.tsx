/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Member,
  Sermon,
  MinistryEvent,
  Testimony,
  GivingRecord,
  AuditLog,
  BackupRecord,
  ChatMessage,
  UserRole,
  UserProfile,
  BirthdayGreeting,
  PrayerRequest,
  PrayerRequestStatus,
  ThemeMode,
} from '../types';
import {
  INITIAL_MEMBERS,
  INITIAL_SERMONS,
  INITIAL_EVENTS,
  INITIAL_TESTIMONIES,
  INITIAL_GIVING_RECORDS,
  INITIAL_AUDIT_LOGS,
  INITIAL_BACKUPS,
  INITIAL_CHAT_MESSAGES,
  INITIAL_PRAYER_REQUESTS,
} from '../data/mockData';
import {
  getBirthdaysToday,
  getBirthdaysThisWeek,
  getBirthdaysUpcomingMonth,
  generateBirthdayGreetings,
  generateEncryptedBackupMetadata,
  exportToCSV,
  resolveTheme,
} from '../utils/rules';

export type PageView =
  | 'home'
  | 'about'
  | 'testimonies'
  | 'media'
  | 'events'
  | 'giving'
  | 'live'
  | 'directory'
  | 'contact'
  | 'admin'
  | 'prayer_requests';

interface AppContextType {
  currentPage: PageView;
  setCurrentPage: (page: PageView) => void;
  isDark: boolean;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleDarkMode: () => void;
  isMobileDeviceView: boolean;
  setIsMobileDeviceView: (val: boolean | ((prev: boolean) => boolean)) => void;

  // Admin Dashboard & Session State
  isLoggedIn: boolean;
  isInAdminDashboard: boolean;
  setIsInAdminDashboard: (val: boolean) => void;
  showLoginModal: boolean;
  setShowLoginModal: (val: boolean) => void;
  showLogoutConfirmModal: boolean;
  setShowLogoutConfirmModal: (val: boolean) => void;
  loginUser: (role: UserRole) => void;
  logoutUser: () => void;
  adminActiveSection: string;
  setAdminActiveSection: (section: string) => void;
  isAsideOpen: boolean;
  setIsAsideOpen: (val: boolean | ((prev: boolean) => boolean)) => void;

  // Prayer Requests Module
  prayerRequests: PrayerRequest[];
  addPrayerRequest: (data: {
    title: string;
    description: string;
    category: PrayerRequest['category'];
    isPrivate: boolean;
    phone?: string;
  }) => void;
  updatePrayerStatus: (requestId: string, status: PrayerRequestStatus, note?: string) => void;
  intercedeForPrayer: (requestId: string) => void;
  deletePrayerRequest: (requestId: string) => void;

  // Auth & RBAC
  currentUser: UserProfile;
  switchRole: (role: UserRole) => void;
  is2FAVerified: boolean;
  verify2FA: (code: string) => boolean;
  require2FAModal: boolean;
  setRequire2FAModal: (val: boolean) => void;

  // Members & Birthdays
  members: Member[];
  birthdaysToday: Member[];
  birthdaysThisWeek: Member[];
  birthdaysUpcomingMonth: Member[];
  birthdayGreetingsSent: BirthdayGreeting[];
  sendBirthdayGreetings: (memberId?: string) => void;
  addMember: (member: Omit<Member, 'id'>) => void;

  // Sermons & CMS
  sermons: Sermon[];
  addSermon: (sermon: Omit<Sermon, 'id' | 'downloadsCount'>) => void;
  updateSermon: (id: string, updated: Partial<Sermon>) => void;
  deleteSermon: (id: string) => void;
  activeSermonForPlayer: Sermon | null;
  setActiveSermonForPlayer: (sermon: Sermon | null) => void;

  // Events
  events: MinistryEvent[];
  toggleRSVP: (id: string) => void;
  addEvent: (event: Omit<MinistryEvent, 'id' | 'rsvpCount'>) => void;
  deleteEvent: (id: string) => void;

  // Testimonies
  testimonies: Testimony[];
  rejoiceTestimony: (id: string) => void;
  addTestimony: (testimony: Omit<Testimony, 'id' | 'rejoiceCount' | 'date' | 'approved'>) => void;
  approveTestimony: (id: string) => void;

  // Giving
  givingRecords: GivingRecord[];
  addGivingRecord: (record: Omit<GivingRecord, 'id' | 'transactionRef' | 'timestamp' | 'receiptNumber'>) => GivingRecord;
  lastGeneratedReceipt: GivingRecord | null;
  setLastGeneratedReceipt: (receipt: GivingRecord | null) => void;

  // Audit Logs & Security
  auditLogs: AuditLog[];
  logAuditEvent: (action: string, entity: string, details: string, status?: 'success' | 'warning' | 'alert') => void;

  // Backups
  backups: BackupRecord[];
  isBackingUp: boolean;
  triggerManualBackup: () => void;
  emailOnFailedBackup: boolean;
  setEmailOnFailedBackup: (val: boolean) => void;
  automatedWeeklyReportEmail: boolean;
  setAutomatedWeeklyReportEmail: (val: boolean) => void;

  // Chat / Pastoral Care Support
  chatMessages: ChatMessage[];
  sendChatMessage: (text: string, fileAttachment?: ChatMessage['fileAttachment']) => void;
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;

  // Push Notifications
  pushNotificationsEnabled: boolean;
  togglePushNotifications: () => void;
  activeToast: { title: string; message: string; type?: 'info' | 'success' | 'alert' } | null;
  dismissToast: () => void;
  triggerToast: (title: string, message: string, type?: 'info' | 'success' | 'alert') => void;

  // Prayer Request
  submitPrayerRequest: (data: { name: string; phone: string; email: string; request: string; isConfidential: boolean }) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const REFERENCE_DATE = new Date('2026-10-30T12:00:00Z');

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [themeMode, setThemeMode] = useState<ThemeMode>('dark');
  const [isMobileDeviceView, setIsMobileDeviceView] = useState<boolean>(false);

  // Authentication & CMS Dashboard Session State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isInAdminDashboard, setIsInAdminDashboard] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [showLogoutConfirmModal, setShowLogoutConfirmModal] = useState<boolean>(false);
  const [adminActiveSection, setAdminActiveSection] = useState<string>('overview');
  const [isAsideOpen, setIsAsideOpen] = useState<boolean>(false);

  // User Profile & Roles (defaults to congregation visitor when logged out)
  const [currentUser, setCurrentUser] = useState<UserProfile>({
    id: 'usr-guest',
    name: 'Sister Deborah Vance',
    email: 'deborah.v@rhema.org',
    phone: '+1 (555) 234-5678',
    role: 'member',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    department: 'Worship & Creative Arts',
    birthday: '1992-10-30',
    twoFactorEnabled: false,
    memberSince: '2021-04-12',
  });
  const [is2FAVerified, setIs2FAVerified] = useState<boolean>(true);
  const [require2FAModal, setRequire2FAModal] = useState<boolean>(false);

  // Entities
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>(INITIAL_PRAYER_REQUESTS);
  const [sermons, setSermons] = useState<Sermon[]>(INITIAL_SERMONS);
  const [activeSermonForPlayer, setActiveSermonForPlayer] = useState<Sermon | null>(INITIAL_SERMONS[0]);
  const [events, setEvents] = useState<MinistryEvent[]>(INITIAL_EVENTS);
  const [testimonies, setTestimonies] = useState<Testimony[]>(INITIAL_TESTIMONIES);
  const [givingRecords, setGivingRecords] = useState<GivingRecord[]>(INITIAL_GIVING_RECORDS);
  const [lastGeneratedReceipt, setLastGeneratedReceipt] = useState<GivingRecord | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [backups, setBackups] = useState<BackupRecord[]>(INITIAL_BACKUPS);
  const [isBackingUp, setIsBackingUp] = useState<boolean>(false);
  const [emailOnFailedBackup, setEmailOnFailedBackup] = useState<boolean>(true);
  const [automatedWeeklyReportEmail, setAutomatedWeeklyReportEmail] = useState<boolean>(true);

  // Chat
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

  // Push notifications
  const [pushNotificationsEnabled, setPushNotificationsEnabled] = useState<boolean>(true);
  const [activeToast, setActiveToast] = useState<{ title: string; message: string; type?: 'info' | 'success' | 'alert' } | null>(null);

  // Birthday Greetings Log
  const [birthdayGreetingsSent, setBirthdayGreetingsSent] = useState<BirthdayGreeting[]>([
    {
      id: 'bg-01',
      memberId: 'mem-01',
      memberName: 'Sister Deborah Vance',
      phone: '+1 (555) 234-5678',
      email: 'deborah.v@rhema.org',
      channel: 'whatsapp',
      message: 'Happy Birthday, Beloved Sister Deborah Vance! Encounter Rhema Ministries celebrates you today!',
      timestamp: '2026-10-30T06:00:00Z',
      status: 'delivered',
      triggeredBy: 'automated_cron',
    },
  ]);

  // Compute active dark state based on themeMode and system preference
  const [isDark, setIsDark] = useState<boolean>(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const checkDark = () => {
      const active = resolveTheme(themeMode, mediaQuery.matches) === 'dark';
      setIsDark(active);
      if (active) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    checkDark();
    const listener = () => checkDark();
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, [themeMode]);

  const toggleDarkMode = () => {
    setThemeMode((prev) => (prev === 'dark' ? 'light' : prev === 'light' ? 'system' : 'dark'));
  };

  const triggerToast = (title: string, message: string, type: 'info' | 'success' | 'alert' = 'info') => {
    setActiveToast({ title, message, type });
    setTimeout(() => {
      setActiveToast((curr) => (curr?.title === title ? null : curr));
    }, 5000);
  };

  const dismissToast = () => setActiveToast(null);

  const loginUser = (role: UserRole) => {
    let profile: UserProfile = {
      id: 'usr-01',
      name: 'Dr. Emmanuel K. Osei',
      email: 'dr.osei@rhema.org',
      phone: '+1 (555) 019-2831',
      role: 'super_admin',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
      department: 'Senior Pastoral Council',
      birthday: '1978-06-14',
      twoFactorEnabled: true,
      memberSince: '2016-01-10',
    };

    if (role === 'chat_member') {
      profile = {
        id: 'usr-02',
        name: 'Pastor Josiah Hamilton',
        email: 'josiah.h@rhema.org',
        phone: '+1 (555) 876-5432',
        role: 'chat_member',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
        department: 'Pastoral Care & Counseling Desk',
        birthday: '1984-10-30',
        twoFactorEnabled: true,
        memberSince: '2018-05-15',
      };
    } else if (role === 'media_admin') {
      profile = {
        id: 'usr-03',
        name: 'Brother Samuel Mensah',
        email: 'samuel.m@rhema.org',
        phone: '+1 (555) 678-9012',
        role: 'media_admin',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
        department: 'Media & Livestream Broadcast',
        birthday: '1995-11-12',
        twoFactorEnabled: true,
        memberSince: '2020-02-01',
      };
    } else if (role === 'finance_deacon') {
      profile = {
        id: 'usr-04',
        name: 'Elder Marcus Thorne',
        email: 'marcus.t@rhema.org',
        phone: '+1 (555) 456-7890',
        role: 'finance_deacon',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
        department: 'Financial Stewardship & Governance',
        birthday: '1982-11-02',
        twoFactorEnabled: true,
        memberSince: '2017-09-20',
      };
    }

    setCurrentUser(profile);
    setIsLoggedIn(true);
    setIsInAdminDashboard(true);
    setShowLoginModal(false);
    setAdminActiveSection('overview');

    logAuditEvent(
      'ADMIN_LOGIN_SUCCESS',
      'Security Gateway',
      `Authenticated ${profile.name} (${profile.role.toUpperCase()}) to CMS Admin Suite.`
    );
    triggerToast(
      'Authentication Successful',
      `Welcome to Encounter Rhema CMS Dashboard, ${profile.name}.`,
      'success'
    );
  };

  const logoutUser = () => {
    const priorName = currentUser.name;
    setIsLoggedIn(false);
    setIsInAdminDashboard(false);
    setShowLogoutConfirmModal(false);
    setCurrentPage('home');

    // Reset to public visitor
    setCurrentUser({
      id: 'usr-guest',
      name: 'Sister Deborah Vance',
      email: 'deborah.v@rhema.org',
      phone: '+1 (555) 234-5678',
      role: 'member',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      department: 'Worship & Creative Arts',
      birthday: '1992-10-30',
      twoFactorEnabled: false,
      memberSince: '2021-04-12',
    });

    logAuditEvent(
      'ADMIN_LOGOUT_COMPLETED',
      'Security Gateway',
      `Administrative session ended for ${priorName}. Returned to public sanctuary.`
    );
    triggerToast('Logged Out', 'Administrative session safely terminated.', 'info');
  };

  const togglePushNotifications = () => {
    setPushNotificationsEnabled((prev) => {
      const next = !prev;
      triggerToast(
        next ? 'Push Notifications Enabled' : 'Push Notifications Muted',
        next ? 'You will receive critical prayer alerts and service reminders.' : 'Notifications have been paused.',
        'info'
      );
      return next;
    });
  };

  const logAuditEvent = (action: string, entity: string, details: string, status: 'success' | 'warning' | 'alert' = 'success') => {
    const newLog: AuditLog = {
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      actor: currentUser.name,
      role: currentUser.role,
      action,
      entity,
      ipAddress: '192.168.1.104',
      status,
      details,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const switchRole = (newRole: UserRole) => {
    let name = 'Dr. Emmanuel K. Osei';
    let email = 'e.osei@encounterrhema.org';
    let dept = 'Senior Pastoral Council';

    if (newRole === 'media_admin') {
      name = 'Brother Samuel Mensah';
      email = 'samuel.m@rhema.org';
      dept = 'Media & Livestream Broadcast';
    } else if (newRole === 'finance_deacon') {
      name = 'Elder Marcus Thorne';
      email = 'marcus.t@rhema.org';
      dept = 'Financial Stewardship Council';
    } else if (newRole === 'member') {
      name = 'Sister Deborah Vance';
      email = 'deborah.v@rhema.org';
      dept = 'Worship & Creative Arts';
    }

    setCurrentUser({
      ...currentUser,
      role: newRole,
      name,
      email,
      department: dept,
    });

    logAuditEvent('ROLE_SWITCH', 'User Session', `Switched active authorization context to ${newRole.toUpperCase()}.`);
    triggerToast('Role Authorization Updated', `Now acting as ${name} (${newRole.replace('_', ' ').toUpperCase()})`, 'info');
  };

  const verify2FA = (code: string): boolean => {
    if (code.trim().length === 6 && /^\d+$/.test(code.trim())) {
      setIs2FAVerified(true);
      setRequire2FAModal(false);
      logAuditEvent('2FA_VERIFICATION', 'Security Gateway', 'Two-Factor Authentication challenge successfully passed.');
      triggerToast('2FA Challenge Verified', 'Administrative cryptographic security token validated.', 'success');
      return true;
    }
    logAuditEvent('2FA_VERIFICATION_FAILED', 'Security Gateway', `Failed 2FA submission attempt: ${code}`, 'warning');
    triggerToast('Invalid Token', 'The 6-digit TOTP code must match your authenticator application.', 'alert');
    return false;
  };

  // Birthdays computed dynamically
  const birthdaysToday = getBirthdaysToday(members, REFERENCE_DATE);
  const birthdaysThisWeek = getBirthdaysThisWeek(members, REFERENCE_DATE);
  const birthdaysUpcomingMonth = getBirthdaysUpcomingMonth(members, REFERENCE_DATE);

  const sendBirthdayGreetings = (memberId?: string) => {
    const targets = memberId ? members.filter((m) => m.id === memberId) : birthdaysToday;
    if (targets.length === 0) {
      triggerToast('No Birthdays Selected', 'There are no members selected for birthday broadcast.', 'info');
      return;
    }

    const newGreetings: BirthdayGreeting[] = targets.map((member) => {
      const generated = generateBirthdayGreetings(member);
      return {
        id: `bg-${Date.now()}-${member.id}`,
        memberId: member.id,
        memberName: member.name,
        phone: member.phone,
        email: member.email,
        channel: member.preferredChannel,
        message: generated.whatsappText,
        timestamp: new Date().toISOString(),
        status: 'delivered' as const,
        triggeredBy: memberId ? 'manual_admin' as const : 'automated_cron' as const,
      };
    });

    setBirthdayGreetingsSent((prev) => [...newGreetings, ...prev]);

    logAuditEvent(
      'BIRTHDAY_MESSAGES_DISPATCHED',
      'Automated Messaging Service',
      `Sent ${targets.length} personalized birthday greetings via WhatsApp/Email to: ${targets.map((m) => m.name).join(', ')}.`
    );

    triggerToast(
      'Birthday Greetings Dispatched!',
      `Successfully delivered ${targets.length} personalized blessings via WhatsApp & Email channels.`,
      'success'
    );
  };

  const addMember = (newMemData: Omit<Member, 'id'>) => {
    const newMember: Member = {
      ...newMemData,
      id: `mem-${Date.now()}`,
    };
    setMembers((prev) => [newMember, ...prev]);
    logAuditEvent('MEMBER_REGISTERED', 'Member Directory', `Registered new member: ${newMember.name} in ${newMember.ministry}`);
    triggerToast('Member Profile Added', `${newMember.name} has been enrolled into Encounter Rhema directory.`, 'success');
  };

  // Sermons CMS
  const addSermon = (sermonData: Omit<Sermon, 'id' | 'downloadsCount'>) => {
    const newSermon: Sermon = {
      ...sermonData,
      id: `sermon-${Date.now()}`,
      downloadsCount: 0,
    };
    setSermons((prev) => [newSermon, ...prev]);
    logAuditEvent('SERMON_CREATED', 'Media CMS', `Published sermon "${newSermon.title}" by ${newSermon.speaker}`);
    triggerToast('Sermon Published', `"${newSermon.title}" is now available to the global congregation.`, 'success');
  };

  const updateSermon = (id: string, updated: Partial<Sermon>) => {
    setSermons((prev) => prev.map((s) => (s.id === id ? { ...s, ...updated } : s)));
    logAuditEvent('SERMON_UPDATED', 'Media CMS', `Modified sermon metadata ID: ${id}`);
    triggerToast('Sermon Updated', 'Changes have been saved to media repository.', 'info');
  };

  const deleteSermon = (id: string) => {
    const target = sermons.find((s) => s.id === id);
    setSermons((prev) => prev.filter((s) => s.id !== id));
    logAuditEvent('SERMON_DELETED', 'Media CMS', `Removed sermon "${target?.title || id}"`);
    triggerToast('Sermon Archived', 'Sermon removed from active catalog.', 'info');
  };

  // Events
  const toggleRSVP = (id: string) => {
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id === id) {
          const nextRsvp = !e.userRsvp;
          const nextCount = nextRsvp ? e.rsvpCount + 1 : Math.max(0, e.rsvpCount - 1);
          triggerToast(
            nextRsvp ? 'RSVP Confirmed!' : 'RSVP Cancelled',
            nextRsvp ? `You are registered for "${e.title}". Calendar reminder set.` : `Registration withdrawn.`,
            'success'
          );
          logAuditEvent('EVENT_RSVP_TOGGLED', 'Events Registry', `User ${nextRsvp ? 'confirmed' : 'cancelled'} RSVP for ${e.title}`);
          return { ...e, userRsvp: nextRsvp, rsvpCount: nextCount };
        }
        return e;
      })
    );
  };

  const addEvent = (eventData: Omit<MinistryEvent, 'id' | 'rsvpCount'>) => {
    const newEvt: MinistryEvent = {
      ...eventData,
      id: `evt-${Date.now()}`,
      rsvpCount: 0,
      userRsvp: false,
    };
    setEvents((prev) => [newEvt, ...prev]);
    logAuditEvent('EVENT_CREATED', 'Ministry Calendar', `Scheduled new church event: ${newEvt.title} for ${newEvt.date}`);
    triggerToast('Event Scheduled', `"${newEvt.title}" is now live on the interactive calendar.`, 'success');
  };

  const deleteEvent = (id: string) => {
    const target = events.find((e) => e.id === id);
    setEvents((prev) => prev.filter((e) => e.id !== id));
    logAuditEvent('EVENT_DELETED', 'Ministry Calendar', `Cancelled event: ${target?.title || id}`);
    triggerToast('Event Removed', 'Event cancelled from public calendar.', 'info');
  };

  // Testimonies
  const rejoiceTestimony = (id: string) => {
    setTestimonies((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextRejoiced = !t.userRejoiced;
          const nextCount = nextRejoiced ? t.rejoiceCount + 1 : Math.max(0, t.rejoiceCount - 1);
          triggerToast(
            nextRejoiced ? 'Amen! Glory to God!' : 'Reaction Removed',
            nextRejoiced ? 'You rejoiced with this miracle testimony!' : '',
            'success'
          );
          return { ...t, userRejoiced: nextRejoiced, rejoiceCount: nextCount };
        }
        return t;
      })
    );
  };

  const addTestimony = (tData: Omit<Testimony, 'id' | 'rejoiceCount' | 'date' | 'approved'>) => {
    const newTest: Testimony = {
      ...tData,
      id: `test-${Date.now()}`,
      date: '2026-10-30',
      rejoiceCount: 1,
      userRejoiced: true,
      approved: currentUser.role === 'super_admin' || currentUser.role === 'media_admin',
    };
    setTestimonies((prev) => [newTest, ...prev]);
    logAuditEvent(
      'TESTIMONY_SUBMITTED',
      'Praise Reports',
      `Submitted testimony "${newTest.title}" by ${newTest.author} (${newTest.approved ? 'Auto-Approved' : 'Pending Moderation'})`
    );
    triggerToast(
      'Testimony Shared!',
      newTest.approved ? 'Your praise report is live for the congregation to rejoice!' : 'Thank you! Your testimony is being reviewed by pastoral team.',
      'success'
    );
  };

  const approveTestimony = (id: string) => {
    setTestimonies((prev) => prev.map((t) => (t.id === id ? { ...t, approved: true } : t)));
    logAuditEvent('TESTIMONY_APPROVED', 'Praise Reports Moderation', `Approved testimony ID: ${id}`);
    triggerToast('Testimony Approved', 'Praise report published to public feed.', 'success');
  };

  // Giving
  const addGivingRecord = (record: Omit<GivingRecord, 'id' | 'transactionRef' | 'timestamp' | 'receiptNumber'>) => {
    const txId = `ERM-TX-${Math.floor(10000 + Math.random() * 90000)}`;
    const recNum = `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const created: GivingRecord = {
      ...record,
      id: `giv-${Date.now()}`,
      transactionRef: txId,
      timestamp: new Date().toISOString(),
      receiptNumber: recNum,
      status: 'successful',
    };
    setGivingRecords((prev) => [created, ...prev]);
    setLastGeneratedReceipt(created);
    logAuditEvent(
      'GIVING_TRANSACTION_COMPLETED',
      'Digital Stewardship Vault',
      `Processed ${created.currency} $${created.amount} for ${created.fund.toUpperCase()} via ${created.paymentMethod} (Ref: ${txId}). 501(c)(3) Receipt #${recNum} generated.`
    );
    triggerToast(
      'Giving Successful! God Bless You',
      `Receipt #${recNum} generated. An email confirmation has been dispatched.`,
      'success'
    );
    return created;
  };

  // Backups
  const triggerManualBackup = () => {
    setIsBackingUp(true);
    triggerToast('Initiating Encrypted Database Backup', 'Encrypting schema, membership, sermon metadata, and financial vaults with AES-256-GCM...', 'info');

    setTimeout(() => {
      const metadata = generateEncryptedBackupMetadata({
        members,
        sermons,
        events,
        givingRecords,
        testimonies,
      });
      setBackups((prev) => [metadata, ...prev]);
      setIsBackingUp(false);
      logAuditEvent(
        'MANUAL_BACKUP_COMPLETED',
        'AES-256 Cloud Vault',
        `Completed manual encrypted backup snapshot (${Math.round(metadata.sizeBytes / 1024)} KB) with checksum ${metadata.checksum}.`
      );
      triggerToast('Encrypted Backup Ready', `Snapshot ${metadata.id} secured and verified with SHA-256 checksum.`, 'success');
    }, 1200);
  };

  // Chat
  const sendChatMessage = (text: string, fileAttachment?: ChatMessage['fileAttachment']) => {
    if (!text.trim() && !fileAttachment) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      senderName: currentUser.name,
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      fileAttachment,
    };

    setChatMessages((prev) => [...prev, userMsg]);
    logAuditEvent('SUPPORT_CHAT_MESSAGE', 'Pastoral Live Desk', `User sent message in pastoral care desk (${fileAttachment ? 'With encrypted file: ' + fileAttachment.name : text.slice(0, 30)})`);

    // Intelligent automated pastoral responder
    setTimeout(() => {
      let replyText = 'Thank you for reaching out to Encounter Rhema Ministries pastoral support. An intercessory minister has received your request and will connect with you shortly.';
      const lower = text.toLowerCase();

      if (lower.includes('pray') || lower.includes('healing') || lower.includes('sick')) {
        replyText = `🕊️ "Is anyone among you sick? Let them call the elders of the church to pray over them and anoint them with oil in the name of the Lord." (James 5:14). We stand with you in faith! Your prayer request is immediately assigned to our 24/7 Intercessory Prayer Army.`;
      } else if (lower.includes('give') || lower.includes('tithe') || lower.includes('receipt') || lower.includes('tax')) {
        replyText = `💳 For digital giving, tithes, and instant 501(c)(3) tax-deductible receipts, you can navigate directly to our Giving Portal or download your statements from the compliance tab.`;
      } else if (lower.includes('service') || lower.includes('time') || lower.includes('location') || lower.includes('address')) {
        replyText = `⛪ Encounter Rhema Ministries meets every Sunday at 9:00 AM & 11:30 AM, and Midweek Bible Masterclass every Wednesday at 6:30 PM at the Main Sanctuary (1200 Rhema Way, Capital City). We also broadcast live worldwide!`;
      } else if (fileAttachment) {
        replyText = `🔒 We have securely received your encrypted file "${fileAttachment.name}". Our pastoral confidentiality protocols ensure strict ministerial privacy.`;
      }

      const autoReply: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'pastor',
        senderName: 'Pastor On Duty (Elder Marcus)',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setChatMessages((prev) => [...prev, autoReply]);
    }, 800);
  };

  // Prayer Requests Module
  const addPrayerRequest = (data: {
    title: string;
    description: string;
    category: PrayerRequest['category'];
    isPrivate: boolean;
    phone?: string;
  }) => {
    const newReq: PrayerRequest = {
      id: `pr-${Date.now()}`,
      memberId: currentUser.id,
      memberName: currentUser.name,
      memberEmail: currentUser.email,
      memberPhone: data.phone || currentUser.phone,
      title: data.title.trim(),
      description: data.description.trim(),
      category: data.category,
      isPrivate: data.isPrivate,
      status: 'new',
      createdAt: new Date().toISOString(),
      intercessorCount: 1,
      userInterceded: true,
      statusHistory: [
        {
          status: 'new',
          updatedBy: currentUser.name,
          timestamp: new Date().toISOString(),
          note: 'Petition submitted by member',
        },
      ],
    };

    setPrayerRequests((prev) => [newReq, ...prev]);
    logAuditEvent(
      'PRAYER_PETITION_CREATED',
      'Intercessory Altar',
      `Submitted petition "${newReq.title}" by ${newReq.memberName} (Private: ${newReq.isPrivate ? 'YES' : 'NO'})`
    );
    triggerToast(
      'Prayer Need Submitted',
      newReq.isPrivate
        ? 'Your private prayer need has been placed into the confidential pastoral care ledger.'
        : 'Your prayer request is live on the Intercessory Altar for brethren to stand in agreement.',
      'success'
    );
  };

  const updatePrayerStatus = (requestId: string, status: PrayerRequestStatus, note?: string) => {
    const target = prayerRequests.find((p) => p.id === requestId);
    if (!target) return;

    setPrayerRequests((prev) =>
      prev.map((req) => {
        if (req.id === requestId) {
          const newHistoryItem = {
            status,
            updatedBy: currentUser.name,
            timestamp: new Date().toISOString(),
            note,
          };
          return {
            ...req,
            status,
            assignedPastor: currentUser.name,
            pastoralNotes: note || req.pastoralNotes,
            statusHistory: [newHistoryItem, ...req.statusHistory],
          };
        }
        return req;
      })
    );

    logAuditEvent(
      'PRAYER_STATUS_UPDATED',
      'Pastoral Oversight',
      `Pastor ${currentUser.name} marked "${target.title}" as ${status.toUpperCase()}${note ? ` Note: ${note}` : ''}`
    );
    triggerToast(
      'Prayer Status Updated',
      `Petition marked as "${status.replace('_', ' ').toUpperCase()}".`,
      'success'
    );
  };

  const intercedeForPrayer = (requestId: string) => {
    setPrayerRequests((prev) =>
      prev.map((req) => {
        if (req.id === requestId) {
          const nextState = !req.userInterceded;
          const count = nextState ? req.intercessorCount + 1 : Math.max(0, req.intercessorCount - 1);
          triggerToast(
            nextState ? 'Stood in Agreement! Amen!' : 'Intercession Withdrawn',
            nextState ? `You released prayers for "${req.title}". Matthew 18:19 agreement activated.` : '',
            'success'
          );
          return { ...req, userInterceded: nextState, intercessorCount: count };
        }
        return req;
      })
    );
  };

  const deletePrayerRequest = (requestId: string) => {
    const target = prayerRequests.find((p) => p.id === requestId);
    setPrayerRequests((prev) => prev.filter((p) => p.id !== requestId));
    logAuditEvent('PRAYER_PETITION_REMOVED', 'Intercessory Altar', `Removed prayer request: ${target?.title || requestId}`);
    triggerToast('Prayer Petition Removed', 'Request cleared from active prayer list.', 'info');
  };

  const submitPrayerRequest = (data: { name: string; phone: string; email: string; request: string; isConfidential: boolean }) => {
    addPrayerRequest({
      title: data.request.slice(0, 40) + (data.request.length > 40 ? '...' : ''),
      description: data.request,
      category: 'general',
      isPrivate: data.isConfidential,
      phone: data.phone,
    });
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        isDark,
        themeMode,
        setThemeMode,
        toggleDarkMode,
        isMobileDeviceView,
        setIsMobileDeviceView,

        // Admin Dashboard & Session State
        isLoggedIn,
        isInAdminDashboard,
        setIsInAdminDashboard,
        showLoginModal,
        setShowLoginModal,
        showLogoutConfirmModal,
        setShowLogoutConfirmModal,
        loginUser,
        logoutUser,
        adminActiveSection,
        setAdminActiveSection,
        isAsideOpen,
        setIsAsideOpen,

        // Prayer Requests
        prayerRequests,
        addPrayerRequest,
        updatePrayerStatus,
        intercedeForPrayer,
        deletePrayerRequest,

        currentUser,
        switchRole,
        is2FAVerified,
        verify2FA,
        require2FAModal,
        setRequire2FAModal,

        members,
        birthdaysToday,
        birthdaysThisWeek,
        birthdaysUpcomingMonth,
        birthdayGreetingsSent,
        sendBirthdayGreetings,
        addMember,

        sermons,
        addSermon,
        updateSermon,
        deleteSermon,
        activeSermonForPlayer,
        setActiveSermonForPlayer,

        events,
        toggleRSVP,
        addEvent,
        deleteEvent,

        testimonies,
        rejoiceTestimony,
        addTestimony,
        approveTestimony,

        givingRecords,
        addGivingRecord,
        lastGeneratedReceipt,
        setLastGeneratedReceipt,

        auditLogs,
        logAuditEvent,

        backups,
        isBackingUp,
        triggerManualBackup,
        emailOnFailedBackup,
        setEmailOnFailedBackup,
        automatedWeeklyReportEmail,
        setAutomatedWeeklyReportEmail,

        chatMessages,
        sendChatMessage,
        isChatOpen,
        setIsChatOpen,

        pushNotificationsEnabled,
        togglePushNotifications,
        activeToast,
        dismissToast,
        triggerToast,

        submitPrayerRequest,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
