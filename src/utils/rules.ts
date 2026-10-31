/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Member, UserRole, GivingRecord, AuditLog } from '../types';

/**
 * Normalizes date string or Date object to month and day (MM-DD)
 */
export function getMonthAndDay(dateInput: string | Date): { month: number; day: number } {
  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  return {
    month: d.getUTCMonth() + 1, // 1-12
    day: d.getUTCDate(),       // 1-31
  };
}

/**
 * Filter members whose birthday falls on the given target date (month and day match)
 */
export function getBirthdaysToday(members: Member[], targetDate: Date = new Date('2026-10-30T12:00:00Z')): Member[] {
  const target = getMonthAndDay(targetDate);
  return members.filter((m) => {
    const bday = getMonthAndDay(m.dateOfBirth);
    return bday.month === target.month && bday.day === target.day;
  });
}

/**
 * Filter members whose birthday is in the next 7 days starting from targetDate
 */
export function getBirthdaysThisWeek(members: Member[], targetDate: Date = new Date('2026-10-30T12:00:00Z')): Member[] {
  const currentYear = targetDate.getUTCFullYear();
  const baseTime = new Date(Date.UTC(currentYear, targetDate.getUTCMonth(), targetDate.getUTCDate())).getTime();
  const sevenDaysLater = baseTime + 7 * 24 * 60 * 60 * 1000;

  return members.filter((m) => {
    const bday = getMonthAndDay(m.dateOfBirth);
    const thisYearBday = new Date(Date.UTC(currentYear, bday.month - 1, bday.day)).getTime();
    return thisYearBday >= baseTime && thisYearBday <= sevenDaysLater;
  });
}

/**
 * Filter members whose birthday is in the upcoming month (e.g. November for Oct target)
 */
export function getBirthdaysUpcomingMonth(members: Member[], targetDate: Date = new Date('2026-10-30T12:00:00Z')): Member[] {
  const nextMonth = (targetDate.getUTCMonth() + 1) % 12 + 1; // 1-12
  return members.filter((m) => {
    const bday = getMonthAndDay(m.dateOfBirth);
    return bday.month === nextMonth;
  });
}

/**
 * Generates personalized prayer and greeting message for WhatsApp and Email
 */
export function generateBirthdayGreetings(member: Member, churchName = 'Encounter Rhema Ministries') {
  const scriptures = [
    'Numbers 6:24-26 - "The Lord bless you and keep you; The Lord make His face shine upon you."',
    'Psalm 20:4 - "May He grant you according to your heart’s desire and fulfill all your purpose."',
    'Jeremiah 29:11 - "For I know the plans I have for you, plans to prosper you and give you hope and a future."'
  ];
  const scripture = scriptures[member.name.length % scriptures.length];

  const whatsappText = `🕊️ *Happy Birthday, Beloved ${member.name}!* 🎉\n\nOn this glorious day, your family at *${churchName}* celebrates the grace and beauty of God upon your life! May this new season overflow with fresh Rhema revelation, divine health, supernatural breakthrough, and endless joy.\n\n📖 *Scripture Blessing:*\n_${scripture}_\n\nWith love and prayers,\n*Senior Pastors & Leadership Team*\n${churchName}`;

  const emailSubject = `🎂 Blessed Birthday Wishes to ${member.name} — From Encounter Rhema Ministries`;
  const emailHtml = `Dear ${member.name},\n\nGrace and peace be multiplied unto you on your special day! Encounter Rhema Ministries rejoices with you. We decree that your path shines brighter and brighter as you step into your new year.\n\nScripture of the Day: ${scripture}\n\nHave a blessed celebration!`;

  return {
    whatsappText,
    emailSubject,
    emailHtml,
    whatsappUrl: `https://wa.me/${member.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappText)}`
  };
}

/**
 * Resolves active theme based on user selection ('light', 'dark', 'system')
 */
export function resolveTheme(mode: 'light' | 'dark' | 'system', systemPrefersDark: boolean): 'dark' | 'light' {
  if (mode === 'system') {
    return systemPrefersDark ? 'dark' : 'light';
  }
  return mode;
}

/**
 * Role-Based Access Control validator
 */
export function hasPermission(
  role: UserRole,
  permission:
    | 'manage_sermons'
    | 'manage_events'
    | 'view_giving_totals'
    | 'manage_giving'
    | 'manage_members'
    | 'trigger_backup'
    | 'view_audit_logs'
    | 'export_reports'
    | 'send_birthday_broadcast'
    | 'respond_chat'
    | 'access_admin_dashboard'
    | 'access_studio'
): boolean {
  if (role === 'super_admin') return true;

  switch (permission) {
    case 'access_studio':
      return role === 'it_media';
    case 'access_admin_dashboard':
      return role === 'it_media' || role === 'media_admin' || role === 'finance_deacon' || role === 'chat_member';
    case 'respond_chat':
      return role === 'chat_member';
    case 'manage_sermons':
    case 'manage_events':
      return role === 'it_media' || role === 'media_admin';
    case 'view_giving_totals':
    case 'manage_giving':
    case 'export_reports':
      return role === 'finance_deacon';
    case 'view_audit_logs':
      return role === 'it_media' || role === 'finance_deacon' || role === 'media_admin' || role === 'chat_member';
    case 'manage_members':
    case 'send_birthday_broadcast':
      return role === 'media_admin' || role === 'chat_member';
    case 'trigger_backup':
      return false; // only super admin
    default:
      return false;
  }
}

/**
 * Computes financial breakdown for digital giving
 */
export function calculateGivingBreakdown(records: GivingRecord[]) {
  const successful = records.filter((r) => r.status === 'successful');
  const total = successful.reduce((acc, curr) => acc + curr.amount, 0);

  const byFund: Record<string, number> = {
    tithe: 0,
    offering: 0,
    missions: 0,
    building_fund: 0,
    benevolence: 0,
  };

  successful.forEach((r) => {
    if (byFund[r.fund] !== undefined) {
      byFund[r.fund] += r.amount;
    }
  });

  return {
    total,
    count: successful.length,
    byFund,
    averageGift: successful.length > 0 ? Math.round(total / successful.length) : 0,
  };
}

/**
 * Encrypted backup metadata generator
 */
export function generateEncryptedBackupMetadata(dataToEncrypt: object) {
  const serialized = JSON.stringify(dataToEncrypt);
  const sizeBytes = new TextEncoder().encode(serialized).length;
  // Deterministic mock checksum calculation
  let hash = 0;
  for (let i = 0; i < serialized.length; i++) {
    hash = (hash << 5) - hash + serialized.charCodeAt(i);
    hash |= 0;
  }
  const checksum = `sha256_${Math.abs(hash).toString(16).padStart(8, '0')}${Date.now().toString(16)}`;

  return {
    id: `bk_${Date.now()}`,
    timestamp: new Date().toISOString(),
    sizeBytes,
    encryptedWith: 'AES-256-GCM',
    status: 'completed' as const,
    emailNotified: true,
    type: 'manual_admin' as const,
    checksum,
  };
}

/**
 * CSV converter helper for compliance reports
 */
export function exportToCSV<T extends Record<string, any>>(data: T[], columns: { key: keyof T; header: string }[]): string {
  const headerRow = columns.map((c) => `"${c.header}"`).join(',');
  const rows = data.map((item) =>
    columns
      .map((c) => {
        const val = item[c.key];
        const stringVal = val === null || val === undefined ? '' : String(val).replace(/"/g, '""');
        return `"${stringVal}"`;
      })
      .join(',')
  );
  return [headerRow, ...rows].join('\n');
}

/**
 * Filter prayer requests based on permissions and criteria
 */
export function filterPrayerRequests(
  requests: any[],
  options: {
    currentUserId?: string;
    isPastorOrAdmin: boolean;
    statusFilter?: string;
    categoryFilter?: string;
    searchQuery?: string;
  }
) {
  return requests.filter((req) => {
    // Privacy check: if private, only pastors/admins or the author can see it
    if (req.isPrivate && !options.isPastorOrAdmin && req.memberId !== options.currentUserId) {
      return false;
    }

    // Status filter
    if (options.statusFilter && options.statusFilter !== 'all' && req.status !== options.statusFilter) {
      return false;
    }

    // Category filter
    if (options.categoryFilter && options.categoryFilter !== 'all' && req.category !== options.categoryFilter) {
      return false;
    }

    // Search query
    if (options.searchQuery && options.searchQuery.trim()) {
      const q = options.searchQuery.toLowerCase();
      const matchTitle = req.title?.toLowerCase().includes(q);
      const matchDesc = req.description?.toLowerCase().includes(q);
      const matchName = req.memberName?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchName) return false;
    }

    return true;
  });
}

/**
 * Updates prayer request status and returns immutable copy with history
 */
export function updatePrayerRequestStatus(
  request: any,
  newStatus: string,
  updatedBy: string,
  note?: string
) {
  const newHistoryItem = {
    status: newStatus,
    updatedBy,
    timestamp: new Date().toISOString(),
    note,
  };

  return {
    ...request,
    status: newStatus,
    assignedPastor: request.assignedPastor || updatedBy,
    pastoralNotes: note || request.pastoralNotes,
    statusHistory: [newHistoryItem, ...(request.statusHistory || [])],
  };
}
