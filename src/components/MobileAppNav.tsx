/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp, PageView } from '../context/AppContext';
import {
  Home,
  Tv,
  Radio,
  Heart,
  Menu,
  X,
  Calendar,
  Users,
  BookOpen,
  MessageCircle,
  Settings,
  Info,
  Sun,
  Moon,
  ShieldCheck,
  Flame,
} from 'lucide-react';

export const MobileAppNav: React.FC = () => {
  const {
    currentPage,
    setCurrentPage,
    isDark,
    toggleDarkMode,
    currentUser,
    switchRole,
    birthdaysToday,
    isMobileDeviceView,
    isLoggedIn,
    setIsInAdminDashboard,
    setShowLoginModal,
  } = useApp();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const mainTabs: { id: PageView; label: string; icon: React.ReactNode; live?: boolean }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { id: 'media', label: 'Sermons', icon: <Tv className="w-5 h-5" /> },
    { id: 'live', label: 'Live', icon: <Radio className="w-5 h-5" />, live: true },
    { id: 'giving', label: 'Give', icon: <Heart className="w-5 h-5 fill-current" /> },
  ];

  const drawerItems: { id: PageView | 'cms_action'; label: string; icon: React.ReactNode; subtitle: string }[] = [
    { id: 'prayer_requests', label: 'Prayer Needs & Altar', icon: <Flame className="w-5 h-5 text-rose-500" />, subtitle: 'Private needs, urgent care & intercession' },
    { id: 'events', label: 'Interactive Calendar', icon: <Calendar className="w-5 h-5 text-amber-500" />, subtitle: 'Services, prayer vigils & youth' },
    { id: 'testimonies', label: 'Praise & Miracles', icon: <BookOpen className="w-5 h-5 text-emerald-500" />, subtitle: 'Supernatural testimonies' },
    { id: 'directory', label: 'Member Directory', icon: <Users className="w-5 h-5 text-indigo-500" />, subtitle: 'Connect with fellow believers' },
    { id: 'about', label: 'About Encounter Rhema', icon: <Info className="w-5 h-5 text-amber-500" />, subtitle: 'Vision, leadership & statement' },
    { id: 'contact', label: 'Location & Hotline', icon: <MessageCircle className="w-5 h-5 text-sky-500" />, subtitle: 'Campus address & contact' },
    { id: 'cms_action', label: isLoggedIn ? 'CMS Admin Dashboard' : 'Staff / Admin Login', icon: <Settings className="w-5 h-5 text-amber-400" />, subtitle: isLoggedIn ? 'Content management, charts & logs' : 'Sign in for pastoral CMS access' },
  ];

  return (
    <>
      {/* Mobile Bottom Navigation Bar (App style) */}
      <nav
        aria-label="Mobile Navigation"
        className={`${isMobileDeviceView ? 'absolute' : 'fixed'} bottom-0 left-0 right-0 z-40 bg-slate-900/98 dark:bg-slate-950/98 backdrop-blur-lg border-t border-slate-800 text-slate-300 px-2 py-1.5 flex items-center justify-around shadow-2xl`}
      >
        {mainTabs.map((tab) => {
          const active = currentPage === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setCurrentPage(tab.id);
                setDrawerOpen(false);
              }}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all relative ${
                active ? 'text-amber-400 font-bold scale-105' : 'hover:text-slate-100'
              }`}
            >
              <div className="relative">
                {tab.icon}
                {tab.live && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                )}
              </div>
              <span className="text-[10px] mt-0.5">{tab.label}</span>
            </button>
          );
        })}

        {/* More/Menu Drawer Toggle */}
        <button
          onClick={() => setDrawerOpen(true)}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
            drawerOpen ? 'text-amber-400 font-bold' : 'hover:text-slate-100'
          }`}
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">More</span>
        </button>
      </nav>

      {/* Slide-up App Drawer */}
      {drawerOpen && (
        <div
          role="dialog"
          aria-labelledby="mobile-menu-title"
          className="fixed inset-0 z-50 flex flex-col justify-end bg-slate-950/80 backdrop-blur-sm animate-in fade-in"
        >
          <div className="bg-slate-900 dark:bg-slate-950 border-t border-slate-800 rounded-t-3xl p-5 max-h-[85vh] overflow-y-auto w-full shadow-2xl text-white">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black text-sm">
                  ER
                </div>
                <div>
                  <h3 id="mobile-menu-title" className="text-sm font-bold text-white">
                    Encounter Rhema Menu
                  </h3>
                  <p className="text-[11px] text-slate-400">Ministries & Admin Portals</p>
                </div>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                aria-label="Close menu"
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Quick user role selector badge */}
            <div className="my-3 p-3 bg-slate-800/80 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <img src={currentUser.avatar} alt="" className="w-7 h-7 rounded-full object-cover" />
                <div>
                  <p className="font-semibold">{currentUser.name}</p>
                  <p className="text-[10px] text-amber-400 uppercase font-mono">{currentUser.role.replace('_', ' ')}</p>
                </div>
              </div>
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-slate-700 text-slate-200"
              >
                {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>

            {/* Navigation links */}
            <div className="space-y-2 py-2">
              {drawerItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setDrawerOpen(false);
                    if (item.id === 'cms_action') {
                      if (isLoggedIn) {
                        setIsInAdminDashboard(true);
                      } else {
                        setShowLoginModal(true);
                      }
                    } else {
                      setCurrentPage(item.id);
                    }
                  }}
                  className={`w-full p-3 rounded-xl flex items-center gap-3 text-left transition-colors cursor-pointer ${
                    item.id !== 'cms_action' && currentPage === item.id
                      ? 'bg-amber-600/20 border border-amber-500/40 text-amber-300 font-semibold'
                      : 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700/60'
                  }`}
                >
                  <div className="p-2 rounded-lg bg-slate-800 shrink-0">
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-[11px] text-slate-400">{item.subtitle}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Birthday banner in mobile drawer */}
            <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs flex items-center justify-between">
              <div>
                <p className="font-semibold text-amber-300">🎂 Today's Birthdays</p>
                <p className="text-[11px] text-slate-400">{birthdaysToday.length} members celebrating today</p>
              </div>
              <button
                onClick={() => {
                  setCurrentPage('home');
                  setDrawerOpen(false);
                }}
                className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-[11px] font-semibold"
              >
                Bless Them
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
