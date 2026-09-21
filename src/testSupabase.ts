import { supabase } from "./lib/supabase";

export async function testConnection() {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    console.error("Supabase Connection Error:", error);
  } else {
    console.log("✅ Supabase Connected Successfully");
    console.log(data);
  }
}
