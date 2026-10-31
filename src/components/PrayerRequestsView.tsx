/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PrayerRequest, PrayerRequestStatus, PrayerRequestCategory, PrayerStatusHistoryItem } from '../types';
import { filterPrayerRequests } from '../utils/rules';
import {
  Flame,
  Plus,
  ShieldCheck,
  Lock,
  Globe,
  Clock,
  CheckCircle2,
  AlertCircle,
  Heart,
  Send,
  MessageSquare,
  Search,
  Sparkles,
  Phone,
  User,
  X,
  FileText,
  Trash2,
} from 'lucide-react';

export const PrayerRequestsView: React.FC = () => {
  const {
    prayerRequests,
    addPrayerRequest,
    updatePrayerStatus,
    intercedeForPrayer,
    deletePrayerRequest,
    currentUser,
    triggerToast,
  } = useApp();

  const isPastorOrAdmin =
    currentUser.role === 'super_admin' ||
    currentUser.role === 'media_admin' ||
    currentUser.role === 'finance_deacon';

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedRequestForNote, setSelectedRequestForNote] = useState<PrayerRequest | null>(null);
  const [pastoralNoteInput, setPastoralNoteInput] = useState('');

  // Submit form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<PrayerRequestCategory>('healing');
  const [isPrivate, setIsPrivate] = useState(true);
  const [phone, setPhone] = useState(currentUser.phone);

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: 'All Categories' },
    { id: 'healing', label: 'Healing & Health' },
    { id: 'deliverance', label: 'Deliverance' },
    { id: 'finances', label: 'Finances & Career' },
    { id: 'family', label: 'Family & Marriage' },
    { id: 'spiritual_growth', label: 'Spiritual Growth' },
    { id: 'general', label: 'General Need' },
  ];

  const statuses: { id: string; label: string; count: number }[] = [
    { id: 'all', label: 'All Petitions', count: prayerRequests.length },
    {
      id: 'urgent',
      label: '🚨 Urgent',
      count: prayerRequests.filter((p) => p.status === 'urgent').length,
    },
    {
      id: 'in_intercession',
      label: '🕊️ In Intercession',
      count: prayerRequests.filter((p) => p.status === 'in_intercession').length,
    },
    {
      id: 'prayed_for',
      label: '🙏 Prayed For',
      count: prayerRequests.filter((p) => p.status === 'prayed_for').length,
    },
    {
      id: 'answered',
      label: '✨ Answered',
      count: prayerRequests.filter((p) => p.status === 'answered').length,
    },
  ];

  const visibleRequests = filterPrayerRequests(prayerRequests, {
    currentUserId: currentUser.id,
    isPastorOrAdmin,
    statusFilter,
    categoryFilter,
    searchQuery,
  });

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      triggerToast('Required Fields', 'Please provide a title and explanation for your prayer need.', 'alert');
      return;
    }

    addPrayerRequest({
      title: title.trim(),
      description: description.trim(),
      category,
      isPrivate,
      phone,
    });

    setShowSubmitModal(false);
    setTitle('');
    setDescription('');
  };

  const handleUpdateStatus = (reqId: string, newStatus: PrayerRequestStatus) => {
    updatePrayerStatus(reqId, newStatus);
  };

  const handleSavePastoralNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequestForNote) return;

    updatePrayerStatus(
      selectedRequestForNote.id,
      selectedRequestForNote.status,
      pastoralNoteInput.trim() || undefined
    );
    setSelectedRequestForNote(null);
    setPastoralNoteInput('');
  };

  const getStatusBadge = (status: PrayerRequestStatus) => {
    switch (status) {
      case 'urgent':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 animate-pulse">
            🚨 Urgent Attention
          </span>
        );
      case 'prayed_for':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            🙏 Prayed For
          </span>
        );
      case 'in_intercession':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/30">
            🕊️ In Intercession
          </span>
        );
      case 'answered':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
            ✨ Answered Praise
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            📝 New Petition
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Altar Banner */}
      <section className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>CONFIDENTIAL PASTORAL ALTAR & INTERCESSION HUB</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            Prayer Requests & Pastoral Care
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed">
            "Again I say to you that if two of you agree on earth concerning anything that they ask, it will be done for them by My Father in heaven." (Matthew 18:19). Post your private prayer needs for pastoral intercession or agree in prayer with the congregation.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowSubmitModal(true)}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Post a Prayer Need</span>
            </button>
            <span className="text-xs text-slate-400 hidden sm:inline">
              · Strict ministerial privacy with end-to-end pastoral oversight
            </span>
          </div>
        </div>
      </section>

      {/* Role / Access Notification */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <p className="font-semibold text-slate-900 dark:text-white">
              Viewing as: {currentUser.name} ({currentUser.role.replace('_', ' ').toUpperCase()})
            </p>
            <p className="text-[11px] text-slate-500">
              {isPastorOrAdmin
                ? 'Pastoral Council Privileges: You can review all private needs, add pastoral notes, and update statuses (Prayed For, Urgent, In Intercession, Answered).'
                : 'Member View: You can view public prayer needs and track the status of your submitted petitions.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowSubmitModal(true)}
          className="px-3.5 py-1.5 bg-slate-900 dark:bg-amber-600 text-white font-semibold rounded-xl text-xs shrink-0"
        >
          Submit Petition
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search prayer requests by need, member name, or keyword..."
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        {/* Status Pills / Segmented Controls */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {statuses.map((st) => (
            <button
              key={st.id}
              onClick={() => setStatusFilter(st.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                statusFilter === st.id
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>{st.label}</span>
              <span className="text-[10px] opacity-80">({st.count})</span>
            </button>
          ))}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                categoryFilter === cat.id
                  ? 'bg-slate-900 dark:bg-slate-700 text-white'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Petitions Feed Grid */}
      <div className="space-y-4">
        {visibleRequests.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center text-slate-500 space-y-2">
            <Flame className="w-8 h-8 text-amber-500 mx-auto opacity-40" />
            <h3 className="font-bold text-slate-900 dark:text-white text-base">No Petitions Found</h3>
            <p className="text-xs">No prayer requests matching your current filter criteria.</p>
          </div>
        ) : (
          visibleRequests.map((req) => (
            <div
              key={req.id}
              className={`bg-white dark:bg-slate-900 border rounded-3xl p-6 shadow-sm hover:shadow-md transition-all space-y-4 ${
                req.status === 'urgent'
                  ? 'border-rose-500/60 ring-2 ring-rose-500/10'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300">
                      {req.memberName.charAt(0)}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {req.memberName}
                      </h3>
                      {req.isPrivate ? (
                        <span className="flex items-center gap-1 text-[10px] text-amber-700 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded font-semibold">
                          <Lock className="w-3 h-3" /> Private Pastoral
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] text-sky-600 dark:text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded font-semibold">
                          <Globe className="w-3 h-3" /> Public Agreement
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Submitted on {new Date(req.createdAt).toLocaleDateString()} at {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · Category: <span className="capitalize font-semibold text-slate-600 dark:text-slate-300">{req.category.replace('_', ' ')}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  {getStatusBadge(req.status)}
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-2">
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  {req.title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {req.description}
                </p>
              </div>

              {/* Pastoral Counseling Notes & Status History Box */}
              {(req.pastoralNotes || (req.statusHistory && req.statusHistory.length > 0)) && (
                <div className="p-3.5 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> Pastoral Intercession Trail
                    </span>
                    {req.assignedPastor && (
                      <span className="text-slate-500 font-medium">
                        Lead Pastor: {req.assignedPastor}
                      </span>
                    )}
                  </div>

                  {req.pastoralNotes && (
                    <p className="text-slate-700 dark:text-slate-300 italic bg-white dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
                      "{req.pastoralNotes}"
                    </p>
                  )}

                  {req.statusHistory && req.statusHistory.length > 0 && (
                    <div className="pt-1 space-y-1">
                      <p className="text-[10px] uppercase font-bold text-slate-400">Recent Status Actions:</p>
                      {req.statusHistory.slice(0, 3).map((item: PrayerStatusHistoryItem, idx: number) => (
                        <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-500">
                          <span className="font-semibold capitalize text-slate-800 dark:text-slate-200">
                            {item.status.replace('_', ' ')}
                          </span>
                          <span>by {item.updatedBy}</span>
                          <span>·</span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(item.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Card Footer Actions */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                {/* Intercession Button for Saints */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => intercedeForPrayer(req.id)}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                      req.userInterceded
                        ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    <span>🙏</span>
                    <span>Stand in Prayer ({req.intercessorCount})</span>
                  </button>

                  {req.memberPhone && (isPastorOrAdmin || req.memberId === currentUser.id) && (
                    <span className="text-slate-400 text-[11px] flex items-center gap-1">
                      <Phone className="w-3 h-3" /> {req.memberPhone}
                    </span>
                  )}
                </div>

                {/* Pastor Status Update Controls */}
                {isPastorOrAdmin ? (
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400 mr-1">
                      Update Status:
                    </span>
                    <button
                      onClick={() => handleUpdateStatus(req.id, 'urgent')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                        req.status === 'urgent'
                          ? 'bg-rose-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-rose-500/10 hover:text-rose-500'
                      }`}
                    >
                      Urgent
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(req.id, 'prayed_for')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                        req.status === 'prayed_for'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-500/10 hover:text-emerald-500'
                      }`}
                    >
                      Prayed For
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(req.id, 'in_intercession')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                        req.status === 'in_intercession'
                          ? 'bg-sky-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-sky-500/10 hover:text-sky-500'
                      }`}
                    >
                      In Intercession
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(req.id, 'answered')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                        req.status === 'answered'
                          ? 'bg-amber-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-amber-500/10 hover:text-amber-500'
                      }`}
                    >
                      Answered
                    </button>
                    <button
                      onClick={() => {
                        setSelectedRequestForNote(req);
                        setPastoralNoteInput(req.pastoralNotes || '');
                      }}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20"
                    >
                      + Note
                    </button>
                    <button
                      onClick={() => deletePrayerRequest(req.id)}
                      title="Delete petition (Pastor/Admin)"
                      className="p-1 text-slate-400 hover:text-rose-500 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  req.memberId === currentUser.id && (
                    <button
                      onClick={() => deletePrayerRequest(req.id)}
                      className="text-[11px] text-slate-400 hover:text-rose-500"
                    >
                      Remove My Request
                    </button>
                  )
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Post Prayer Need Modal */}
      {showSubmitModal && (
        <div
          role="dialog"
          aria-labelledby="prayer-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in"
        >
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowSubmitModal(false)}
              aria-label="Close dialog"
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h3 id="prayer-modal-title" className="text-base font-bold text-slate-900 dark:text-white">
                  Post a Prayer Need
                </h3>
                <p className="text-xs text-slate-500">
                  Lay your petition upon the Encounter Rhema altar in faith.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmitRequest} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Need / Petition Summary
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Urgent Prayer for Father's Surgery & Peace"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white capitalize"
                  >
                    {categories.filter((c) => c.id !== 'all').map((c) => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Phone for Pastoral Follow-Up
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Petition Details
                </label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain your situation openly so our pastors and intercessors can target their prayers precisely..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              {/* Privacy selector radio */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="block font-bold text-slate-700 dark:text-slate-300">
                  Privacy Level
                </span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="privacy"
                    checked={isPrivate}
                    onChange={() => setIsPrivate(true)}
                    className="text-amber-600 focus:ring-amber-500"
                  />
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      🔒 Strictly Confidential (Senior Pastors Only)
                    </span>
                    <p className="text-[10px] text-slate-500">
                      Only Dr. Emmanuel, Pastor Sarah, and ordained pastors can read and pray over this need.
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="radio"
                    name="privacy"
                    checked={!isPrivate}
                    onChange={() => setIsPrivate(false)}
                    className="text-amber-600 focus:ring-amber-500"
                  />
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      🕊️ Intercessory Army & Church Community
                    </span>
                    <p className="text-[10px] text-slate-500">
                      Shared on the prayer wall for believers to stand in spiritual agreement.
                    </p>
                  </div>
                </label>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2 font-medium text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold rounded-xl shadow"
                >
                  Submit Prayer Need
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Pastoral Note Modal */}
      {selectedRequestForNote && (
        <div
          role="dialog"
          aria-labelledby="note-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in"
        >
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedRequestForNote(null)}
              aria-label="Close note dialog"
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 id="note-modal-title" className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Add Pastoral Counseling / Prayer Note
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              For: "{selectedRequestForNote.title}" ({selectedRequestForNote.memberName})
            </p>

            <form onSubmit={handleSavePastoralNote} className="space-y-4 text-xs">
              <textarea
                rows={4}
                required
                value={pastoralNoteInput}
                onChange={(e) => setPastoralNoteInput(e.target.value)}
                placeholder="Enter ministerial prayer outcome, scripture released, or follow-up note..."
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedRequestForNote(null)}
                  className="px-4 py-2 font-medium text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl shadow"
                >
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
