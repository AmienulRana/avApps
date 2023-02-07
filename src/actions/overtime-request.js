import { URL_API } from "@/config";
import { tokenDecrypted } from "@/utils/decryptToken";
import axios from "axios";

export const AddOvertimeRequestAPI = async (query, payload) => {
  try {
    const response = await axios.post(
      `${URL_API}/overtime-request${query}`,
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
    const response = await axios.get(`${URL_API}/overtime-request${query}`, {
      headers: {
        Authorization: `Bearer ${tokenDecrypted()}`,
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};
export const DeleteOvertimeRequestAPI = async (id) => {
  try {
    const response = await axios.delete(`${URL_API}/overtime-request/${id}`, {
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
      `${URL_API}/overtime-request/${id}`,
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
