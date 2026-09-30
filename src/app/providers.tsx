// providers.tsx — composes all context providers in one place
// Order: i18n init (side-effect) → QueryClient → auth listener
import '@/i18n'; // initialise i18next before anything renders
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from '@/lib/queryClient';
import { useAuthListener } from '@/features/auth/hooks/useAuthListener';
import type { ReactNode } from 'react';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  useAuthListener(); // keeps sessionStore in sync with Supabase auth

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}