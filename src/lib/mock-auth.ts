// Mock authentication service. Placeholder for future Supabase integration.
export type MockUser = { id: string; name: string; email: string };

const delay = (ms = 700) => new Promise((r) => setTimeout(r, ms));

export const mockAuth = {
  async login(email: string, _password: string): Promise<MockUser> {
    await delay();
    return { id: "user_1", name: email.split("@")[0], email };
  },
  async signup(name: string, email: string, _password: string): Promise<MockUser> {
    await delay();
    return { id: "user_1", name, email };
  },
  async forgotPassword(_email: string): Promise<void> {
    await delay();
  },
  async verifyEmail(_code: string): Promise<void> {
    await delay();
  },
  async loginWithGoogle(): Promise<MockUser> {
    await delay();
    return { id: "user_g", name: "Google User", email: "user@google.com" };
  },
};
