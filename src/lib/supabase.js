import { createClient } from "@supabase/supabase-js";

// Public identifiers — safe to ship in the client bundle.
// Real access control lives in the Postgres row-level security policies, not in these values.
const SUPABASE_URL = "https://xniojtglpyxfnxmeokvu.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhuaW9qdGdscHl4Zm54bWVva3Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU4OTkxMjksImV4cCI6MjEwMTQ3NTEyOX0.C4GoH_C2GXhYwxtBI6Rb61ENrQ1WCelDFuKOOILuyos";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
