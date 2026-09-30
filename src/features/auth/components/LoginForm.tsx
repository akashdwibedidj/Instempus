// LoginForm.tsx — email/password sign-in and sign-up form.
// Uses useAuth hook; no supabase import here.
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { loginSchema, type LoginInput } from '../schemas';

interface Props {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: Props) {
  const { t } = useTranslation();
  const { login, signUp, isLoggingIn, isSigningUp, loginError, signUpError } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  const isLoading = isLoggingIn || isSigningUp;
  const serverError = loginError ?? signUpError;

  const onSubmit = async (data: LoginInput) => {
    try {
      if (mode === 'signin') await login(data);
      else await signUp(data);
      onSuccess?.();
    } catch {
      // errors surfaced via loginError / signUpError
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div>
        <label htmlFor="lf-email" className="block text-sm font-medium mb-1 text-gray-200">
          {t('auth.email')}
        </label>
        <input
          id="lf-email"
          type="email"
          autoComplete="email"
          {...register('email')}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-gray-500 focus:border-violet-500 focus:outline-none"
          placeholder="you@instempus.edu"
        />
        {errors.email && (
          <p className="mt-1 text-xs text-red-400">{t(errors.email.message ?? '')}</p>
        )}
      </div>

      <div>
        <label htmlFor="lf-password" className="block text-sm font-medium mb-1 text-gray-200">
          {t('auth.password')}
        </label>
        <input
          id="lf-password"
          type="password"
          autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
          {...register('password')}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-gray-500 focus:border-violet-500 focus:outline-none"
          placeholder="••••••••"
        />
        {errors.password && (
          <p className="mt-1 text-xs text-red-400">{t(errors.password.message ?? '')}</p>
        )}
      </div>

      {serverError && (
        <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">{serverError}</p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        id="lf-submit"
        className="w-full rounded-lg bg-violet-600 py-2.5 font-semibold text-white hover:bg-violet-500 disabled:opacity-50 transition-colors"
      >
        {isLoading
          ? t('common.loading')
          : mode === 'signin'
            ? t('auth.signIn')
            : t('auth.createAccount')}
      </button>

      <button
        type="button"
        onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
        className="w-full text-center text-sm text-violet-400 hover:text-violet-300"
      >
        {mode === 'signin' ? t('auth.noAccount') : t('auth.haveAccount')}
      </button>
    </form>
  );
}
