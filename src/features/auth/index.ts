// features/auth/index.ts — public API of the auth feature.
// Other code imports from '@/features/auth', never from deep paths.
export { useAuth } from './hooks/useAuth';
export { useAuthListener } from './hooks/useAuthListener';
export { useOnboarding } from './hooks/useOnboarding';
export { LoginForm } from './components/LoginForm';
export { StudentOnboardForm } from './components/StudentOnboardForm';
export { StaffOnboardForm } from './components/StaffOnboardForm';
export { LanguagePicker } from './components/LanguagePicker';