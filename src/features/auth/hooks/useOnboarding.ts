// useOnboarding.ts — sign-up + profile creation for students and staff.
// Flow: signUpStudent() → (listener sets status 'needs_onboarding')
//       → completeStudent() / completeStaff() → store becomes 'authenticated'.
import { useMutation } from '@tanstack/react-query';
import i18n from '@/i18n';
import type { Role } from '@/constants/roles';
import { useSessionStore, toLanguage } from '@/app/sessionStore';
import { AppError, getErrorMessage } from '@/lib/errors';
import { signUp } from '../services/authService';
import {
    onboardStudent,
    onboardStaff,
    type getProfile,
} from '../services/onboardingService';
import type {
    LoginInput,
    StudentOnboardInput,
    StaffOnboardInput,
} from '../schemas';

type Profile = NonNullable<Awaited<ReturnType<typeof getProfile>>>;

function requireUserId(): string {
    const userId = useSessionStore.getState().userId;
    if (!userId) throw new AppError('UNAUTHORIZED', 'Please sign in first.');
    return userId;
}

// onboarding doesn't trigger an auth event, so we update the store ourselves
function applyProfile(profile: Profile): void {
    const language = toLanguage(profile.language_pref);
    useSessionStore.getState().setAuthenticated({
        userId: profile.id,
        role: profile.role as Role,
        name: profile.name,
        language,
    });
    void i18n.changeLanguage(language);
}

export function useOnboarding() {
    const signUpMutation = useMutation({
        mutationFn: (values: LoginInput) => signUp(values),
    });

    const studentMutation = useMutation({
        mutationFn: (values: StudentOnboardInput) =>
            onboardStudent({
                userId: requireUserId(),
                rollNo: values.rollNo,
                name: values.name,
                ...(values.phone ? { phone: values.phone } : {}),
                languagePref: values.languagePref,
            }),
        onSuccess: applyProfile,
    });

    const staffMutation = useMutation({
        mutationFn: (values: StaffOnboardInput) =>
            onboardStaff({
                userId: requireUserId(),
                name: values.name,
                role: values.role,
                ...(values.deptId ? { deptId: values.deptId } : {}),
                ...(values.phone ? { phone: values.phone } : {}),
                languagePref: values.languagePref,
            }),
        onSuccess: applyProfile,
    });

    return {
        signUpStudent: signUpMutation.mutateAsync,
        isSigningUp: signUpMutation.isPending,
        signUpError: signUpMutation.error ? getErrorMessage(signUpMutation.error) : null,

        completeStudent: studentMutation.mutateAsync,
        isCompletingStudent: studentMutation.isPending,
        studentError: studentMutation.error ? getErrorMessage(studentMutation.error) : null,

        completeStaff: staffMutation.mutateAsync,
        isCompletingStaff: staffMutation.isPending,
        staffError: staffMutation.error ? getErrorMessage(staffMutation.error) : null,
    };
}