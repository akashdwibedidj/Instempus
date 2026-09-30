// Typed access to environment variables — never import raw import.meta.env elsewhere
const env = {
  supabaseUrl: import.meta.env['VITE_SUPABASE_URL'] as string,
  supabaseAnonKey: import.meta.env['VITE_SUPABASE_ANON_KEY'] as string,
  appName: (import.meta.env['VITE_APP_NAME'] as string | undefined) ?? 'Instempus',
  appEnv: (import.meta.env['VITE_APP_ENV'] as string | undefined) ?? 'development',
} as const;

if (!env.supabaseUrl || !env.supabaseAnonKey) {
  throw new Error(
    '[env] VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set. Copy .env.example to .env.local.'
  );
}

export { env };
