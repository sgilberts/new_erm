/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, BookOpen, Flame, Globe2, ShieldCheck, HeartHandshake, MapPin, Users } from 'lucide-react';

export const AboutView: React.FC = () => {
  const { setCurrentPage } = useApp();

  const leaders = [
    {
      name: 'Dr. Emmanuel K. Osei',
      role: 'Senior Pastor & Presiding Apostle',
      bio: 'Called with an apostolic mandate to impart prophetic revelation, divine healing, and kingdom leadership. Dr. Emmanuel has ministered worldwide with notable signs and wonders.',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
    },
    {
      name: 'Pastor Sarah K. Osei',
      role: 'Co-Pastor & Director of Family Life',
      bio: 'A passionate teacher of the living Word, championing covenant marriage, women of valor, and multi-generational generational wealth stewardship.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    },
    {
      name: 'Elder Marcus Thorne',
      role: 'Head of Pastoral Governance',
      bio: 'Providing oversight in theological integrity, executive administration, and deacon ministries across our regional campuses.',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
    },
    {
      name: 'Minister Grace Adeboye',
      role: 'Director of Global Missions & Outreach',
      bio: 'Leading evangelistic crusades, food pantries, urban crisis relief, and international church planting initiatives.',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    },
  ];

  const pillars = [
    {
      icon: <BookOpen className="w-6 h-6 text-amber-500" />,
      title: 'The Rhema Spoken Word',
      description: 'We believe God continues to speak authoritatively today through His activated Word, quickening hearts and reversing impossibilities.',
    },
    {
      icon: <Flame className="w-6 h-6 text-amber-500" />,
      title: 'Supernatural Power & Revival',
      description: 'The Holy Spirit is present and active with signs, wonders, prophetic revelation, and deliverance for all believers.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-amber-500" />,
      title: 'Kingdom Dominion & Integrity',
      description: 'True faith manifests in moral purity, financial stewardship, ethical leadership, and transforming the cultural spheres of influence.',
    },
    {
      icon: <Globe2 className="w-6 h-6 text-amber-500" />,
      title: 'Global Outreach & Soul Winning',
      description: 'Committed to carrying the Gospel of Jesus Christ to every nation, tribe, and tongue through compassionate action.',
    },
  ];

  return (
    <div className="space-y-12 pb-16">
      {/* Header Banner */}
      <section className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-14 text-white relative overflow-hidden shadow-2xl">
        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>OUR HERITAGE & MANDATE</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            About Encounter Rhema Ministries
          </h1>
          <p className="text-base text-slate-300 leading-relaxed">
            Founded on the divine commission of Romans 10:8 — "The word is nigh thee, even in thy mouth, and in thy heart: that is, the word of faith, which we preach." Encounter Rhema exists to awaken believers to living faith, genuine holiness, and transformative worship.
          </p>
        </div>
      </section>

      {/* Pillars Section */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Our Four Foundational Pillars
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            The immutable spiritual truths that guide our theology, worship, and ministry practice.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4">
                  {pillar.icon}
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                  {pillar.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Leadership Section */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Pastoral Leadership Team
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Anointed shepherds called to equip the saints for the work of ministry.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {leaders.map((leader, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between"
            >
              <div className="h-56 overflow-hidden bg-slate-800">
                <img
                  src={leader.image}
                  alt={leader.name}
                  className="w-full h-full object-cover object-top hover:scale-105 transition-transform"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {leader.name}
                  </h3>
                  <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                    {leader.role}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-4 leading-relaxed">
                    {leader.bio}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Statement of Faith & Action */}
      <section className="bg-gradient-to-r from-amber-600/15 via-slate-900 to-indigo-950/20 border border-amber-500/20 rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Ready to Connect with our Community?
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Whether you are exploring faith, looking for a church home, or seeking prayer, our pastoral family welcomes you with open arms.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentPage('contact')}
            className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs rounded-xl shadow transition-colors"
          >
            Connect With A Pastor
          </button>
          <button
            onClick={() => setCurrentPage('directory')}
            className="px-5 py-2.5 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white font-medium text-xs rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Explore Directory
          </button>
        </div>
      </section>
    </div>
  );
};
