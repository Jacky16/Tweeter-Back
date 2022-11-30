import environment from "../loadEnvironments.js";
import { createClient } from "@supabase/supabase-js";

const supabaseClient = createClient(
  environment.supabaseUrl,
  environment.supabaseKey
);

export const bucket = supabaseClient.storage.from(environment.supabaseBucket);
