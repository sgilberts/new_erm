/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Heart, Phone, Mail, MapPin, Radio, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentPage } = useApp();

  return (
    <footer className="bg-slate-950 text-white border-t border-slate-800/80 pt-16 pb-24 lg:pb-16 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800/60">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-300 p-0.5 flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </div>
              </div>
              <span className="text-base font-black tracking-tight text-white">
                ENCOUNTER <span className="text-amber-400">RHEMA</span>
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              An apostolic & prophetic family ministering the living Rhema Word to awaken believers in supernatural power, divine health, and kingdom dominion.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-[11px]">
              <ShieldCheck className="w-4 h-4" /> IRS 501(c)(3) Non-Profit Ministry
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-bold uppercase tracking-wider text-amber-400 text-xs">
              Sanctuary Portals
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button onClick={() => setCurrentPage('home')} className="hover:text-white transition-colors">
                  Home & Birthdays Celebration
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('live')} className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Radio className="w-3 h-3 text-rose-500 animate-pulse" />
                  <span>Sunday Live Broadcast</span>
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('media')} className="hover:text-white transition-colors">
                  Sermon Video & Audio Library
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('giving')} className="hover:text-white transition-colors">
                  Digital Giving & Tax Statements
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('events')} className="hover:text-white transition-colors">
                  Interactive Ministry Calendar
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('directory')} className="hover:text-white transition-colors">
                  Member Directory & Fellowship
                </button>
              </li>
            </ul>
          </div>

          {/* Service Times */}
          <div className="space-y-3">
            <h4 className="font-bold uppercase tracking-wider text-amber-400 text-xs">
              Weekly Gatherings
            </h4>
            <div className="space-y-2 text-slate-400">
              <p><strong className="text-white">Sunday Worship:</strong> 9:00 AM & 11:30 AM</p>
              <p><strong className="text-white">Wednesday Bible Study:</strong> 6:30 PM</p>
              <p><strong className="text-white">1st Friday Night Vigil:</strong> 10:00 PM</p>
              <p><strong className="text-white">Youth Blaze:</strong> Saturdays 5:00 PM</p>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="font-bold uppercase tracking-wider text-amber-400 text-xs">
              Main Cathedral Campus
            </h4>
            <div className="space-y-2 text-slate-400">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>1200 Rhema Way, Cathedral Hill, Capital City</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <span>+1 (555) 743-6200</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <span>contact@encounterrhema.org</span>
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <p>© 2026 Encounter Rhema Ministries. All Rights Reserved. Built with Living Word Revelation.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => setCurrentPage('admin')} className="text-slate-400 hover:text-amber-400">
              Admin & Governance CMS
            </button>
            <span>·</span>
            <button onClick={() => setCurrentPage('contact')} className="text-slate-400 hover:text-white">
              Confidential Prayer Altar
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
