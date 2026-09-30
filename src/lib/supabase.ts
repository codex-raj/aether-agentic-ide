import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 
  import.meta.env.VITE_SUPABASE_URL || 'https://acwulyyudcbvgbhvegsh.supabase.co';
const SUPABASE_ANON_KEY = 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjd3VseXl1ZGNidmdiaHZlZ3NoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA2OTQ5NDAsImV4cCI6MjEwNjI3MDk0MH0.YK0p4WG7kyWrJTso8bIgapq08Jy_LI0bZd_siZ6aWes';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface WaitlistSubmission {
  email: string;
  fullName?: string;
  role?: string;
  preferredLanguage?: string;
}

/**
 * Inserts a new waitlist submission into Supabase table 'waitlist'.
 * Gracefully handles table schema variations (snake_case vs camelCase).
 */
export async function submitWaitlistToSupabase(entry: WaitlistSubmission) {
  try {
    const payload = {
      email: entry.email.trim().toLowerCase(),
      full_name: entry.fullName?.trim() || '',
      role: entry.role?.trim() || 'Software Engineer',
      preferred_language: entry.preferredLanguage?.trim() || 'Rust / TypeScript',
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('waitlist')
      .insert([payload])
      .select();

    if (error) {
      // If table uses camelCase column names instead of snake_case, attempt fallback
      if (error.code === 'PGRST204' || error.message?.includes('column')) {
        const camelPayload = {
          email: entry.email.trim().toLowerCase(),
          fullName: entry.fullName?.trim() || '',
          role: entry.role?.trim() || 'Software Engineer',
          preferredLanguage: entry.preferredLanguage?.trim() || 'Rust / TypeScript',
          createdAt: new Date().toISOString()
        };
        const fallback = await supabase
          .from('waitlist')
          .insert([camelPayload])
          .select();
        
        return { success: !fallback.error, data: fallback.data, error: fallback.error };
      }
      console.warn('Supabase waitlist insertion notice:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.warn('Supabase waitlist error:', err);
    return { success: false, error: err };
  }
}
