import newRequest from "./newRequest";

export const getReadings = async (timePeriod: string) => {
  try {
    const { status, data } = await newRequest.get("/sensors/readings", {
      params: {
        period: timePeriod,
      },
    });
    if (status !== 200) {
      throw new Error("Failed to fetch readings");
    }
    return data;
  } catch (error: any) {
    console.error("Error fetching readings:", error.message);
    throw error;
  }
};

export const getAlerts = async () => {
  try {
    const { status, data } = await newRequest.get("/sensors/alerts");
    if (status !== 200) {
      throw new Error("Failed to fetch alerts");
    }
    return data;
  } catch (error: any) {
    console.error("Error fetching alerts:", error.message);
    throw error;
  }
};
