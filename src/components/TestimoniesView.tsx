/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Testimony } from '../types';
import {
  Sparkles,
  Plus,
  Heart,
  Share2,
  CheckCircle2,
  X,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';

export const TestimoniesView: React.FC = () => {
  const { testimonies, rejoiceTestimony, addTestimony, currentUser, triggerToast } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);

  // New testimony form
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState(currentUser.name);
  const [category, setCategory] = useState<'healing' | 'provision' | 'salvation' | 'family' | 'miracle'>('healing');
  const [content, setContent] = useState('');

  const categories = ['all', 'healing', 'provision', 'salvation', 'family', 'miracle'];

  const filteredTestimonies = testimonies.filter((t) => {
    const matchesCat = selectedCategory === 'all' || t.category === selectedCategory;
    const isApproved = t.approved || currentUser.role === 'super_admin' || currentUser.role === 'media_admin';
    return matchesCat && isApproved;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      triggerToast('Missing Fields', 'Please provide a title and your testimony details.', 'alert');
      return;
    }

    addTestimony({
      title: title.trim(),
      author: author.trim() || 'Faithful Worshipper',
      category,
      content: content.trim(),
    });

    setShowSubmitModal(false);
    setTitle('');
    setContent('');
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <section className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl">
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>THE ALTAR OF PRAISE & MIRACLES</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            Signs, Wonders & Testimonies
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Every miracle is proof that Jesus Christ is the same yesterday, today, and forever. Rejoice with brethren and release your own praise report to strengthen the body of Christ!
          </p>
        </div>
      </section>

      {/* Top Actions & Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {cat === 'all' ? 'All Miracles' : cat}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowSubmitModal(true)}
          className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl shadow transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Share Your Praise Report</span>
        </button>
      </div>

      {/* Testimonies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTestimonies.map((test) => (
          <div
            key={test.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  {test.category}
                </span>
                <span className="text-[11px] text-slate-400">
                  {new Date(test.date).toLocaleDateString()}
                </span>
              </div>

              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                {test.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">
                "{test.content}"
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  {test.author}
                </p>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Verified Testimony
                </p>
              </div>

              <button
                onClick={() => rejoiceTestimony(test.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  test.userRejoiced
                    ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <span>🙌</span>
                <span>Amen! ({test.rejoiceCount})</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Share Testimony Modal */}
      {showSubmitModal && (
        <div
          role="dialog"
          aria-labelledby="submit-testimony-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in"
        >
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowSubmitModal(false)}
              aria-label="Close modal"
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 id="submit-testimony-title" className="text-base font-bold text-slate-900 dark:text-white">
                  Share Your Miracle Praise Report
                </h3>
                <p className="text-xs text-slate-500">
                  Give glory to God for what He has spoken and brought to pass.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Testimony Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Supernatural Favor & New Job Breakthrough"
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white capitalize"
                  >
                    {categories.filter((c) => c !== 'all').map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  What Did the Lord Do? (Detailed Praise Report)
                </label>
                <textarea
                  required
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Describe how God manifested His Rhema word in your situation..."
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2 font-medium text-slate-600 dark:text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-xl shadow"
                >
                  Publish Praise Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
