import { URL_API } from "@/config";
import { tokenDecrypted } from "@/utils/decryptToken";
import axios from "axios";

export const AddLeaveHolidayAPI = async (query, payload) => {
  try {
    const response = await axios.post(
      `${URL_API}/leave-holiday${query}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${tokenDecrypted()}`,
        },
      }
    );
    return response;
  } catch (error) {
    return error.response;
  }
};
export const GetLeaveHolidayAPI = async (query) => {
  try {
    const response = await axios.get(`${URL_API}/leave-holiday${query}`, {
      headers: {
        Authorization: `Bearer ${tokenDecrypted()}`,
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};
