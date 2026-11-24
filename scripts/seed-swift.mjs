import { createClient } from "@supabase/supabase-js";
import { SEED_SWIFT_CODES } from "../src/lib/seed-data.js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function seedSwift() {
  for (const item of SEED_SWIFT_CODES) {
    const { id: _id, ...payload } = item;
    const { error } = await supabase
      .from("swift_codes")
      .upsert(payload, { onConflict: "slug" });

    if (error) {
      console.error(`Failed ${item.slug}:`, error.message);
    } else {
      console.log(`Synced SWIFT record: ${item.bank_name} (${item.swift_code})`);
    }
  }
}

seedSwift();
