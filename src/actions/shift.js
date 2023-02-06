import { URL_API } from "@/config";
import { tokenDecrypted } from "@/utils/decryptToken";
import axios from "axios";

export const AddShiftAPI = async (query, payload) => {
  try {
    const response = await axios.post(`${URL_API}/shift${query}`, payload, {
      headers: {
        Authorization: `Bearer ${tokenDecrypted()}`,
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};

export const EditShiftAPI = async (id, payload) => {
  try {
    const response = await axios.put(`${URL_API}/shift/${id}`, payload, {
      headers: {
        Authorization: `Bearer ${tokenDecrypted()}`,
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};
export const GetShiftAPI = async (query) => {
  try {
    const response = await axios.get(`${URL_API}/shift${query}`, {
      headers: {
        Authorization: `Bearer ${tokenDecrypted()}`,
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};

export const ChangeStatusShiftAPI = async (id) => {
  try {
    const response = await axios.put(
      `${URL_API}/shift/status/${id}`,
      {},
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
