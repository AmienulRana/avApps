import { URL_API } from "@/config";
import { tokenDecrypted } from "@/utils/decryptToken";
import axios from "axios";

export const AddLeaveRequestAPI = async (query, payload) => {
  try {
    const response = await axios.post(
      `${URL_API}/leave-request${query}`,
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
export const GetLeaveRequestAPI = async (query) => {
  try {
    const response = await axios.get(`${URL_API}/leave-request${query}`, {
      headers: {
        Authorization: `Bearer ${tokenDecrypted()}`,
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};
