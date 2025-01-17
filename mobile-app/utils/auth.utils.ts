import { supabase } from "../lib/supabase";

export const signIn = async (email: string, password: string) => {
    if(!email || !password) throw new Error("Email and password are required");
  try {
    const { data: user, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
    return user;
  } catch (error) {
    console.error("Error signing in:", error.message);
    throw error;
  }
};


export const register = (email: string, password: string) {
    if (!email || !password) throw new Error("Email and password are required");
    try {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw new Error(error.message);
        return true;
    } catch (error) {
        console.error("Error registering:", error.message);
        throw error;
    }
};

export const createDbUser = async (email: string, name: string) => {
    try {
        const { data, error } = await supabase.from("users").insert([{ email, name }]);
        if (error) throw new Error(error.message);
        return data;
    } catch (error) {
        console.error("Error creating user:", error.message);
        throw error;
    }
};

export const logout = async () => {
    try {
        const { error } = await supabase.auth.signOut();

        if (error) throw new Error(error.message);

        return true;
    } catch (error) {
        console.error("Error logging out:", error.message);
        throw error;
    }
}