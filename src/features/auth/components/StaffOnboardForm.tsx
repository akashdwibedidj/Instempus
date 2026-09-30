// StaffOnboardForm.tsx — profile step for staff accounts (created via admin invite).
// The role picker is temporary: in Phase 8 the role will come from the invite.
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { STAFF_ROLES } from '@/constants/roles';
import { useSessionStore } from '@/app/sessionStore';
import { useOnboarding } from '../hooks/useOnboarding';
import { staffOnboardSchema, type StaffOnboardInput } from '../schemas';
import { LanguagePicker } from './LanguagePicker';
import {
  inputClass,
  labelClass,
  errorClass,
  formErrorClass,
  primaryButtonClass,
} from './formStyles';

export function StaffOnboardForm() {
  const { t, i18n } = useTranslation();
  const language = useSessionStore((s) => s.language);
  const { completeStaff, isCompletingStaff, staffError } = useOnboarding();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<StaffOnboardInput>({
    resolver: zodResolver(staffOnboardSchema),
    defaultValues: { name: '', role: 'teacher', phone: '', languagePref: language },
  });

  const onSubmit = async (values: StaffOnboardInput): Promise<void> => {
    try {
      await completeStaff(values);
    } catch {
      // error text is exposed by the hook (staffError)
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div>
        <label htmlFor="name" className={labelClass}>{t('auth.name')}</label>
        <input id="name" autoComplete="name" className={inputClass} {...register('name')} />
        {errors.name?.message && (
          <p className={errorClass}>{t(errors.name.message)}</p>
        )}
      </div>

      <div>
        <label htmlFor="role" className={labelClass}>{t('auth.role')}</label>
        <select id="role" className={inputClass} {...register('role')}>
          {STAFF_ROLES.map((role) => (
            <option key={role} value={role} className="text-black">
              {t(`roles.${role}`)}
            </option>
          ))}
        </select>
        {errors.role?.message && (
          <p className={errorClass}>{t(errors.role.message)}</p>
        )}
      </div>

      <div>
        <label htmlFor="phone" className={labelClass}>{t('auth.phone')}</label>
        <input
          id="phone"
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          className={inputClass}
          {...register('phone')}
        />
        {errors.phone?.message && (
          <p className={errorClass}>{t(errors.phone.message)}</p>
        )}
      </div>

      <div>
        <span className={labelClass}>{t('auth.language')}</span>
        <Controller
          name="languagePref"
          control={control}
          render={({ field }) => (
            <LanguagePicker
              value={field.value}
              onChange={(lang) => {
                field.onChange(lang);
                void i18n.changeLanguage(lang);
              }}
            />
          )}
        />
      </div>

      {staffError && <p className={formErrorClass} role="alert">{staffError}</p>}

      <button type="submit" disabled={isCompletingStaff} className={primaryButtonClass}>
        {isCompletingStaff ? t('common.loading') : t('auth.onboard')}
      </button>
    </form>
  );
}