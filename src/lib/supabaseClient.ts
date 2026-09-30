// Supabase client singleton — only this file imports from @supabase/supabase-js
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import { env } from '@/config/env';

export const supabase = createClient<Database>(env.supabaseUrl, env.supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});
