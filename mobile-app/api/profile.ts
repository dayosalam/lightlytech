import newRequest from "./newRequest";
import { User } from "../interfaces";

export const saveCondoName = async (condo_name: string) => {
  try {
    const response = await newRequest.put("/condo-name", { condo_name });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUserDetails = async (userDetails: User) => {

  console.log(userDetails);
  try {
    const response = await newRequest.put("/user-details", {updateData: userDetails});


    return response.data;
  } catch (error) {
    throw error;
  }
};
