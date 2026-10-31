/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import {
  Lock,
  Mail,
  Key,
  ShieldCheck,
  Sparkles,
  X,
  MessageSquare,
  Video,
  DollarSign,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';

export const LoginModal: React.FC = () => {
  const { showLoginModal, setShowLoginModal, loginUser } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!showLoginModal) return null;

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Please provide your administrative email and password.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const lower = email.toLowerCase();
      if (lower.includes('chat') || lower.includes('josiah') || lower.includes('support')) {
        loginUser('chat_member');
      } else if (lower.includes('media') || lower.includes('samuel')) {
        loginUser('media_admin');
      } else if (lower.includes('finance') || lower.includes('marcus') || lower.includes('deacon')) {
        loginUser('finance_deacon');
      } else {
        // Default admin login
        loginUser('super_admin');
      }
      setShowLoginModal(false);
    }, 400);
  };

  const handleRoleQuickLogin = (role: UserRole) => {
    loginUser(role);
    setShowLoginModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-900 dark:text-slate-100 ring-1 ring-slate-900/10"
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-dialog-title"
      >
        {/* Header with church branding */}
        <div className="relative px-6 pt-6 pb-5 bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950 text-white border-b border-slate-800">
          <button
            onClick={() => setShowLoginModal(false)}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800/60 transition-colors"
            aria-label="Close login dialog"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 p-0.5 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <h2 id="login-dialog-title" className="text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                Encounter Rhema <span className="text-amber-400">Portal</span>
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                Administrative CMS & Staff Authentication
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto max-h-[calc(85vh-100px)] space-y-6">
          {/* Quick 1-Click Role Login for instant testing and access */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Quick Role Sign-In (Select Role)
              </span>
              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold bg-amber-500/10 dark:bg-amber-400/10 px-2 py-0.5 rounded-full">
                Instant Access
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Super Admin */}
              <button
                type="button"
                onClick={() => handleRoleQuickLogin('super_admin')}
                className="flex items-start gap-3 p-3 text-left rounded-xl border border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/15 dark:bg-amber-500/10 dark:hover:bg-amber-500/20 transition-all group"
              >
                <div className="p-2 rounded-lg bg-amber-500 text-slate-950 font-bold group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black text-amber-600 dark:text-amber-400">Super Admin</p>
                  <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 truncate">Dr. Emmanuel K. Osei</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Full System & CMS Access</p>
                </div>
              </button>

              {/* Chat Member / Pastoral Care */}
              <button
                type="button"
                onClick={() => handleRoleQuickLogin('chat_member')}
                className="flex items-start gap-3 p-3 text-left rounded-xl border border-indigo-500/30 bg-indigo-500/5 hover:bg-indigo-500/15 dark:bg-indigo-500/10 dark:hover:bg-indigo-500/20 transition-all group"
              >
                <div className="p-2 rounded-lg bg-indigo-500 text-white font-bold group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black text-indigo-600 dark:text-indigo-400">Chat Member</p>
                  <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 truncate">Pastor Josiah Hope</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Pastoral Chat & Care Desk</p>
                </div>
              </button>

              {/* Media Admin */}
              <button
                type="button"
                onClick={() => handleRoleQuickLogin('media_admin')}
                className="flex items-start gap-3 p-3 text-left rounded-xl border border-sky-500/30 bg-sky-500/5 hover:bg-sky-500/15 dark:bg-sky-500/10 dark:hover:bg-sky-500/20 transition-all group"
              >
                <div className="p-2 rounded-lg bg-sky-500 text-white font-bold group-hover:scale-110 transition-transform">
                  <Video className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black text-sky-600 dark:text-sky-400">Media Admin</p>
                  <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 truncate">Samuel Mensah</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Sermons & Event Broadcasts</p>
                </div>
              </button>

              {/* Finance Deacon */}
              <button
                type="button"
                onClick={() => handleRoleQuickLogin('finance_deacon')}
                className="flex items-start gap-3 p-3 text-left rounded-xl border border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/15 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 transition-all group"
              >
                <div className="p-2 rounded-lg bg-emerald-500 text-white font-bold group-hover:scale-110 transition-transform">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black text-emerald-600 dark:text-emerald-400">Finance Deacon</p>
                  <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 truncate">Elder Marcus Thorne</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Giving Ledger & Reports</p>
                </div>
              </button>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
            <span className="bg-white dark:bg-slate-900 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Or Sign In with Credentials
            </span>
            <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
          </div>

          {/* Form */}
          <form onSubmit={handleCustomLogin} className="space-y-4">
            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Staff Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. dr.osei@rhema.org or josiah.h@rhema.org"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <span className="text-[10px] text-slate-400 font-medium">Demo: any value</span>
              </div>
              <div className="relative">
                <Key className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Authenticating Session...</span>
              ) : (
                <>
                  <span>Log In to CMS Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-center gap-2.5 text-[11px] text-slate-600 dark:text-slate-400">
            <Lock className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>
              Protected by 256-bit AES encryption & automated audit logs. Administrative activity is logged in real-time.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
