import { URL_API } from "@/config";
import { tokenDecrypted } from "@/utils/decryptToken";
import axios from "axios";

export const AddEmpStatusAPI = async (query, payload) => {
  try {
    const response = await axios.post(
      `${URL_API}/employment-status${query}`,
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
export const EditEmpStatusAPI = async (id, payload) => {
  try {
    const response = await axios.put(
      `${URL_API}/employment-status/${id}`,
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
export const GetEmpStatusAPI = async (query) => {
  try {
    const response = await axios.get(`${URL_API}/employment-status${query}`, {
      headers: {
        Authorization: `Bearer ${tokenDecrypted()}`,
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};
