import { URL_API } from "@/config";
import { tokenDecrypted } from "@/utils/decryptToken";
import axios from "axios";

export const AddPeriodicAPI = async (payload, query) => {
  try {
    const response = await axios.post(`${URL_API}/periodic${query}`, payload, {
      headers: {
        Authorization: `Bearer ${tokenDecrypted()}`,
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};
export const GetPeriodicAPI = async (query) => {
  try {
    const response = await axios.get(`${URL_API}/periodic${query}`, {
      headers: {
        Authorization: `Bearer ${tokenDecrypted()}`,
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};
export const GetPeriodicActiveAPI = async (query) => {
  try {
    const response = await axios.get(`${URL_API}/periodic/status${query}`, {
      headers: {
        Authorization: `Bearer ${tokenDecrypted()}`,
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};
export const ChangeStatusPeriodicAPI = async (id, query) => {
  try {
    const response = await axios.put(
      `${URL_API}/periodic/status/${id}${query}`,
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
export const EditPeriodicAPI = async (id, payload) => {
  try {
    const response = await axios.put(`${URL_API}/periodic/${id}`, payload, {
      headers: {
        Authorization: `Bearer ${tokenDecrypted()}`,
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};
export const DeletePeriodicAPI = async (id) => {
  try {
    const response = await axios.delete(`${URL_API}/periodic/${id}`, {
      headers: {
        Authorization: `Bearer ${tokenDecrypted()}`,
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};
