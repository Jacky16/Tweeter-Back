import environment from "../loadEnvironments";
import { createClient } from "@supabase/supabase-js";

export const supabaseClient = createClient(
  environment.supabaseUrl,
  environment.supabaseKey
);

export const bucket = supabaseClient.storage.from(environment.supabaseBucket);
