/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp, PageView } from '../context/AppContext';
import { UserRole } from '../types';
import { ThemeSwitcher } from './ThemeSwitcher';
import {
  Radio,
  Heart,
  ShieldCheck,
  Smartphone,
  Monitor,
  Bell,
  BellOff,
  User,
  ChevronDown,
  Sparkles,
  Lock,
  LogIn,
  LogOut,
  LayoutDashboard,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentPage,
    setCurrentPage,
    isDark,
    isMobileDeviceView,
    setIsMobileDeviceView,
    currentUser,
    switchRole,
    setRequire2FAModal,
    is2FAVerified,
    pushNotificationsEnabled,
    togglePushNotifications,
    birthdaysToday,
    prayerRequests,
    isLoggedIn,
    isInAdminDashboard,
    setIsInAdminDashboard,
    setShowLoginModal,
    setShowLogoutConfirmModal,
  } = useApp();

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const urgentPrayerCount = prayerRequests.filter((p) => p.status === 'urgent').length;

  const navItems: { id: PageView; label: string; live?: boolean; badge?: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'prayer_requests', label: 'Prayer Needs', badge: urgentPrayerCount > 0 ? `${urgentPrayerCount} Urgent` : undefined },
    { id: 'about', label: 'About Us' },
    { id: 'media', label: 'Media' },
    { id: 'live', label: 'Live Service', live: true },
    { id: 'events', label: 'Events' },
    { id: 'giving', label: 'Giving' },
    { id: 'testimonies', label: 'Testimonies' },
    { id: 'directory', label: 'Member Directory' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-30 w-full bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-800 text-white">
      {/* Top subtle emergency / live alert bar */}
      <div className="bg-gradient-to-r from-amber-700 via-amber-600 to-amber-800 text-[11px] text-white py-1 px-4 text-center font-medium flex items-center justify-center gap-3">
        <span className="flex items-center gap-1.5">
          <Radio className="w-3.5 h-3.5 animate-pulse text-amber-200" />
          <span>Sunday Miracle Encounter is Broadcasting Live</span>
        </span>
        <span className="opacity-60 hidden md:inline">|</span>
        <span className="hidden md:inline">
          🎂 {birthdaysToday.length} Beloved Member{birthdaysToday.length === 1 ? '' : 's'} Celebrating Birthdays Today!
        </span>
        <button
          onClick={() => setCurrentPage('home')}
          className="underline hover:text-amber-100 text-[11px] font-semibold"
        >
          View Birthdays
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Brand */}
          <div
            onClick={() => setCurrentPage('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 p-0.5 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <span className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-1">
                ENCOUNTER <span className="text-amber-400 font-extrabold">RHEMA</span>
              </span>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
                Ministries · Living Word
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => {
              const active = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`relative px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                    active
                      ? 'text-amber-400 bg-slate-800/80 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  {item.live && (
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping inline-block" />
                  )}
                  {item.label}
                  {item.badge && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-300 font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right utility toolbar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* CMS Dashboard / Staff Login Button */}
            {isLoggedIn ? (
              <button
                onClick={() => setIsInAdminDashboard(true)}
                className="px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Open Administrative CMS Dashboard"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">CMS Dashboard</span>
              </button>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Staff / Admin Sign In"
              >
                <LogIn className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Staff Login</span>
              </button>
            )}

            {/* View Mode Switcher: Desktop vs Mobile App Shell */}
            <button
              onClick={() => setIsMobileDeviceView((prev) => !prev)}
              aria-label={isMobileDeviceView ? 'Switch to Standard Web View' : 'Preview Mobile App Mode'}
              title={isMobileDeviceView ? 'Switch to Standard Web View' : 'Preview Mobile App Mode'}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1 text-xs"
            >
              {isMobileDeviceView ? (
                <>
                  <Monitor className="w-4 h-4 text-amber-400" />
                  <span className="hidden xl:inline text-[11px]">Desktop</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-4 h-4 text-amber-400" />
                  <span className="hidden xl:inline text-[11px]">Mobile View</span>
                </>
              )}
            </button>

            {/* 3-Way Theme Switcher (Light / System / Dark) */}
            <ThemeSwitcher compact />

            {/* Push Notifications */}
            <button
              onClick={togglePushNotifications}
              aria-label={pushNotificationsEnabled ? 'Disable Push Notifications' : 'Enable Push Notifications'}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              {pushNotificationsEnabled ? (
                <Bell className="w-4 h-4 text-amber-400" />
              ) : (
                <BellOff className="w-4 h-4 text-slate-500" />
              )}
            </button>

            {/* Role Switcher & RBAC */}
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-200 transition-colors cursor-pointer"
                aria-expanded={roleMenuOpen}
                aria-haspopup="true"
              >
                <div className="w-5 h-5 rounded-full overflow-hidden bg-amber-500/20">
                  <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                </div>
                <span className="hidden md:inline font-semibold capitalize">
                  {currentUser.role.replace('_', ' ')}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {roleMenuOpen && (
                <div className="absolute right-0 mt-2 w-68 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50 text-xs animate-in fade-in">
                  <div className="px-3 py-2 border-b border-slate-800">
                    <p className="font-bold text-white truncate">{currentUser.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{currentUser.email}</p>
                    <div className="mt-1 flex items-center justify-between text-[10px]">
                      <span className="text-amber-400 font-semibold uppercase">{currentUser.role.replace('_', ' ')}</span>
                      <span className="text-emerald-400 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> 2FA Active
                      </span>
                    </div>
                  </div>

                  {/* CMS Dashboard Action */}
                  <div className="py-1 border-b border-slate-800">
                    <button
                      onClick={() => {
                        setIsInAdminDashboard(true);
                        setRoleMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-amber-300 hover:bg-amber-500/20 flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <LayoutDashboard className="w-4 h-4 text-amber-400" />
                      <span>Open CMS Dashboard</span>
                    </button>
                  </div>

                  <div className="py-1">
                    <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      Switch Role for Testing:
                    </p>
                    {(['super_admin', 'chat_member', 'media_admin', 'finance_deacon', 'member'] as UserRole[]).map((r) => (
                      <button
                        key={r}
                        onClick={() => {
                          switchRole(r);
                          setRoleMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-xs capitalize flex items-center justify-between cursor-pointer ${
                          currentUser.role === r
                            ? 'bg-amber-600/20 text-amber-400 font-bold'
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <span>{r.replace('_', ' ')}</span>
                        {currentUser.role === r && <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />}
                      </button>
                    ))}
                  </div>

                  <div className="pt-1 border-t border-slate-800 space-y-1">
                    <button
                      onClick={() => {
                        setRequire2FAModal(true);
                        setRoleMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-amber-400 hover:bg-slate-800 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Lock className="w-3 h-3" />
                      Test 2FA Security Challenge
                    </button>

                    {isLoggedIn && (
                      <button
                        onClick={() => {
                          setShowLogoutConfirmModal(true);
                          setRoleMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-1.5 cursor-pointer"
                      >
                        <LogOut className="w-3 h-3" />
                        Log Out
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Giving Button */}
            <button
              onClick={() => setCurrentPage('giving')}
              className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-lg shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Heart className="w-3.5 h-3.5 fill-current" />
              <span>Give</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
