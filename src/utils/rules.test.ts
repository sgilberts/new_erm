/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getBirthdaysToday,
  getBirthdaysThisWeek,
  getBirthdaysUpcomingMonth,
  generateBirthdayGreetings,
  hasPermission,
  calculateGivingBreakdown,
  exportToCSV,
  filterPrayerRequests,
  updatePrayerRequestStatus,
  resolveTheme,
} from './rules';
import { Member, GivingRecord, PrayerRequest } from '../types';

const mockMembers: Member[] = [
  {
    id: 'm1',
    name: 'Sister Deborah Vance',
    email: 'deborah@example.com',
    phone: '+1-555-0101',
    dateOfBirth: '1992-10-30', // Oct 30 -> Birthday TODAY!
    ministry: 'Worship Team',
    location: 'Main Sanctuary',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    preferredChannel: 'whatsapp',
    status: 'active',
  },
  {
    id: 'm2',
    name: 'Elder Marcus Thorne',
    email: 'marcus@example.com',
    phone: '+1-555-0102',
    dateOfBirth: '1985-11-02', // Nov 2 -> Within this week!
    ministry: 'Pastoral Council',
    location: 'North Campus',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    preferredChannel: 'both',
    status: 'active',
  },
  {
    id: 'm3',
    name: 'Brother Samuel Adebayo',
    email: 'samuel@example.com',
    phone: '+1-555-0103',
    dateOfBirth: '1998-11-18', // Nov 18 -> In upcoming month (November)
    ministry: 'Media & Tech',
    location: 'Main Sanctuary',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    preferredChannel: 'email',
    status: 'active',
  },
  {
    id: 'm4',
    name: 'Hannah Kim',
    email: 'hannah@example.com',
    phone: '+1-555-0104',
    dateOfBirth: '1995-04-12', // April -> Not today, not this week, not next month
    ministry: 'Youth Ministry',
    location: 'Youth Center',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    preferredChannel: 'whatsapp',
    status: 'active',
  },
];

test('getBirthdaysToday accurately detects members with birthdays on target date', () => {
  const targetDate = new Date('2026-10-30T12:00:00Z');
  const todayBirthdays = getBirthdaysToday(mockMembers, targetDate);
  assert.equal(todayBirthdays.length, 1);
  assert.equal(todayBirthdays[0].name, 'Sister Deborah Vance');
});

test('getBirthdaysThisWeek includes birthdays happening in the rolling 7-day window', () => {
  const targetDate = new Date('2026-10-30T12:00:00Z');
  const weekBirthdays = getBirthdaysThisWeek(mockMembers, targetDate);
  // Oct 30 and Nov 2 are both in this 7-day window
  assert.equal(weekBirthdays.length, 2);
  const names = weekBirthdays.map((m) => m.name);
  assert.ok(names.includes('Sister Deborah Vance'));
  assert.ok(names.includes('Elder Marcus Thorne'));
});

test('getBirthdaysUpcomingMonth isolates members born in the subsequent month', () => {
  const targetDate = new Date('2026-10-30T12:00:00Z');
  const upcomingMonthBirthdays = getBirthdaysUpcomingMonth(mockMembers, targetDate);
  // November is month 11: Marcus (Nov 2) and Samuel (Nov 18)
  assert.equal(upcomingMonthBirthdays.length, 2);
  const names = upcomingMonthBirthdays.map((m) => m.name);
  assert.ok(names.includes('Elder Marcus Thorne'));
  assert.ok(names.includes('Brother Samuel Adebayo'));
});

test('generateBirthdayGreetings outputs valid personalized message with scripture and link', () => {
  const greeting = generateBirthdayGreetings(mockMembers[0]);
  assert.ok(greeting.whatsappText.includes('Sister Deborah Vance'));
  assert.ok(greeting.whatsappUrl.startsWith('https://wa.me/15550101'));
  assert.ok(greeting.emailSubject.includes('Sister Deborah Vance'));
});

test('hasPermission enforces correct RBAC rules', () => {
  assert.equal(hasPermission('super_admin', 'trigger_backup'), true);
  assert.equal(hasPermission('finance_deacon', 'trigger_backup'), false);
  assert.equal(hasPermission('finance_deacon', 'view_giving_totals'), true);
  assert.equal(hasPermission('media_admin', 'manage_sermons'), true);
  assert.equal(hasPermission('media_admin', 'view_giving_totals'), false);
  assert.equal(hasPermission('member', 'manage_sermons'), false);
});

test('calculateGivingBreakdown totals funds accurately', () => {
  const records: GivingRecord[] = [
    {
      id: 'g1',
      transactionRef: 'TX1001',
      donorName: 'John',
      donorEmail: 'john@example.com',
      amount: 500,
      currency: 'USD',
      fund: 'tithe',
      paymentMethod: 'card',
      frequency: 'one_time',
      timestamp: '2026-10-30T10:00:00Z',
      status: 'successful',
      taxDeductible: true,
      receiptNumber: 'REC-2026-001',
    },
    {
      id: 'g2',
      transactionRef: 'TX1002',
      donorName: 'Mary',
      donorEmail: 'mary@example.com',
      amount: 250,
      currency: 'USD',
      fund: 'missions',
      paymentMethod: 'bank_transfer',
      frequency: 'monthly',
      timestamp: '2026-10-30T11:00:00Z',
      status: 'successful',
      taxDeductible: true,
      receiptNumber: 'REC-2026-002',
    },
    {
      id: 'g3',
      transactionRef: 'TX1003',
      donorName: 'Anonymous',
      donorEmail: 'anon@example.com',
      amount: 1000,
      currency: 'USD',
      fund: 'building_fund',
      paymentMethod: 'apple_pay',
      frequency: 'one_time',
      timestamp: '2026-10-30T11:30:00Z',
      status: 'failed', // Should be excluded from total
      taxDeductible: true,
      receiptNumber: 'REC-2026-003',
    },
  ];

  const breakdown = calculateGivingBreakdown(records);
  assert.equal(breakdown.total, 750);
  assert.equal(breakdown.count, 2);
  assert.equal(breakdown.byFund.tithe, 500);
  assert.equal(breakdown.byFund.missions, 250);
});

test('exportToCSV generates properly formatted RFC4180 CSV rows', () => {
  const items = [
    { name: 'John Doe', role: 'Elder', amount: 100 },
    { name: 'Jane, "Pastor" Doe', role: 'Pastor', amount: 200 },
  ];
  const csv = exportToCSV(items, [
    { key: 'name', header: 'Full Name' },
    { key: 'role', header: 'Church Role' },
    { key: 'amount', header: 'Pledge ($)' },
  ]);

  assert.ok(csv.includes('"Full Name","Church Role","Pledge ($)"'));
  assert.ok(csv.includes('"John Doe","Elder","100"'));
  assert.ok(csv.includes('"Jane, ""Pastor"" Doe","Pastor","200"'));
});

test('filterPrayerRequests restricts private prayer needs to pastors or authors', () => {
  const sampleRequests: Partial<PrayerRequest>[] = [
    {
      id: 'p1',
      memberId: 'mem-01',
      memberName: 'Sister Deborah',
      title: 'Confidential Family Matter',
      isPrivate: true,
      status: 'urgent',
      category: 'family',
    },
    {
      id: 'p2',
      memberId: 'mem-02',
      memberName: 'Brother Kevin',
      title: 'Healing for Knees',
      isPrivate: false,
      status: 'prayed_for',
      category: 'healing',
    },
  ];

  // Pastors see all, including private
  const pastorView = filterPrayerRequests(sampleRequests, { isPastorOrAdmin: true });
  assert.equal(pastorView.length, 2);

  // Author sees their own private request and public requests
  const authorView = filterPrayerRequests(sampleRequests, {
    isPastorOrAdmin: false,
    currentUserId: 'mem-01',
  });
  assert.equal(authorView.length, 2);

  // Unrelated member does NOT see private request
  const otherMemberView = filterPrayerRequests(sampleRequests, {
    isPastorOrAdmin: false,
    currentUserId: 'mem-99',
  });
  assert.equal(otherMemberView.length, 1);
  assert.equal(otherMemberView[0].id, 'p2');
});

test('updatePrayerRequestStatus records timestamp and history audit trail', () => {
  const initialReq: Partial<PrayerRequest> = {
    id: 'p1',
    status: 'urgent',
    assignedPastor: undefined,
    statusHistory: [],
  };

  const updated = updatePrayerRequestStatus(initialReq, 'prayed_for', 'Dr. Emmanuel K. Osei', 'Layed hands and prayed');
  assert.equal(updated.status, 'prayed_for');
  assert.equal(updated.assignedPastor, 'Dr. Emmanuel K. Osei');
  assert.equal(updated.statusHistory.length, 1);
  assert.equal(updated.statusHistory[0].status, 'prayed_for');
  assert.equal(updated.statusHistory[0].note, 'Layed hands and prayed');
});

test('resolveTheme accurately calculates theme for light, dark, and system modes', () => {
  assert.equal(resolveTheme('light', false), 'light');
  assert.equal(resolveTheme('light', true), 'light');
  assert.equal(resolveTheme('dark', false), 'dark');
  assert.equal(resolveTheme('dark', true), 'dark');
  assert.equal(resolveTheme('system', false), 'light');
  assert.equal(resolveTheme('system', true), 'dark');
});

test('hasPermission grants appropriate dashboard access to chat_member and super_admin', () => {
  assert.equal(hasPermission('super_admin', 'access_admin_dashboard'), true);
  assert.equal(hasPermission('chat_member', 'access_admin_dashboard'), true);
  assert.equal(hasPermission('chat_member', 'respond_chat'), true);
  assert.equal(hasPermission('chat_member', 'trigger_backup'), false);
  assert.equal(hasPermission('member', 'access_admin_dashboard'), false);
});


