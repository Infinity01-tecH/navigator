import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ykczxitiyuwbuslmdead.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrY3p4aXRpeXV3YnVzbG1kZWFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5ODc1OTYsImV4cCI6MjA5ODU2MzU5Nn0.LwGmS3Ko2Vri4DpFCyuB8uW-RWwtFK_UbX9L_sCgpRM';

// Figma Make preview runs the app inside an iframe where localStorage is often
// blocked by the browser's third-party cookie / storage policy. Fall back to
// sessionStorage (survives same-tab OAuth redirects) so the session persists
// through the Google OAuth round-trip even in sandboxed preview environments.
function safeStorage(): Storage {
  try {
    localStorage.setItem('_sb_chk', '1');
    localStorage.removeItem('_sb_chk');
    return localStorage;
  } catch {
    return sessionStorage;
  }
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: safeStorage(),
    detectSessionInUrl: true,
    persistSession: true,
    flowType: 'pkce',
  },
});
