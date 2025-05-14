const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("❌ Missing Supabase URL or Key");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const supabaseServiceRole = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

module.exports = { supabase, supabaseServiceRole };
