// Role string constants — import from here, never retype the string
export const ROLES = {
  STUDENT:  'student',
  TEACHER:  'teacher',
  HOD:      'hod',
  WARDEN:   'warden',
  CANTEEN:  'canteen',
  ACCOUNTS: 'accounts',
  SECURITY: 'security',
  ADMIN:    'admin',
  PRINCIPAL:'principal',
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

export const ALL_ROLES = Object.values(ROLES) as Role[];

export const STAFF_ROLES: Role[] = [
  ROLES.TEACHER, ROLES.HOD, ROLES.WARDEN, ROLES.CANTEEN,
  ROLES.ACCOUNTS, ROLES.SECURITY, ROLES.ADMIN, ROLES.PRINCIPAL,
];
