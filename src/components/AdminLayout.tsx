/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { hasPermission } from '../utils/rules';
import { ThemeSwitcher } from './ThemeSwitcher';
import { AdminPortal } from './AdminPortal';
import { PrayerRequestsView } from './PrayerRequestsView';
import {
  LayoutDashboard,
  Tv,
  Calendar,
  HeartHandshake,
  Cake,
  MessageSquare,
  DollarSign,
  ShieldCheck,
  Database,
  FileSpreadsheet,
  LogOut,
  Globe,
  Menu,
  X,
  Sparkles,
  Bell,
  BellOff,
  UserCheck,
  ChevronRight,
  TrendingUp,
  Clock,
  Layers,
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const {
    currentUser,
    switchRole,
    setIsInAdminDashboard,
    setShowLogoutConfirmModal,
    adminActiveSection,
    setAdminActiveSection,
    isAsideOpen,
    setIsAsideOpen,
    pushNotificationsEnabled,
    togglePushNotifications,
    prayerRequests,
    birthdaysToday,
    chatMessages,
  } = useApp();

  const urgentPrayersCount = prayerRequests.filter((p) => p.status === 'urgent').length;
  const unreadChatCount = chatMessages.filter((m) => m.sender === 'user').length;

  const asideNavItems = [
    {
      id: 'overview',
      label: 'Overview & Charts',
      icon: <LayoutDashboard className="w-4 h-4" />,
      badge: 'Real-Time',
      badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
      allowed: hasPermission(currentUser.role, 'access_admin_dashboard'),
    },
    {
      id: 'prayer',
      label: 'Prayer Requests',
      icon: <HeartHandshake className="w-4 h-4" />,
      badge: urgentPrayersCount > 0 ? `${urgentPrayersCount} Urgent` : undefined,
      badgeColor: 'bg-rose-500 text-white',
      allowed: true,
    },
    {
      id: 'birthdays',
      label: 'Birthday Engine',
      icon: <Cake className="w-4 h-4" />,
      badge: birthdaysToday.length > 0 ? `${birthdaysToday.length} Today` : undefined,
      badgeColor: 'bg-amber-500 text-slate-950 font-bold',
      allowed: hasPermission(currentUser.role, 'manage_members') || hasPermission(currentUser.role, 'access_admin_dashboard'),
    },
    {
      id: 'sermons',
      label: 'Sermons CMS',
      icon: <Tv className="w-4 h-4" />,
      allowed: hasPermission(currentUser.role, 'manage_sermons') || currentUser.role === 'super_admin',
    },
    {
      id: 'events',
      label: 'Events & Calendar',
      icon: <Calendar className="w-4 h-4" />,
      allowed: hasPermission(currentUser.role, 'manage_events') || currentUser.role === 'super_admin',
    },
    {
      id: 'chat_desk',
      label: 'Pastoral Chat Desk',
      icon: <MessageSquare className="w-4 h-4" />,
      badge: unreadChatCount > 0 ? `${unreadChatCount}` : undefined,
      badgeColor: 'bg-indigo-500 text-white',
      allowed: hasPermission(currentUser.role, 'respond_chat') || currentUser.role === 'super_admin',
    },
    {
      id: 'giving',
      label: 'Giving & Ledger',
      icon: <DollarSign className="w-4 h-4" />,
      allowed: hasPermission(currentUser.role, 'view_giving_totals') || currentUser.role === 'super_admin',
    },
    {
      id: 'audit',
      label: 'Audit & Access Logs',
      icon: <ShieldCheck className="w-4 h-4" />,
      allowed: hasPermission(currentUser.role, 'view_audit_logs') || currentUser.role === 'super_admin',
    },
    {
      id: 'backups',
      label: 'Encrypted Backups',
      icon: <Database className="w-4 h-4" />,
      badge: 'AES-256',
      badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
      allowed: currentUser.role === 'super_admin',
    },
    {
      id: 'reports',
      label: 'Compliance Reports',
      icon: <FileSpreadsheet className="w-4 h-4" />,
      allowed: hasPermission(currentUser.role, 'export_reports') || currentUser.role === 'super_admin',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col antialiased">
      {/* Top Bar for Admin */}
      <header className="sticky top-0 z-30 h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          {/* Mobile hamburger button to toggle aside */}
          <button
            onClick={() => setIsAsideOpen(!isAsideOpen)}
            className="lg:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
            aria-label="Toggle navigation drawer"
          >
            {isAsideOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* CMS Brand Badge */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 p-0.5 shadow-md shadow-amber-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[9px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black tracking-tight text-slate-900 dark:text-white">
                  ENCOUNTER <span className="text-amber-500">RHEMA</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  CMS Admin
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-semibold tracking-wide hidden sm:block">
                Enterprise Content Management System & Pastoral Operations
              </p>
            </div>
          </div>
        </div>

        {/* Right Admin Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Switch back to Public Website view */}
          <button
            onClick={() => setIsInAdminDashboard(false)}
            className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            title="Return to the public church website"
          >
            <Globe className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden md:inline">View Public Site</span>
          </button>

          {/* 3-Way Theme Switcher (Light / System / Dark) */}
          <ThemeSwitcher />

          {/* Push notification toggle */}
          <button
            onClick={togglePushNotifications}
            aria-label={pushNotificationsEnabled ? 'Disable Push Notifications' : 'Enable Push Notifications'}
            title={pushNotificationsEnabled ? 'Push notifications active' : 'Push notifications muted'}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 transition-colors"
          >
            {pushNotificationsEnabled ? (
              <Bell className="w-4 h-4 text-amber-500" />
            ) : (
              <BellOff className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {/* Role selector dropdown for staff testing */}
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
            <span className="text-[11px] text-slate-400 font-medium">Role:</span>
            <select
              value={currentUser.role}
              onChange={(e) => switchRole(e.target.value as UserRole)}
              className="bg-transparent font-bold capitalize text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="super_admin" className="dark:bg-slate-900">Super Admin</option>
              <option value="chat_member" className="dark:bg-slate-900">Chat Member</option>
              <option value="media_admin" className="dark:bg-slate-900">Media Admin</option>
              <option value="finance_deacon" className="dark:bg-slate-900">Finance Deacon</option>
            </select>
          </div>

          {/* Administrative Logout Button */}
          <button
            onClick={() => setShowLogoutConfirmModal(true)}
            className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            title="Log out of CMS dashboard"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Log Out</span>
          </button>
        </div>
      </header>

      {/* Main Layout Area: Left Aside Navigation + Scrollable Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Aside Navigation */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-68 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
            isAsideOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
          }`}
          aria-label="Administrative navigation"
        >
          {/* Aside Header info */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Rhema CMS Hub
              </span>
            </div>
            <button
              onClick={() => setIsAsideOpen(false)}
              className="lg:hidden p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Aside Navigation Links */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-none">
            <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              CMS Modules
            </p>
            {asideNavItems
              .filter((item) => item.allowed)
              .map((item) => {
                const isActive = adminActiveSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setAdminActiveSection(item.id);
                      setIsAsideOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={isActive ? 'text-slate-950' : 'text-slate-500 dark:text-slate-400'}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          isActive ? 'bg-slate-950 text-white' : item.badgeColor
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
          </nav>

          {/* Aside Footer: Active User & Logout */}
          <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
            <div className="p-2.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-sm flex items-center gap-3">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-9 h-9 rounded-xl object-cover ring-2 ring-amber-500/40 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black text-slate-900 dark:text-white truncate">
                  {currentUser.name}
                </p>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase truncate">
                    {currentUser.role.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-0.5">
                    <ShieldCheck className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowLogoutConfirmModal(true)}
              className="mt-2.5 w-full py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out of CMS</span>
            </button>
          </div>
        </aside>

        {/* Mobile Aside Backdrop */}
        {isAsideOpen && (
          <div
            onClick={() => setIsAsideOpen(false)}
            className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
            aria-hidden="true"
          />
        )}

        {/* Main Dashboard Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {adminActiveSection === 'prayer' ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    Pastoral Prayer Tracker
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Track private member needs, mark 'Prayed For' or 'Urgent', and record pastoral notes.
                  </p>
                </div>
              </div>
              <PrayerRequestsView />
            </div>
          ) : (
            <AdminPortal initialTab={adminActiveSection} />
          )}
        </main>
      </div>
    </div>
  );
};
