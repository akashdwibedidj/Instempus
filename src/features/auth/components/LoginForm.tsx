// LoginForm.tsx — email + password. mode="signup" is the student sign-up step.
// After success the auth listener updates the session store; the page redirects.
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { useOnboarding } from '../hooks/useOnboarding';
import { loginSchema, type LoginInput } from '../schemas';
import {
  inputClass,
  labelClass,
  errorClass,
  formErrorClass,
  primaryButtonClass,
} from './formStyles';

interface LoginFormProps {
  mode?: 'login' | 'signup';
}

export function LoginForm({ mode = 'login' }: LoginFormProps) {
  const { t } = useTranslation();
  const { login, isLoggingIn, loginError } = useAuth();
  const { signUpStudent, isSigningUp, signUpError } = useOnboarding();

  const isSignUp = mode === 'signup';
  const busy = isSignUp ? isSigningUp : isLoggingIn;
  const formError = isSignUp ? signUpError : loginError;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginInput): Promise<void> => {
    try {
      if (isSignUp) await signUpStudent(values);
      else await login(values);
    } catch {
      // error text is exposed by the hooks (loginError / signUpError)
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div>
        <label htmlFor="email" className={labelClass}>{t('auth.email')}</label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          className={inputClass}
          {...register('email')}
        />
        {errors.email?.message && (
          <p className={errorClass}>{t(errors.email.message)}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className={labelClass}>{t('auth.password')}</label>
        <input
          id="password"
          type="password"
          autoComplete={isSignUp ? 'new-password' : 'current-password'}
          className={inputClass}
          {...register('password')}
        />
        {errors.password?.message && (
          <p className={errorClass}>{t(errors.password.message)}</p>
        )}
      </div>

      {formError && <p className={formErrorClass} role="alert">{formError}</p>}

      <button type="submit" disabled={busy} className={primaryButtonClass}>
        {busy ? t('common.loading') : isSignUp ? t('auth.createAccount') : t('auth.signIn')}
      </button>
    </form>
  );
}