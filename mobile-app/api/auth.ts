import newRequest from "./newRequest";

export const signIn = async (email: string, password: string) => {
  try {
    const response = await newRequest.post("/auth/signin", {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Error signing in:", error);
    throw error;
  }
};

export const logOut = async () => {
  try {
    const response = await newRequest.post("/auth/logout");
    return response.data;
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};
