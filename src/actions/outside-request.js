import { URL_API } from "@/config";
import { tokenDecrypted } from "@/utils/decryptToken";
import axios from "axios";

export const AddOvertimeRequestAPI = async (query, payload) => {
  try {
    const response = await axios.post(
      `${URL_API}/outside-request${query}`,
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
export const GetOvertimeRequestAPI = async (query) => {
  try {
    const response = await axios.get(`${URL_API}/outside-request${query}`, {
      headers: {
        Authorization: `Bearer ${tokenDecrypted()}`,
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};
export const EditOvertimeRequestAPI = async (id, payload) => {
  try {
    const response = await axios.put(
      `${URL_API}/outside-request/${id}`,
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
