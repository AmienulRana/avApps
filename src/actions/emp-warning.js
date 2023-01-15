import { URL_API } from "@/config";
import { tokenDecrypted } from "@/utils/decryptToken";
import axios from "axios";

export const AddEmpWarningAPI = async (query, payload) => {
  try {
    const response = await axios.post(
      `${URL_API}/employment-warning${query}`,
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
export const EditEmpWarningAPI = async (id, payload) => {
  try {
    const response = await axios.put(
      `${URL_API}/employment-warning/${id}`,
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
export const DeleteEmpWarningAPI = async (id) => {
  try {
    const response = await axios.delete(`${URL_API}/employment-warning/${id}`, {
      headers: {
        Authorization: `Bearer ${tokenDecrypted()}`,
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};
export const GetEmpWarningAPI = async (query) => {
  try {
    const response = await axios.get(`${URL_API}/employment-warning${query}`, {
      headers: {
        Authorization: `Bearer ${tokenDecrypted()}`,
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};
