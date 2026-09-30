// Status string constants — import from here, never hardcode status strings
export const APPLICATION_STATUS = {
  SUBMITTED:    'submitted',
  UNDER_REVIEW: 'under_review',
  APPROVED:     'approved',
  DECLINED:     'declined',
  ESCALATED:    'escalated',
  CANCELLED:    'cancelled',
} as const;

export type ApplicationStatus = typeof APPLICATION_STATUS[keyof typeof APPLICATION_STATUS];

export const ISSUE_STATUS = {
  OPEN:        'open',
  IN_PROGRESS: 'in_progress',
  RESOLVED:    'resolved',
  CLOSED:      'closed',
} as const;

export type IssueStatus = typeof ISSUE_STATUS[keyof typeof ISSUE_STATUS];

export const PAYMENT_STATUS = {
  PENDING:   'pending',
  CONFIRMED: 'confirmed',
  REJECTED:  'rejected',
} as const;

export type PaymentStatus = typeof PAYMENT_STATUS[keyof typeof PAYMENT_STATUS];

export const ENROLLMENT_STATUS = {
  ACTIVE:    'active',
  BACKLOG:   'backlog',
  GRADUATED: 'graduated',
  INACTIVE:  'inactive',
} as const;

export type EnrollmentStatus = typeof ENROLLMENT_STATUS[keyof typeof ENROLLMENT_STATUS];

export const MESSAGE_STATUS = {
  PENDING:   'pending',
  SENT:      'sent',
  DELIVERED: 'delivered',
  READ:      'read',
} as const;

export type MessageStatus = typeof MESSAGE_STATUS[keyof typeof MESSAGE_STATUS];
