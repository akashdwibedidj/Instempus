// StudentOnboardForm.tsx — profile step for a signed-in student with no profile yet.
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useSessionStore } from '@/app/sessionStore';
import { useOnboarding } from '../hooks/useOnboarding';
import { studentOnboardSchema, type StudentOnboardInput } from '../schemas';
import { LanguagePicker } from './LanguagePicker';
import {
  inputClass,
  labelClass,
  errorClass,
  formErrorClass,
  primaryButtonClass,
} from './formStyles';

export function StudentOnboardForm() {
  const { t, i18n } = useTranslation();
  const language = useSessionStore((s) => s.language);
  const { completeStudent, isCompletingStudent, studentError } = useOnboarding();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<StudentOnboardInput>({
    resolver: zodResolver(studentOnboardSchema),
    defaultValues: { rollNo: '', name: '', phone: '', languagePref: language },
  });

  const onSubmit = async (values: StudentOnboardInput): Promise<void> => {
    try {
      await completeStudent(values);
    } catch {
      // error text is exposed by the hook (studentError)
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div>
        <label htmlFor="rollNo" className={labelClass}>{t('auth.rollNumber')}</label>
        <input
          id="rollNo"
          autoCapitalize="characters"
          className={inputClass}
          {...register('rollNo')}
        />
        {errors.rollNo?.message && (
          <p className={errorClass}>{t(errors.rollNo.message)}</p>
        )}
      </div>

      <div>
        <label htmlFor="name" className={labelClass}>{t('auth.name')}</label>
        <input id="name" autoComplete="name" className={inputClass} {...register('name')} />
        {errors.name?.message && (
          <p className={errorClass}>{t(errors.name.message)}</p>
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
                void i18n.changeLanguage(lang); // preview immediately
              }}
            />
          )}
        />
      </div>

      {studentError && <p className={formErrorClass} role="alert">{studentError}</p>}

      <button type="submit" disabled={isCompletingStudent} className={primaryButtonClass}>
        {isCompletingStudent ? t('common.loading') : t('auth.onboard')}
      </button>
    </form>
  );
}