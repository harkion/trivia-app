// import { createClient } from "@supabase/supabase-js";

// const supabaseUrl = "https://zfrgvmfuxhhxihbpdlal.supabase.co";
// const supabaseKey = "sb_publishable_Bd3qsA434WnVsG_4bhtZKQ_eHFV7Eqf";

// export const supabase = createClient(supabaseUrl, supabaseKey);  // Supabase client initialization - backup version


import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!; 

export const supabase = createClient(supabaseUrl, supabaseKey);
