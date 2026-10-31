/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'super_admin' | 'it_media' | 'media_admin' | 'finance_deacon' | 'chat_member' | 'member';
export type ThemeMode = 'light' | 'dark' | 'system';
export type StreamQuality = '1080p' | '720p' | '480p';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar: string;
  department: string;
  birthday: string; // YYYY-MM-DD
  twoFactorEnabled: boolean;
  memberSince: string;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string; // YYYY-MM-DD
  ministry: string;
  location: string;
  avatar: string;
  birthdayNotificationSent?: boolean;
  preferredChannel: 'whatsapp' | 'email' | 'both';
  status: 'active' | 'fellowship' | 'in_training';
}

export interface BirthdayGreeting {
  id: string;
  memberId: string;
  memberName: string;
  phone: string;
  email: string;
  channel: 'whatsapp' | 'email' | 'both';
  message: string;
  timestamp: string;
  status: 'delivered' | 'pending' | 'failed';
  triggeredBy: 'automated_cron' | 'manual_admin';
}

export interface Sermon {
  id: string;
  title: string;
  speaker: string;
  series: string;
  scripture: string;
  date: string;
  duration: string;
  thumbnail: string;
  videoUrl: string;
  audioUrl?: string;
  description: string;
  tags: string[];
  downloadsCount: number;
}

export interface MinistryEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: 'worship' | 'youth' | 'outreach' | 'prayer' | 'bible_study' | 'conference';
  description: string;
  speaker?: string;
  image: string;
  rsvpCount: number;
  userRsvp?: boolean;
}

export interface Testimony {
  id: string;
  author: string;
  title: string;
  content: string;
  category: 'healing' | 'provision' | 'salvation' | 'family' | 'miracle';
  date: string;
  rejoiceCount: number;
  userRejoiced?: boolean;
  approved: boolean;
}

export interface GivingRecord {
  id: string;
  transactionRef: string;
  donorName: string;
  donorEmail: string;
  amount: number;
  currency: string;
  fund: 'tithe' | 'offering' | 'missions' | 'building_fund' | 'benevolence';
  paymentMethod: 'card' | 'bank_transfer' | 'apple_pay';
  frequency: 'one_time' | 'weekly' | 'monthly';
  timestamp: string;
  status: 'successful' | 'pending' | 'failed';
  taxDeductible: boolean;
  receiptNumber: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  entity: string;
  ipAddress: string;
  status: 'success' | 'warning' | 'alert';
  details: string;
}

export interface BackupRecord {
  id: string;
  timestamp: string;
  sizeBytes: number;
  encryptedWith: string; // e.g. 'AES-256-GCM'
  status: 'completed' | 'in_progress' | 'failed';
  emailNotified: boolean;
  type: 'scheduled_nightly' | 'manual_admin';
  checksum: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'pastor' | 'system';
  senderName: string;
  text: string;
  timestamp: string;
  fileAttachment?: {
    name: string;
    size: string;
    type: 'document' | 'image' | 'audio';
    encrypted: boolean;
    dataUrl?: string;
  };
}

export interface SystemHealthMetrics {
  databaseEncrypted: boolean;
  lastBackupTime: string;
  nextScheduledBackup: string;
  systemUptime: string;
  auditEventsToday: number;
  activeMembers: number;
  birthdaysTodayCount: number;
}

export type PrayerRequestStatus = 'new' | 'urgent' | 'in_intercession' | 'prayed_for' | 'answered';
export type PrayerRequestCategory = 'healing' | 'deliverance' | 'finances' | 'family' | 'spiritual_growth' | 'general';

export interface PrayerStatusHistoryItem {
  status: PrayerRequestStatus;
  updatedBy: string;
  timestamp: string;
  note?: string;
}

export interface PrayerRequest {
  id: string;
  memberId: string;
  memberName: string;
  memberEmail: string;
  memberPhone: string;
  title: string;
  description: string;
  category: PrayerRequestCategory;
  isPrivate: boolean; // true = strictly confidential (pastors only); false = intercessory army
  status: PrayerRequestStatus;
  createdAt: string;
  assignedPastor?: string;
  pastoralNotes?: string;
  intercessorCount: number;
  userInterceded?: boolean;
  statusHistory: PrayerStatusHistoryItem[];
}

export interface StudioDeviceInfo {
  id: string;
  name: string;
  kind: 'videoinput' | 'audioinput';
  label: string;
  isVirtual?: boolean;
}

export interface LowerThirdOverlay {
  enabled: boolean;
  speakerName: string;
  title: string;
  scriptureText?: string;
  themeStyle: 'gold' | 'sleek' | 'royal' | 'minimal';
}

export interface ScriptureOverlay {
  enabled: boolean;
  reference: string;
  text: string;
  version: string;
}

export interface StudioBroadcastMetrics {
  bitrateKbps: number;
  fps: number;
  droppedFrames: number;
  cpuPercent: number;
  viewersOnline: number;
  durationSeconds: number;
}

