// useAuth.ts — login / logout / signUp mutations + session state selectors.
// Components import this hook; they never call authService directly.
import { useMutation } from '@tanstack/react-query';
import { useSessionStore } from '@/app/sessionStore';
import { getErrorMessage } from '@/lib/errors';
import {
  login as loginService,
  logout as logoutService,
  signUp as signUpService,
} from '../services/authService';
import type { LoginInput } from '../schemas';

export function useAuth() {
  const status   = useSessionStore((s) => s.status);
  const userId   = useSessionStore((s) => s.userId);
  const role     = useSessionStore((s) => s.role);
  const name     = useSessionStore((s) => s.name);
  const language = useSessionStore((s) => s.language);

  const loginMutation = useMutation({
    mutationFn: (values: LoginInput) => loginService(values),
    // sessionStore is updated by useAuthListener via onAuthStateChange.
  });

  const signUpMutation = useMutation({
    mutationFn: (values: LoginInput) => signUpService(values),
  });

  const logoutMutation = useMutation({
    mutationFn: () => logoutService(),
  });

  return {
    // state
    status,
    userId,
    role,
    name,
    language,
    isAuthenticated:    status === 'authenticated',
    isLoading:          status === 'loading',
    needsOnboarding:    status === 'needs_onboarding',

    // login
    login:        loginMutation.mutateAsync,
    isLoggingIn:  loginMutation.isPending,
    loginError:   loginMutation.error ? getErrorMessage(loginMutation.error) : null,

    // signup
    signUp:         signUpMutation.mutateAsync,
    isSigningUp:    signUpMutation.isPending,
    signUpError:    signUpMutation.error ? getErrorMessage(signUpMutation.error) : null,

    // logout
    logout:         logoutMutation.mutateAsync,
    isLoggingOut:   logoutMutation.isPending,
  };
}
