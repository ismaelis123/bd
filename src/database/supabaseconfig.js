import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://rgpjhseivhxzictjqgch.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJncGpoc2Vpdmh4emljdGpxZ2NoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyNTQxMDgsImV4cCI6MjA4ODgzMDEwOH0.7W5NN-ZVDbTN5cnuAEwt-q8sqxOgJStAoo39Vix1aA0";

export const supabase = createClient(supabaseUrl, supabaseKey);