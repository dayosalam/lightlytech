import newRequest from "./newRequest";

export const getReadings = async () => {
  try {
    const { status, data } = await newRequest.get("/sensors/readings");
    if (status !== 200) {
      throw new Error("Failed to fetch readings");
    }
    return data;
  } catch (error: any) {
    console.error("Error fetching readings:", error.message);
    throw error;
  }
};