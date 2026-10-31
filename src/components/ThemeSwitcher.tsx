/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { ThemeMode } from '../types';
import { Sun, Moon, Laptop } from 'lucide-react';

interface ThemeSwitcherProps {
  className?: string;
  compact?: boolean;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ className = '', compact = false }) => {
  const { themeMode, setThemeMode } = useApp();

  const options: { mode: ThemeMode; label: string; icon: React.ReactNode }[] = [
    { mode: 'light', label: 'Light', icon: <Sun className="w-3.5 h-3.5 text-amber-500" /> },
    { mode: 'system', label: 'System', icon: <Laptop className="w-3.5 h-3.5 text-blue-400" /> },
    { mode: 'dark', label: 'Dark', icon: <Moon className="w-3.5 h-3.5 text-indigo-400" /> },
  ];

  return (
    <div
      className={`inline-flex items-center p-1 rounded-xl bg-slate-200/90 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700/80 shadow-inner ${className}`}
      role="group"
      aria-label="Theme mode switcher"
    >
      {options.map(({ mode, label, icon }) => {
        const isActive = themeMode === mode;
        return (
          <button
            key={mode}
            onClick={() => setThemeMode(mode)}
            title={`Switch to ${label} mode`}
            aria-pressed={isActive}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              isActive
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-400/30 dark:ring-slate-600/50 scale-100 font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-300/40 dark:hover:bg-slate-700/40'
            }`}
          >
            {icon}
            {!compact && <span className="hidden sm:inline text-[11px]">{label}</span>}
          </button>
        );
      })}
    </div>
  );
};
