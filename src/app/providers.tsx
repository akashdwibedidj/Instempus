// providers.tsx — composes all context providers + mounts the auth listener.
import '@/i18n';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from '@/lib/queryClient';
import { useAuthListener } from '@/features/auth/hooks/useAuthListener';
import type { ReactNode } from 'react';

function AuthListenerMount() {
  useAuthListener();
  return null;
}

interface Props {
  children: ReactNode;
}

export function Providers({ children }: Props) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthListenerMount />
      {children}
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}