/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Member } from '../types';
import { generateBirthdayGreetings, getMonthAndDay } from '../utils/rules';
import {
  Users,
  Search,
  Filter,
  Plus,
  Phone,
  Mail,
  Cake,
  MessageCircle,
  Sparkles,
  ShieldCheck,
  Send,
  X,
  MapPin,
} from 'lucide-react';

export const MemberDirectoryView: React.FC = () => {
  const { members, addMember, sendBirthdayGreetings, currentUser, triggerToast } = useApp();

  const [search, setSearch] = useState('');
  const [selectedMinistry, setSelectedMinistry] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New member form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('1994-10-30');
  const [ministry, setMinistry] = useState('Worship & Creative Arts');
  const [location, setLocation] = useState('Main Sanctuary');
  const [preferredChannel, setPreferredChannel] = useState<'whatsapp' | 'email' | 'both'>('whatsapp');

  const ministries = [
    'all',
    'Worship & Creative Arts',
    'Pastoral Care & Counseling',
    'Governance Board',
    'Evangelism & Missions',
    'Media & Livestream Broadcast',
    'Intercessory Prayer Army',
    'Youth & Young Adults (Rhema Blaze)',
    'Children Ministry (Rhema Kids)',
    'Ushering & Protocol',
  ];

  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.phone.includes(search);
    const matchesMinistry = selectedMinistry === 'all' || m.ministry === selectedMinistry;
    return matchesSearch && matchesMinistry;
  });

  const handleSendSingleBlessing = (member: Member) => {
    const greeting = generateBirthdayGreetings(member);
    window.open(greeting.whatsappUrl, '_blank');
    sendBirthdayGreetings(member.id);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !dateOfBirth) {
      triggerToast('Missing Fields', 'Please enter member name, phone, and date of birth.', 'alert');
      return;
    }

    addMember({
      name: name.trim(),
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '.')}@rhema.org`,
      phone: phone.trim(),
      dateOfBirth,
      ministry,
      location,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      preferredChannel,
      status: 'active',
    });

    setShowAddModal(false);
    setName('');
    setEmail('');
    setPhone('');
  };

  const isTodayBirthday = (dob: string) => {
    const b = getMonthAndDay(dob);
    return b.month === 10 && b.day === 30; // 2026-10-30
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Member Fellowship Directory
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
              {members.length} Enrolled
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Connect with brothers and sisters across departments, departments, and celebrate birthdays together.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-xl shadow transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Member Profile</span>
        </button>
      </div>

      {/* Search & Ministry Department Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search members by name, email, phone number, or department..."
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
          {ministries.map((min) => (
            <button
              key={min}
              onClick={() => setSelectedMinistry(min)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedMinistry === min
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {min === 'all' ? 'All Departments' : min}
            </button>
          ))}
        </div>
      </div>

      {/* Member Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => {
          const birthdayToday = isTodayBirthday(member.dateOfBirth);

          return (
            <div
              key={member.id}
              className={`bg-white dark:bg-slate-900 border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between ${
                birthdayToday
                  ? 'border-amber-500 ring-2 ring-amber-500/20'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-12 h-12 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                      />
                      {birthdayToday && (
                        <span className="absolute -bottom-1 -right-1 text-xs bg-amber-500 text-slate-950 rounded-full p-0.5 shadow">
                          🎂
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {member.name}
                      </h3>
                      <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                        {member.ministry}
                      </p>
                    </div>
                  </div>

                  {birthdayToday && (
                    <span className="text-[10px] bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold px-2 py-0.5 rounded-full shrink-0 animate-pulse">
                      Birthday Today!
                    </span>
                  )}
                </div>

                <div className="mt-4 space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <Cake className="w-3.5 h-3.5 text-amber-500" />
                    <span>Birthday: {new Date(member.dateOfBirth).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{member.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{member.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{member.location}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-400">
                  Channel: {member.preferredChannel}
                </span>

                <button
                  onClick={() => handleSendSingleBlessing(member)}
                  className="px-2.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Bless via WhatsApp</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add New Member Modal */}
      {showAddModal && (
        <div
          role="dialog"
          aria-labelledby="add-member-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in"
        >
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowAddModal(false)}
              aria-label="Close form"
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 id="add-member-title" className="text-base font-bold text-slate-900 dark:text-white">
                  Register Member Profile
                </h3>
                <p className="text-xs text-slate-500">
                  Enables automated birthday greetings, fellowship directory, and pastoral care.
                </p>
              </div>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sister Grace Oladipo"
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Phone (WhatsApp Enabled)
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    required
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@rhema.org"
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Ministry / Department
                  </label>
                  <select
                    value={ministry}
                    onChange={(e) => setMinistry(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    {ministries.filter((m) => m !== 'all').map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Birthday Message Channel
                  </label>
                  <select
                    value={preferredChannel}
                    onChange={(e) => setPreferredChannel(e.target.value as any)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    <option value="whatsapp">WhatsApp Only</option>
                    <option value="email">Email Only</option>
                    <option value="both">Both WhatsApp & Email</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 font-medium text-slate-600 dark:text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-xl shadow"
                >
                  Save Member Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
