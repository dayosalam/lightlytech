import { Storage } from "@/utils/storage";
import newRequest from "./newRequest";

export const signUp = async (email: string, password: string, name: string) => {
  try {

    const { data } = await newRequest.post("/auth/signup", {
      email,
      password,
      name,
    });

    console.log(" User signed up successfully");
    return data;
  } catch (error) {
    console.error(" Error signing up:", error);
    throw error;
  }
}

export const signIn = async (email: string, password: string) => {
  try {
    console.log(" Attempting to sign in with email:", email);
    console.log(" API endpoint: /auth/signin");

    const { status, data } = await newRequest.post("/auth/signin", {
      email,
      password,
    });

    if (status !== 200) {
      throw new Error("Login failed");
    }

    return data;
  } catch (error: any) {
    console.error(" Error signing in:", error.message);

    throw error;
  }
};

export const logOut = async () => {
  try {
    const { data } = await newRequest.post("/auth/logout");
    return data;  
  } catch (error) {
    console.error(" Error logging out:", error);
    throw error;
  }
};

export const changePassword = async (password: string) => {
  try {
    console.log(" Attempting to change password");
    // newRequest will automatically attach the token from storage
    const { data } = await newRequest.post("/auth/change-password", {
      password,
    });
    console.log(" Password changed successfully");
    return data;
  } catch (error) {
    console.error(" Error changing password:", error);
    throw error;
  }
};

export const changeEmail = async (email: string) => {
  try {
    console.log(" Attempting to change email");
    // newRequest will automatically attach the token from storage
    const { data } = await newRequest.post("/auth/change-email", {
      email,
    });
    console.log(" Email changed successfully");
    return data;
  } catch (error) {
    console.error(" Error changing email:", error);
    throw error;
  }
};
