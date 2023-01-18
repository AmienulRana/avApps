import { URL_API } from "@/config";
import { tokenDecrypted } from "@/utils/decryptToken";
import axios from "axios";

export const AddLeaveSettingAPI = async (query, payload) => {
  try {
    const response = await axios.post(`${URL_API}/leaves${query}`, payload, {
      headers: {
        Authorization: `Bearer ${tokenDecrypted()}`,
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};
export const GetLeaveSettingAPI = async (query) => {
  try {
    const response = await axios.get(`${URL_API}/leaves${query}`, {
      headers: {
        Authorization: `Bearer ${tokenDecrypted()}`,
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};
export const EditLeaveSettingAPI = async (id, data) => {
  try {
    const response = await axios.put(`${URL_API}/leaves/${id}`, data, {
      headers: {
        Authorization: `Bearer ${tokenDecrypted()}`,
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};
export const DeleteLeaveSettingAPI = async (id) => {
  try {
    const response = await axios.delete(`${URL_API}/leaves/${id}`, {
      headers: {
        Authorization: `Bearer ${tokenDecrypted()}`,
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};
