// schemas.ts — zod schemas for all auth forms.
// Error messages are i18n KEYS; forms render them with t(message).
import { z } from 'zod';
import { STAFF_ROLES, type Role } from '@/constants/roles';

const email = z
    .string()
    .trim()
    .min(1, 'auth.validation.emailRequired')
    .email('auth.validation.emailInvalid');

const password = z.string().min(8, 'auth.validation.passwordMin');

const name = z.string().trim().min(2, 'auth.validation.nameRequired');

// Optional 10-digit Indian mobile number. Empty string is allowed.
const phone = z
    .string()
    .trim()
    .refine((v) => v === '' || /^[6-9]\d{9}$/.test(v), 'auth.validation.phoneInvalid')
    .optional();

const languagePref = z.enum(['en', 'hi', 'or']);

/** Login form. Also used for the student sign-up step (email + password). */
export const loginSchema = z.object({ email, password });

/** Student profile step (after sign-up, before the app opens). */
export const studentOnboardSchema = z.object({
    rollNo: z.string().trim().min(1, 'auth.validation.rollRequired'),
    name,
    phone,
    languagePref,
});

/** Staff profile step. Role must be a non-student role. */
export const staffOnboardSchema = z.object({
    name,
    role: z.custom<Role>(
        (v) => typeof v === 'string' && STAFF_ROLES.includes(v as Role),
        { message: 'auth.validation.roleInvalid' },
    ),
    deptId: z.string().optional(),
    phone,
    languagePref,
});

export type LoginInput = z.infer<typeof loginSchema>;
export type StudentOnboardInput = z.infer<typeof studentOnboardSchema>;
export type StaffOnboardInput = z.infer<typeof staffOnboardSchema>;