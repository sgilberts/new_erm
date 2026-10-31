/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { MobileAppNav } from './components/MobileAppNav';
import { HomeView } from './components/HomeView';
import { AboutView } from './components/AboutView';
import { MediaView } from './components/MediaView';
import { LiveStreamView } from './components/LiveStreamView';
import { EventsView } from './components/EventsView';
import { GivingView } from './components/GivingView';
import { MemberDirectoryView } from './components/MemberDirectoryView';
import { TestimoniesView } from './components/TestimoniesView';
import { ContactView } from './components/ContactView';
import { PrayerRequestsView } from './components/PrayerRequestsView';
import { AdminPortal } from './components/AdminPortal';
import { AdminLayout } from './components/AdminLayout';
import { LoginModal } from './components/LoginModal';
import { LogoutConfirmModal } from './components/LogoutConfirmModal';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { TwoFactorModal } from './components/TwoFactorModal';
import { ReceiptModal } from './components/ReceiptModal';
import { SupportChatWidget } from './components/SupportChatWidget';
import { Smartphone, Monitor, Wifi, Battery, Sparkles } from 'lucide-react';

const MainLayout: React.FC = () => {
  const {
    currentPage,
    setCurrentPage,
    isMobileDeviceView,
    setIsMobileDeviceView,
    isDark,
    isLoggedIn,
    isInAdminDashboard,
  } = useApp();

  // If Super Admin or Staff has logged in and opened the CMS dashboard with the left aside nav
  if (isInAdminDashboard && isLoggedIn) {
    return (
      <>
        <AdminLayout />
        <LoginModal />
        <LogoutConfirmModal />
        <TwoFactorModal />
        <Toast />
        <SupportChatWidget />
      </>
    );
  }

  const renderCurrentView = () => {
    switch (currentPage) {
      case 'home':
        return <HomeView />;
      case 'prayer_requests':
        return <PrayerRequestsView />;
      case 'about':
        return <AboutView />;
      case 'media':
        return <MediaView />;
      case 'live':
        return <LiveStreamView />;
      case 'events':
        return <EventsView />;
      case 'giving':
        return <GivingView />;
      case 'directory':
        return <MemberDirectoryView />;
      case 'testimonies':
        return <TestimoniesView />;
      case 'contact':
        return <ContactView />;
      case 'admin':
        return <AdminPortal />;
      default:
        return <HomeView />;
    }
  };

  // If the user explicitly toggled "Mobile App View" simulator mode on desktop
  if (isMobileDeviceView) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-2 sm:p-6 text-slate-100">
        {/* Device Switcher Bar */}
        <div className="mb-4 flex items-center justify-between w-full max-w-[420px] px-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-slate-300">Mobile Phone App Mode</span>
          </div>
          <button
            onClick={() => setIsMobileDeviceView(false)}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-amber-400 font-semibold rounded-lg flex items-center gap-1.5 transition-colors border border-slate-700"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Switch to Desktop View</span>
          </button>
        </div>

        {/* Smartphone Shell Frame */}
        <div className="w-full max-w-[400px] h-[844px] bg-slate-900 border-4 border-slate-800 rounded-[44px] shadow-2xl overflow-hidden flex flex-col relative ring-1 ring-slate-700/50">
          {/* Hardware Notch / Island */}
          <div className="h-7 bg-slate-950 flex items-center justify-between px-6 shrink-0 text-[10px] text-slate-400 select-none z-50">
            <span>9:41</span>
            <div className="w-20 h-4 bg-black rounded-full" />
            <div className="flex items-center gap-1.5">
              <Wifi className="w-3 h-3" />
              <Battery className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* App Top Bar */}
          <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-300 p-0.5 flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-[4px] flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                </div>
              </div>
              <span className="text-xs font-black tracking-tight text-white">
                ENCOUNTER <span className="text-amber-400">RHEMA</span>
              </span>
            </div>
            <button
              onClick={() => setCurrentPage('live')}
              className="px-2 py-0.5 rounded-full bg-rose-600/20 text-rose-400 border border-rose-500/30 text-[10px] font-bold animate-pulse flex items-center gap-1"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> LIVE
            </button>
          </div>

          {/* Scrollable App Body */}
          <div className="flex-1 overflow-y-auto px-4 py-4 scrollbar-none pb-20">
            {renderCurrentView()}
          </div>

          {/* Mobile Bottom App Navigation */}
          <MobileAppNav />
        </div>

        {/* Global Floating Modals */}
        <LoginModal />
        <LogoutConfirmModal />
        <TwoFactorModal />
        <ReceiptModal />
        <Toast />
        <SupportChatWidget />
      </div>
    );
  }

  // Standard responsive web layout
  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950`}>
      {/* Top Navbar */}
      <Navbar />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {renderCurrentView()}
      </main>

      {/* Mobile-Only Bottom Navigation (App style on phone screens) */}
      <div className="lg:hidden">
        <MobileAppNav />
      </div>

      {/* Footer */}
      <Footer />

      {/* Global Interactive Modals & Widgets */}
      <LoginModal />
      <LogoutConfirmModal />
      <TwoFactorModal />
      <ReceiptModal />
      <Toast />
      <SupportChatWidget />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
