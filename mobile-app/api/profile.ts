import newRequest from "./newRequest";

export const saveCondoName = async (condo_name: string) => {
  try {
    const response = await newRequest.put("/condo-name", { condo_name });
    return response.data;
  } catch (error) {
    throw error;
  }
};
