// Date utility helpers — always import from here, never inline date-fns
import { formatDistanceToNow, format, isAfter, addHours } from 'date-fns';

/** Format a date as a relative string e.g. "2 hours ago" */
export function timeAgo(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

/** Format a date for display e.g. "29 Sep 2026, 09:30" */
export function displayDate(date: string | Date): string {
  return format(new Date(date), 'dd MMM yyyy, HH:mm');
}

/** Format short date e.g. "29 Sep" */
export function shortDate(date: string | Date): string {
  return format(new Date(date), 'dd MMM');
}

/** Check if a date has passed */
export function isExpired(date: string | Date): boolean {
  return !isAfter(new Date(date), new Date());
}

/** Add hours to now — used for gate pass / escalation expiry */
export function expiresAt(hoursFromNow: number): Date {
  return addHours(new Date(), hoursFromNow);
}

/** ISO string of now */
export function nowISO(): string {
  return new Date().toISOString();
}
