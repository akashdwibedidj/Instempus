// Shared types not tied to any single feature
import type { Role } from '@/constants/roles';

/** Logged-in session data held in Zustand */
export interface SessionUser {
  id: string;
  role: Role;
  name: string;
  avatarUrl: string | null;
  languagePref: 'en' | 'hi' | 'or';
}

/** Generic paginated response wrapper */
export interface PaginatedResult<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
}

/** Select option used in form dropdowns */
export interface SelectOption {
  value: string;
  label: string;
}
