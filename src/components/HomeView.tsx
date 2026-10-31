/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Radio,
  Play,
  Heart,
  Calendar,
  Sparkles,
  ArrowRight,
  Cake,
  Send,
  MessageCircle,
  Clock,
  MapPin,
  Check,
  Share2,
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const {
    setCurrentPage,
    birthdaysToday,
    sermons,
    events,
    testimonies,
    sendBirthdayGreetings,
    toggleRSVP,
    setActiveSermonForPlayer,
    triggerToast,
  } = useApp();

  const [selectedBirthdayMember, setSelectedBirthdayMember] = useState<string | null>(null);

  const featuredSermon = sermons[0];
  const upcomingEvents = events.slice(0, 3);
  const featuredTestimonies = testimonies.slice(0, 2);

  const handleSendBlessingDirect = (memberName: string, phone: string) => {
    const text = encodeURIComponent(`Blessed Birthday greetings, beloved ${memberName}! Rejoicing with you today from Encounter Rhema Ministries. May God enlarge your territory!`);
    window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
    triggerToast('Blessing Sent!', `Opened WhatsApp blessing chat for ${memberName}.`, 'success');
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-950 text-white border border-slate-800 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent z-10" />
        <img
          src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1600&auto=format&fit=crop&q=80"
          alt="Encounter Rhema Worship Sanctuary"
          className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-luminosity scale-105 filter blur-[1px]"
        />

        <div className="relative z-20 max-w-5xl px-6 sm:px-10 py-16 sm:py-24 space-y-6">
          <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold backdrop-blur-md">
            <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>GLOBAL BROADCAST LIVE NOW · SUNDAY ENCOUNTER</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Where the Spoken <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500">Rhema Word</span> Transforms Destinies.
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
            Welcome to Encounter Rhema Ministries. We are an apostolic and prophetic community dedicated to activating believers in the fullness of God's supernatural power, holiness, and kingdom dominion.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setCurrentPage('live')}
              className="px-6 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-amber-500/25 transition-all flex items-center gap-2.5 transform hover:-translate-y-0.5"
            >
              <Play className="w-4 h-4 fill-current" />
              Watch Live Service
            </button>
            <button
              onClick={() => setCurrentPage('giving')}
              className="px-6 py-3.5 bg-slate-800/90 hover:bg-slate-700 text-white font-semibold text-sm rounded-xl border border-slate-700 backdrop-blur-sm transition-all flex items-center gap-2"
            >
              <Heart className="w-4 h-4 text-rose-400 fill-current" />
              Digital Giving
            </button>
            <button
              onClick={() => setCurrentPage('prayer_requests')}
              className="px-5 py-3.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-semibold text-sm rounded-xl border border-amber-500/30 backdrop-blur-sm transition-all flex items-center gap-2"
            >
              <span>Prayer Altar</span>
            </button>
            <button
              onClick={() => setCurrentPage('events')}
              className="px-5 py-3.5 text-slate-300 hover:text-white font-medium text-sm transition-colors flex items-center gap-1.5"
            >
              <span>Upcoming Services</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick service times strip */}
          <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-800/80 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Sunday: 9:00 AM & 11:30 AM (In-Person & Online)</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Wednesday: 6:30 PM (Rhema Bible Masterclass)</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Main Sanctuary: 1200 Rhema Way, Capital City</span>
            </div>
          </div>
        </div>
      </section>

      {/* TODAY'S BIRTHDAYS (REQUIRED BY USER) */}
      {/* "Let the home page display all the names of the members that have birthdays today in a clean, scrollable list format." */}
      <section className="bg-gradient-to-br from-amber-500/10 via-slate-900/50 to-indigo-950/20 border border-amber-500/20 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold">
              <Cake className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Celebrating Today's Birthdays
                </h2>
                <span className="text-xs bg-amber-500/20 text-amber-600 dark:text-amber-400 font-semibold px-2 py-0.5 rounded-full">
                  {birthdaysToday.length} Celebrating
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Join Encounter Rhema in releasing prayers and joy over our brethren celebrating life today!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => sendBirthdayGreetings()}
              className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-lg shadow transition-colors flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              Broadcast Automated Blessings
            </button>
            <button
              onClick={() => setCurrentPage('directory')}
              className="px-3 py-1.5 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-medium rounded-lg transition-colors"
            >
              View Directory
            </button>
          </div>
        </div>

        {/* Clean, scrollable list format */}
        <div className="mt-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-amber-500/40">
          <div className="flex gap-4 min-w-max">
            {birthdaysToday.map((member) => (
              <div
                key={member.id}
                className="w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-amber-500/40"
                    />
                    <span className="absolute -bottom-1 -right-1 text-xs bg-amber-500 text-slate-950 rounded-full p-0.5">
                      🎂
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {member.name}
                    </h3>
                    <p className="text-xs text-amber-600 dark:text-amber-400 truncate font-medium">
                      {member.ministry}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {member.location}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Birthday Today
                  </span>
                  <button
                    onClick={() => handleSendBlessingDirect(member.name, member.phone)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 font-semibold rounded-lg transition-colors text-xs"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    Send Blessing
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Sermon & Media Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Latest Word from the Altar
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Listen and watch anointed sermons ministered by our Pastoral leadership.
            </p>
          </div>
          <button
            onClick={() => setCurrentPage('media')}
            className="text-amber-600 dark:text-amber-400 font-semibold text-sm hover:underline flex items-center gap-1"
          >
            <span>Browse Full Library</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main feature card */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row">
            <div className="md:w-1/2 relative min-h-[240px]">
              <img
                src={featuredSermon.thumbnail}
                alt={featuredSermon.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-slate-950/30 flex items-center justify-center">
                <button
                  onClick={() => {
                    setActiveSermonForPlayer(featuredSermon);
                    setCurrentPage('media');
                  }}
                  aria-label="Play Featured Sermon"
                  className="w-14 h-14 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center shadow-xl transform hover:scale-110 transition-transform"
                >
                  <Play className="w-6 h-6 fill-current ml-0.5" />
                </button>
              </div>
              <span className="absolute bottom-3 right-3 bg-slate-950/80 text-white text-[11px] font-mono px-2 py-0.5 rounded">
                {featuredSermon.duration}
              </span>
            </div>

            <div className="p-6 md:w-1/2 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1.5">
                  <span className="text-amber-600 dark:text-amber-400 font-medium">{featuredSermon.series}</span>
                  <span>·</span>
                  <span>{featuredSermon.scripture}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
                  {featuredSermon.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-3">
                  {featuredSermon.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  {featuredSermon.speaker}
                </span>
                <button
                  onClick={() => {
                    setActiveSermonForPlayer(featuredSermon);
                    setCurrentPage('media');
                  }}
                  className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline"
                >
                  Watch Sermon
                </button>
              </div>
            </div>
          </div>

          {/* Quick secondary sermon items */}
          <div className="lg:col-span-4 space-y-4">
            {sermons.slice(1, 3).map((sermon) => (
              <div
                key={sermon.id}
                onClick={() => {
                  setActiveSermonForPlayer(sermon);
                  setCurrentPage('media');
                }}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 flex items-center gap-3.5 hover:border-amber-500/50 cursor-pointer transition-all shadow-sm group"
              >
                <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 relative bg-slate-800">
                  <img src={sermon.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <Play className="w-4 h-4 text-white fill-current" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold truncate">{sermon.series}</p>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate mt-0.5">{sermon.title}</h4>
                  <p className="text-[11px] text-slate-400 truncate mt-1">{sermon.speaker}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Kingdom Gatherings & Events
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Mark your calendar for upcoming worship encounters and fellowship.
            </p>
          </div>
          <button
            onClick={() => setCurrentPage('events')}
            className="text-amber-600 dark:text-amber-400 font-semibold text-sm hover:underline flex items-center gap-1"
          >
            <span>Full Calendar</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {upcomingEvents.map((evt) => (
            <div
              key={evt.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="relative h-44">
                <img src={evt.image} alt={evt.title} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-amber-400 px-2.5 py-1 rounded-md text-xs font-bold capitalize">
                  {evt.category.replace('_', ' ')}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(evt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · {evt.time}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1.5">
                    {evt.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
                    {evt.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    {evt.rsvpCount} Attending
                  </span>
                  <button
                    onClick={() => toggleRSVP(evt.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                      evt.userRsvp
                        ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-900 dark:bg-amber-600 text-white hover:bg-slate-800 dark:hover:bg-amber-500'
                    }`}
                  >
                    {evt.userRsvp ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> RSVP'd
                      </>
                    ) : (
                      'RSVP Now'
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonies / Praise Reports Highlight */}
      <section className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto space-y-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>MIRACLES, SIGNS & WONDERS</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold">
            "They Overcame Him by the Blood of the Lamb and the Word of Their Testimony."
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left pt-4">
            {featuredTestimonies.map((test) => (
              <div
                key={test.id}
                className="bg-slate-850/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm flex flex-col justify-between space-y-4"
              >
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    {test.category}
                  </span>
                  <h3 className="text-base font-bold text-white mt-1">
                    {test.title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    "{test.content}"
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-slate-200">— {test.author}</span>
                  <span className="text-amber-400 font-medium">🙌 {test.rejoiceCount} Rejoicing</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 flex justify-center gap-4">
            <button
              onClick={() => setCurrentPage('testimonies')}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow transition-all"
            >
              Read More Miracles & Share Yours
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
