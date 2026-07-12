import { supabase } from "../supabase";

export type MockUser = {
  id: string;
  name: string;
  email: string;
};

export const mockAuth = {
  async login(email: string, password: string): Promise<MockUser> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    return {
      id: data.user.id,
      name: data.user.user_metadata?.name || "",
      email: data.user.email!,
    };
  },

  async signup(
    name: string,
    email: string,
    password: string
  ): Promise<MockUser> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) throw error;
    console.log("User:", data.user);
console.log("Session:", data.session);

if (data.user) {
  const { error: profileError } = await supabase
    .from("profiles")
    .insert({
      id: data.user.id,
      full_name: name,
      email: email,
    });
  console.log("Profile error:", profileError);

  if (profileError) {
    console.error(profileError);
    throw profileError;
  }
}

return {
  id: data.user?.id || "",
  name,
  email,
};
  },

  async forgotPassword(email: string): Promise<void> {
  console.log("Sending reset email to:", email);

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: "http://localhost:8080/update-password",
  });

  console.log("Supabase response:", error);

  if (error) throw error;

  console.log("Reset email sent successfully");
},

  async verifyEmail(_code: string): Promise<void> {
    return;
  },

  async loginWithGoogle(): Promise<MockUser> {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });

    if (error) throw error;

    return {} as MockUser;
  },
};