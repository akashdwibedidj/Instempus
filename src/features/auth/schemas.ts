// schemas.ts — Zod validation schemas for all auth + onboarding forms.
import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'auth.validation.emailRequired')
    .email('auth.validation.emailInvalid'),
  password: z
    .string()
    .min(6, 'auth.validation.passwordMin'),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const studentOnboardSchema = z.object({
  rollNo: z
    .string()
    .min(1, 'auth.validation.rollRequired')
    .transform((v) => v.trim().toUpperCase()),
  name: z
    .string()
    .min(2, 'auth.validation.nameRequired')
    .transform((v) => v.trim()),
  phone: z
    .string()
    .regex(/^\d{10}$/, 'auth.validation.phoneInvalid')
    .optional()
    .or(z.literal('')),
  language: z.enum(['en', 'hi', 'or']).default('en'),
});
export type StudentOnboardInput = z.infer<typeof studentOnboardSchema>;

export const staffOnboardSchema = z.object({
  name: z
    .string()
    .min(2, 'auth.validation.nameRequired')
    .transform((v) => v.trim()),
  phone: z
    .string()
    .regex(/^\d{10}$/, 'auth.validation.phoneInvalid')
    .optional()
    .or(z.literal('')),
  language: z.enum(['en', 'hi', 'or']).default('en'),
});
export type StaffOnboardInput = z.infer<typeof staffOnboardSchema>;
