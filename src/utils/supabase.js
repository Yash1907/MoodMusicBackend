import { createClient } from "@supabase/supabase-js";

// SUPABASE_URL=process.env.SUPABASE_URL
// SUPABASE_SERVICE_KEY=process.env.SUPABASE_SERVICE_KEY
// SUPABASE_JWT_SECRET=process.env.SUPABASE_JWT_SECRET
const SUPABASE_URL="https://irhaodqloxfcxhfwwula.supabase.co/"
const SUPABASE_SERVICE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlyaGFvZHFsb3hmY3hoZnd3dWxhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyOTU0MDA2NCwiZXhwIjoyMDQ1MTE2MDY0fQ.DNQDLZ768r7bZExL9m0PKt6O7k9O0x1f_49moENBuoM"
const SUPABASE_JWT_SECRET="CKdyIaB+Q7D8yBcutYPKhHsB5J4tA0ugBEArdebkNN27pOKNWZir7XGuLarCoyJ+KrILtyTQUPzC4cd7DRO8YA=="

/**
 * @type {import('@supabase/supabase-js').SupabaseClient}
 */
export let supabase = null;

export function initSupabase() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    console.error(
      "Supabase initialization error: Missing SUPABASE_URL or SUPABASE_SERVICE_KEY environment variables."
    );
    process.exit(1);
  }

  try {
    if (!supabase) {
      supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_KEY
      );
      console.log("Supabase client initialized successfully.");
    }
  } catch (error) {
    console.error("Error initializing Supabase client:", error.message);
    process.exit(1);
  }
}
