// StudentOnboardForm.tsx — roll-no + name + phone + language form for new students.
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useOnboarding } from '../hooks/useOnboarding';
import { studentOnboardSchema, type StudentOnboardInput } from '../schemas';
import { LanguagePicker } from './LanguagePicker';

export function StudentOnboardForm() {
  const { t } = useTranslation();
  const { submitStudent, isSubmittingStudent, studentError } = useOnboarding();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<StudentOnboardInput>({
    resolver: zodResolver(studentOnboardSchema),
    defaultValues: { language: 'en' },
  });

  const onSubmit = async (data: StudentOnboardInput) => {
    try { await submitStudent(data); } catch { /* error shown via studentError */ }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div>
        <label htmlFor="sof-roll" className="block text-sm font-medium mb-1 text-gray-200">
          {t('auth.rollNumber')}
        </label>
        <input
          id="sof-roll"
          {...register('rollNo')}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-gray-500 uppercase focus:border-violet-500 focus:outline-none"
          placeholder="e.g. 2501CSE001"
        />
        {errors.rollNo && (
          <p className="mt-1 text-xs text-red-400">{t(errors.rollNo.message ?? '')}</p>
        )}
      </div>

      <div>
        <label htmlFor="sof-name" className="block text-sm font-medium mb-1 text-gray-200">
          {t('auth.name')}
        </label>
        <input
          id="sof-name"
          {...register('name')}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-gray-500 focus:border-violet-500 focus:outline-none"
          placeholder="Full Name"
        />
        {errors.name && (
          <p className="mt-1 text-xs text-red-400">{t(errors.name.message ?? '')}</p>
        )}
      </div>

      <div>
        <label htmlFor="sof-phone" className="block text-sm font-medium mb-1 text-gray-200">
          {t('auth.phone')} <span className="text-gray-500">(optional)</span>
        </label>
        <input
          id="sof-phone"
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

      {studentError && (
        <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">{studentError}</p>
      )}

      <button
        type="submit"
        id="sof-submit"
        disabled={isSubmittingStudent}
        className="w-full rounded-lg bg-violet-600 py-2.5 font-semibold text-white hover:bg-violet-500 disabled:opacity-50 transition-colors"
      >
        {isSubmittingStudent ? t('common.loading') : t('auth.onboard')}
      </button>
    </form>
  );
}
