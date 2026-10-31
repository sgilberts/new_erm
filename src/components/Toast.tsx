/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { activeToast, dismissToast } = useApp();

  if (!activeToast) return null;

  const isSuccess = activeToast.type === 'success';
  const isAlert = activeToast.type === 'alert';

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 max-w-md w-full px-4 animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="bg-slate-900/95 dark:bg-slate-800/95 backdrop-blur-md text-white border border-slate-700/80 shadow-2xl rounded-xl p-4 flex items-start gap-3">
        <div className="mt-0.5 shrink-0">
          {isSuccess && <CheckCircle2 className="w-5 h-5 text-amber-400" />}
          {isAlert && <AlertCircle className="w-5 h-5 text-rose-400" />}
          {!isSuccess && !isAlert && <Info className="w-5 h-5 text-indigo-400" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-100">{activeToast.title}</p>
          <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{activeToast.message}</p>
        </div>
        <button
          onClick={dismissToast}
          aria-label="Dismiss notification"
          className="text-slate-400 hover:text-white transition-colors p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
