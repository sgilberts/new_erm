/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MinistryEvent } from '../types';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Check,
  Plus,
  Share2,
  Download,
  Filter,
  UserCheck,
} from 'lucide-react';

export const EventsView: React.FC = () => {
  const { events, toggleRSVP, currentUser, setCurrentPage, triggerToast } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  const categories = ['all', 'worship', 'prayer', 'bible_study', 'youth', 'outreach'];

  const filteredEvents = events.filter((e) => {
    return selectedCategory === 'all' || e.category === selectedCategory;
  });

  const canManageEvents = currentUser.role === 'super_admin' || currentUser.role === 'media_admin';

  const handleExportICS = (event: MinistryEvent) => {
    const icsContent = `
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Encounter Rhema Ministries//EN
BEGIN:VEVENT
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.location}
DTSTART:20261101T090000Z
DTEND:20261101T120000Z
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR
    `.trim();

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `EncounterRhema_${event.title.replace(/\s+/g, '_')}.ics`;
    link.click();
    URL.revokeObjectURL(url);

    triggerToast('Calendar Event Downloaded', 'Import this iCal event directly into Apple Calendar, Google Calendar, or Outlook.', 'success');
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Interactive Ministry Calendar
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Stay connected with weekly worship services, all-night prayer vigils, conferences, and outreach initiatives.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {canManageEvents && (
            <button
              onClick={() => setCurrentPage('admin')}
              className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-xl shadow transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>CMS: Add Event</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and View Toggle */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto p-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {cat === 'all' ? 'All Gatherings' : cat.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* View Switcher: List vs Calendar Grid */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl self-end sm:self-auto">
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
              viewMode === 'list'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            List View
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
              viewMode === 'calendar'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Month Grid
          </button>
        </div>
      </div>

      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-5 items-start md:items-center justify-between"
            >
              <div className="flex items-start gap-4 flex-1">
                {/* Date stamp box */}
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex flex-col items-center justify-center shrink-0">
                  <span className="text-[10px] font-bold uppercase">
                    {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                  </span>
                  <span className="text-xl font-black text-slate-900 dark:text-white">
                    {new Date(event.date).getUTCDate()}
                  </span>
                </div>

                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                      {event.category.replace('_', ' ')}
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {event.time}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    {event.title}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl line-clamp-2">
                    {event.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                    <span className="flex items-center gap-1 text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-amber-500" /> {event.location}
                    </span>
                    {event.speaker && (
                      <span className="text-slate-700 dark:text-slate-300 font-medium">
                        Ministering: {event.speaker}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 w-full md:w-auto justify-end pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-500 pr-1">
                  {event.rsvpCount} Attending
                </span>

                <button
                  onClick={() => handleExportICS(event)}
                  title="Add to personal calendar (Google / Apple / Outlook)"
                  className="p-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl transition-colors"
                >
                  <Download className="w-4 h-4" />
                </button>

                <button
                  onClick={() => toggleRSVP(event.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    event.userRsvp
                      ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-900 dark:bg-amber-600 hover:bg-slate-800 dark:hover:bg-amber-500 text-white shadow-sm'
                  }`}
                >
                  {event.userRsvp ? (
                    <>
                      <Check className="w-4 h-4" /> RSVP'd
                    </>
                  ) : (
                    'RSVP Now'
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Interactive Month Grid View */}
      {viewMode === 'calendar' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              November 2026 — Ministry Schedule
            </h3>
            <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold">
              Encounter Rhema Capital Campus
            </span>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-slate-400 pb-2">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          <div className="grid grid-cols-7 gap-2 text-xs">
            {Array.from({ length: 30 }).map((_, idx) => {
              const day = idx + 1;
              const matchingEvents = events.filter((e) => {
                const d = new Date(e.date).getUTCDate();
                return d === day;
              });

              return (
                <div
                  key={day}
                  className={`min-h-[90px] p-2 rounded-xl border flex flex-col justify-between ${
                    matchingEvents.length > 0
                      ? 'bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/30'
                      : 'bg-slate-50/50 dark:bg-slate-850/50 border-slate-100 dark:border-slate-800'
                  }`}
                >
                  <span className="font-bold text-slate-900 dark:text-white">{day}</span>

                  <div className="space-y-1 mt-1">
                    {matchingEvents.map((ev) => (
                      <div
                        key={ev.id}
                        onClick={() => toggleRSVP(ev.id)}
                        title={`${ev.title} (${ev.time}) - Click to RSVP`}
                        className="p-1 rounded bg-amber-600 text-white text-[10px] truncate cursor-pointer hover:bg-amber-500 font-medium"
                      >
                        {ev.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
