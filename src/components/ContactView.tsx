/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Lock,
  Heart,
  MessageSquare,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export const ContactView: React.FC = () => {
  const { submitPrayerRequest, triggerToast } = useApp();

  // Contact form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('General Inquiry');
  const [message, setMessage] = useState('');

  // Prayer request state
  const [prayerName, setPrayerName] = useState('');
  const [prayerPhone, setPrayerPhone] = useState('');
  const [prayerEmail, setPrayerEmail] = useState('');
  const [prayerRequest, setPrayerRequest] = useState('');
  const [isConfidential, setIsConfidential] = useState(true);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerToast('Message Sent', 'Thank you for reaching out. Our ministry office will respond within 24 hours.', 'success');
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
  };

  const handlePrayerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prayerRequest.trim()) return;

    submitPrayerRequest({
      name: prayerName || 'Anonymous Petitioner',
      phone: prayerPhone,
      email: prayerEmail,
      request: prayerRequest,
      isConfidential,
    });

    setPrayerName('');
    setPrayerPhone('');
    setPrayerEmail('');
    setPrayerRequest('');
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Header */}
      <section className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl">
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WE ARE HERE TO SERVE YOU</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            Connect With Encounter Rhema
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Have a question, need pastoral guidance, or desire our intercessors to agree with you in prayer? We invite you to reach out.
          </p>
        </div>
      </section>

      {/* Grid: Prayer Request & Contact Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Confidential Prayer Altar Form */}
        <div className="lg:col-span-6 bg-gradient-to-br from-amber-500/10 via-white dark:via-slate-900 to-indigo-950/20 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="flex items-center gap-3 pb-5 border-b border-slate-200 dark:border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Submit a Prayer Petition
              </h2>
              <p className="text-xs text-slate-500">
                Lifted before the throne of Grace by our 24/7 Intercessory Council
              </p>
            </div>
          </div>

          <form onSubmit={handlePrayerSubmit} className="mt-5 space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Your Name (Optional / Anonymous)
              </label>
              <input
                type="text"
                value={prayerName}
                onChange={(e) => setPrayerName(e.target.value)}
                placeholder="e.g. Brother Thomas"
                className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Phone (For WhatsApp Prayer Call)
                </label>
                <input
                  type="tel"
                  value={prayerPhone}
                  onChange={(e) => setPrayerPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={prayerEmail}
                  onChange={(e) => setPrayerEmail(e.target.value)}
                  placeholder="contact@example.com"
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Prayer Petition / Deliverance Need
              </label>
              <textarea
                required
                rows={4}
                value={prayerRequest}
                onChange={(e) => setPrayerRequest(e.target.value)}
                placeholder="Share your heart openly. 'The effective, fervent prayer of a righteous man avails much' (James 5:16)..."
                className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex items-center gap-2 pt-1 text-slate-600 dark:text-slate-300">
              <input
                type="checkbox"
                id="confidential-cb"
                checked={isConfidential}
                onChange={(e) => setIsConfidential(e.target.checked)}
                className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
              />
              <label htmlFor="confidential-cb" className="flex items-center gap-1.5 cursor-pointer">
                <Lock className="w-3.5 h-3.5 text-amber-500" />
                <span>Strict Pastoral Confidentiality (Senior Pastors only)</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Lay Petition Upon the Altar</span>
            </button>
          </form>
        </div>

        {/* General Inquiries & Campus Map Card */}
        <div className="lg:col-span-6 space-y-6">
          {/* Sanctuary Location & Hours */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-amber-500" />
              Main Sanctuary & Campus
            </h2>

            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <p className="font-semibold text-slate-900 dark:text-white">
                Encounter Rhema Ministries International
              </p>
              <p>1200 Rhema Way, Cathedral Hill, Capital City, CC 94103</p>
              <p>Phone: +1 (555) 743-6200 · Pastoral Hotline: +1 (555) 743-6209</p>
              <p>Email: contact@encounterrhema.org</p>
            </div>

            {/* Interactive Campus Map Viewport */}
            <div className="h-44 rounded-2xl bg-slate-950 overflow-hidden relative border border-slate-800 flex items-center justify-center text-white p-4 text-center">
              <img
                src="https://images.unsplash.com/photo-1524813686514-a57563d77d61?w=800&auto=format&fit=crop&q=80"
                alt="Map Background"
                className="absolute inset-0 w-full h-full object-cover opacity-30"
              />
              <div className="relative z-10 space-y-2">
                <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 mx-auto flex items-center justify-center font-bold">
                  <MapPin className="w-4 h-4" />
                </div>
                <p className="text-xs font-bold">Encounter Rhema Campus & Parking</p>
                <p className="text-[10px] text-slate-300">Convenient shuttle services available from Metro Stations</p>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-amber-400 font-semibold hover:underline"
                >
                  <span>Open Directions in Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Service Times Quick Reference */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white space-y-3">
            <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Weekly Service Schedule
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
              <div className="p-3 bg-slate-800/80 rounded-xl">
                <p className="font-bold text-white">Sunday Worship & Miracles</p>
                <p className="text-amber-400 font-mono mt-0.5">09:00 AM & 11:30 AM</p>
                <p className="text-[10px] text-slate-400">Sanctuary & Global Live Stream</p>
              </div>
              <div className="p-3 bg-slate-800/80 rounded-xl">
                <p className="font-bold text-white">Midweek Rhema Masterclass</p>
                <p className="text-amber-400 font-mono mt-0.5">Wednesday 06:30 PM</p>
                <p className="text-[10px] text-slate-400">Expository Bible Study</p>
              </div>
              <div className="p-3 bg-slate-800/80 rounded-xl">
                <p className="font-bold text-white">Supernatural Night Vigil</p>
                <p className="text-amber-400 font-mono mt-0.5">1st Friday 10:00 PM</p>
                <p className="text-[10px] text-slate-400">Healing & Warfare Prayer</p>
              </div>
              <div className="p-3 bg-slate-800/80 rounded-xl">
                <p className="font-bold text-white">Youth & Young Adults</p>
                <p className="text-amber-400 font-mono mt-0.5">Saturdays 05:00 PM</p>
                <p className="text-[10px] text-slate-400">Rhema Blaze Fellowship</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
