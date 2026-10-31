/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Lock, KeyRound, X, RefreshCw } from 'lucide-react';

export const TwoFactorModal: React.FC = () => {
  const { require2FAModal, setRequire2FAModal, verify2FA, currentUser } = useApp();
  const [code, setCode] = useState('849201'); // prefill sample valid 6-digit TOTP for easy testing
  const [error, setError] = useState('');

  if (!require2FAModal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const valid = verify2FA(code);
    if (!valid) {
      setError('Invalid authenticator code. Enter any 6 digits (e.g. 849201).');
    }
  };

  const generateNewToken = () => {
    const random = Math.floor(100000 + Math.random() * 900000).toString();
    setCode(random);
    setError('');
  };

  return (
    <div
      role="dialog"
      aria-labelledby="two-factor-title"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
        <button
          onClick={() => setRequire2FAModal(false)}
          aria-label="Close security prompt"
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h2 id="two-factor-title" className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Two-Factor Authentication
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Securing {currentUser.name} ({currentUser.role.replace('_', ' ').toUpperCase()})
            </p>
          </div>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-300 mb-5 leading-relaxed">
          Encounter Rhema Enterprise Security enforces hardware or TOTP 2FA verification for administrative control and financial data access.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="totp-code" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
              6-Digit Authenticator Code
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="totp-code"
                type="text"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="000000"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-mono text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-amber-500"
                autoFocus
              />
            </div>
            {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Hardware Token Simulator</span>
            <button
              type="button"
              onClick={generateNewToken}
              className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 hover:underline"
            >
              <RefreshCw className="w-3 h-3" />
              Generate new code
            </button>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setRequire2FAModal(false)}
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              Verify & Proceed
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
