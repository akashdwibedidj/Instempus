// useOnboarding.ts — mutations for completing student / staff onboarding.
import { useMutation } from '@tanstack/react-query';
import { useSessionStore, toLanguage } from '@/app/sessionStore';
import { getErrorMessage } from '@/lib/errors';
import i18n from '@/i18n';
import type { Role } from '@/constants/roles';
import {
  completeStudentOnboarding,
  completeStaffOnboarding,
} from '../services/onboardingService';
import type { StudentOnboardInput, StaffOnboardInput } from '../services/onboardingService';

export function useOnboarding() {
  const userId = useSessionStore((s) => s.userId);
  const setAuthenticated = useSessionStore((s) => s.setAuthenticated);

  const studentMutation = useMutation({
    mutationFn: async (input: StudentOnboardInput) => {
      if (!userId) throw new Error('No active session');
      const profile = await completeStudentOnboarding(userId, input);
      return profile;
    },
    onSuccess: (profile) => {
      const language = toLanguage(profile.language_pref);
      setAuthenticated({
        userId: profile.id,
        role: profile.role as Role,
        name: profile.name,
        language,
      });
      void i18n.changeLanguage(language);
    },
  });

  const staffMutation = useMutation({
    mutationFn: async (input: StaffOnboardInput) => {
      if (!userId) throw new Error('No active session');
      const profile = await completeStaffOnboarding(userId, input);
      return profile;
    },
    onSuccess: (profile) => {
      const language = toLanguage(profile.language_pref);
      setAuthenticated({
        userId: profile.id,
        role: profile.role as Role,
        name: profile.name,
        language,
      });
      void i18n.changeLanguage(language);
    },
  });

  return {
    // student
    submitStudent:        studentMutation.mutateAsync,
    isSubmittingStudent:  studentMutation.isPending,
    studentError:         studentMutation.error
      ? getErrorMessage(studentMutation.error)
      : null,

    // staff
    submitStaff:          staffMutation.mutateAsync,
    isSubmittingStaff:    staffMutation.isPending,
    staffError:           staffMutation.error
      ? getErrorMessage(staffMutation.error)
      : null,
  };
}
