/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sermon } from '../types';
import {
  Play,
  Pause,
  Download,
  Search,
  Filter,
  Volume2,
  Share2,
  BookOpen,
  Calendar,
  Sparkles,
  Plus,
  Edit,
  Trash2,
} from 'lucide-react';

export const MediaView: React.FC = () => {
  const {
    sermons,
    activeSermonForPlayer,
    setActiveSermonForPlayer,
    currentUser,
    deleteSermon,
    triggerToast,
    setCurrentPage,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeries, setSelectedSeries] = useState<string>('all');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);

  const seriesList = ['all', ...Array.from(new Set(sermons.map((s) => s.series)))];

  const filteredSermons = sermons.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.speaker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.scripture.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeries = selectedSeries === 'all' || s.series === selectedSeries;
    return matchesSearch && matchesSeries;
  });

  const activeSermon = activeSermonForPlayer || sermons[0];

  const handleDownloadNotes = (sermon: Sermon) => {
    const content = `
ENCOUNTER RHEMA MINISTRIES — SERMON STUDY GUIDE
=====================================================
Title: ${sermon.title}
Speaker: ${sermon.speaker}
Series: ${sermon.series}
Scripture Reading: ${sermon.scripture}
Date Preached: ${sermon.date}

SYNOPSIS & KEY REVELATION:
${sermon.description}

CORE APPLICATION PRINCIPLES:
1. Faith comes by hearing the living Rhema Word (Romans 10:17).
2. The authority of the believer is activated through vocal confession.
3. Walking in supernatural victory requires persistent communion with the Holy Spirit.

STUDY REFLECTION QUESTIONS:
- How does this Rhema word apply to your current season of life?
- What specific prayer declaration will you make over your family this week?

© Encounter Rhema Ministries. All Rights Reserved.
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Rhema_StudyNotes_${sermon.title.replace(/\s+/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);

    triggerToast('Study Notes Downloaded', `Study guide for "${sermon.title}" saved.`, 'success');
  };

  const canManageMedia = currentUser.role === 'super_admin' || currentUser.role === 'media_admin';

  return (
    <div className="space-y-10 pb-16">
      {/* Active Featured Player */}
      {activeSermon && (
        <section className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl text-white">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Video player simulation */}
            <div className="lg:col-span-7 bg-black relative flex items-center justify-center min-h-[300px] sm:min-h-[400px]">
              <video
                src={activeSermon.videoUrl}
                poster={activeSermon.thumbnail}
                controls
                className="w-full h-full object-cover max-h-[440px]"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
            </div>

            {/* Info panel */}
            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-slate-900/90">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{activeSermon.series}</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-white leading-snug">
                  {activeSermon.title}
                </h1>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="font-semibold text-slate-200">{activeSermon.speaker}</span>
                  <span>·</span>
                  <span>{activeSermon.scripture}</span>
                  <span>·</span>
                  <span>{activeSermon.duration}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pt-2">
                  {activeSermon.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {activeSermon.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] text-slate-300 bg-slate-800 px-2.5 py-1 rounded-md"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Player action controls */}
              <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Playback Speed:</span>
                  {[1, 1.25, 1.5].map((spd) => (
                    <button
                      key={spd}
                      onClick={() => setPlaybackSpeed(spd)}
                      className={`px-2 py-1 rounded text-[11px] font-mono ${
                        playbackSpeed === spd
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownloadNotes(activeSermon)}
                    className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-400" />
                    <span>Study Guide</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Catalog & Filters */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Sermon Archive & Media Library
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Explore audio, video messages, and teaching series for your spiritual growth.
            </p>
          </div>

          {canManageMedia && (
            <button
              onClick={() => setCurrentPage('admin')}
              className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-xl shadow transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>CMS: Upload New Sermon</span>
            </button>
          )}
        </div>

        {/* Search & Series Filter Bar */}
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sermons by title, preacher, or scripture..."
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Interactive filter tabs */}
          <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto p-1 bg-slate-100 dark:bg-slate-900 rounded-xl">
            {seriesList.map((series) => (
              <button
                key={series}
                onClick={() => setSelectedSeries(series)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                  selectedSeries === series
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {series === 'all' ? 'All Series' : series}
              </button>
            ))}
          </div>
        </div>

        {/* Sermon Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSermons.map((sermon) => {
            const isCurrent = activeSermon?.id === sermon.id;
            return (
              <div
                key={sermon.id}
                className={`bg-white dark:bg-slate-900 border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between ${
                  isCurrent
                    ? 'border-amber-500 ring-2 ring-amber-500/20'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="relative h-44 bg-slate-800">
                  <img
                    src={sermon.thumbnail}
                    alt={sermon.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center opacity-90 hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setActiveSermonForPlayer(sermon)}
                      aria-label={`Play ${sermon.title}`}
                      className="w-12 h-12 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform"
                    >
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </button>
                  </div>
                  <span className="absolute bottom-2.5 right-2.5 bg-slate-950/90 text-white text-[10px] font-mono px-2 py-0.5 rounded">
                    {sermon.duration}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-semibold">
                      <span>{sermon.series}</span>
                      <span>·</span>
                      <span className="text-slate-400 font-normal">{sermon.date}</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1 leading-snug line-clamp-2">
                      {sermon.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {sermon.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-700 dark:text-slate-300 font-medium truncate max-w-[150px]">
                      {sermon.speaker}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDownloadNotes(sermon)}
                        title="Download Sermon Study Guide"
                        className="p-1.5 text-slate-400 hover:text-amber-500 rounded-lg"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      {canManageMedia && (
                        <button
                          onClick={() => deleteSermon(sermon.id)}
                          title="Delete sermon (Admin)"
                          className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
