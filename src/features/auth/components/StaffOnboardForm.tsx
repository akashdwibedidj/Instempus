// StaffOnboardForm.tsx — name + phone + language for staff first-time login.
// Staff profile already exists (admin created it); this fills in personal details.
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useOnboarding } from '../hooks/useOnboarding';
import { staffOnboardSchema, type StaffOnboardInput } from '../schemas';
import { LanguagePicker } from './LanguagePicker';

export function StaffOnboardForm() {
  const { t } = useTranslation();
  const { submitStaff, isSubmittingStaff, staffError } = useOnboarding();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<StaffOnboardInput>({
    resolver: zodResolver(staffOnboardSchema),
    defaultValues: { language: 'en' },
  });

  const onSubmit = async (data: StaffOnboardInput) => {
    try { await submitStaff(data); } catch { /* error shown via staffError */ }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div>
        <label htmlFor="stof-name" className="block text-sm font-medium mb-1 text-gray-200">
          {t('auth.name')}
        </label>
        <input
          id="stof-name"
          {...register('name')}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-gray-500 focus:border-violet-500 focus:outline-none"
          placeholder="Full Name"
        />
        {errors.name && (
          <p className="mt-1 text-xs text-red-400">{t(errors.name.message ?? '')}</p>
        )}
      </div>

      <div>
        <label htmlFor="stof-phone" className="block text-sm font-medium mb-1 text-gray-200">
          {t('auth.phone')} <span className="text-gray-500">(optional)</span>
        </label>
        <input
          id="stof-phone"
          type="tel"
          {...register('phone')}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-gray-500 focus:border-violet-500 focus:outline-none"
          placeholder="10-digit mobile"
        />
        {errors.phone && (
          <p className="mt-1 text-xs text-red-400">{t(errors.phone.message ?? '')}</p>
        )}
      </div>

      <Controller
        name="language"
        control={control}
        render={({ field }) => (
          <LanguagePicker value={field.value} onChange={field.onChange} />
        )}
      />

      {staffError && (
        <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">{staffError}</p>
      )}

      <button
        type="submit"
        id="stof-submit"
        disabled={isSubmittingStaff}
        className="w-full rounded-lg bg-violet-600 py-2.5 font-semibold text-white hover:bg-violet-500 disabled:opacity-50 transition-colors"
      >
        {isSubmittingStaff ? t('common.loading') : t('auth.onboard')}
      </button>
    </form>
  );
}
