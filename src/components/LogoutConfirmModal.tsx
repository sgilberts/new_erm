/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { AlertTriangle, LogOut, X, ShieldAlert } from 'lucide-react';

export const LogoutConfirmModal: React.FC = () => {
  const { showLogoutConfirmModal, setShowLogoutConfirmModal, logoutUser, currentUser } = useApp();

  if (!showLogoutConfirmModal) return null;

  const handleConfirmLogout = () => {
    logoutUser();
    setShowLogoutConfirmModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-900 dark:text-slate-100 ring-1 ring-slate-900/10"
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-dialog-title"
      >
        {/* Header */}
        <div className="relative p-6 bg-gradient-to-br from-rose-500/10 via-transparent to-amber-500/5 border-b border-slate-200 dark:border-slate-800 flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-600 dark:text-rose-400 shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 id="logout-dialog-title" className="text-base font-black text-slate-900 dark:text-white">
              Confirm Administrative Logout
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Encounter Rhema Ministries CMS
            </p>
          </div>
          <button
            onClick={() => setShowLogoutConfirmModal(false)}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
            Are you sure you want to end your administrative session for{' '}
            <strong className="text-slate-900 dark:text-white font-bold">{currentUser.name}</strong> (
            <span className="capitalize text-amber-600 dark:text-amber-400 font-semibold">{currentUser.role.replace('_', ' ')}</span>)?
          </p>
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>You will return to the public church website and your CMS security token will be revoked.</span>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => setShowLogoutConfirmModal(false)}
            className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirmLogout}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black shadow-md shadow-rose-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out Successfully</span>
          </button>
        </div>
      </div>
    </div>
  );
};
