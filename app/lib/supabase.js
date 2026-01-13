import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://zfrgvmfuxhhxihbpdlal.supabase.co";
const supabaseKey = "sb_publishable_Bd3qsA434WnVsG_4bhtZKQ_eHFV7Eqf";

export const supabase = createClient(supabaseUrl, supabaseKey);
