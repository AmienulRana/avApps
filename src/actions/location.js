import { URL_API } from "@/config";
import { tokenDecrypted } from "@/utils/decryptToken";
import axios from "axios";

export const GetLocationAPI = async (query) => {
  try {
    const response = await axios.get(`${URL_API}/location${query}`, {
      headers: {
        Authorization: `Bearer ${tokenDecrypted()}`,
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};
export const DeleteLocationAPI = async (id) => {
  try {
    const response = await axios.delete(`${URL_API}/location/${id}`, {
      headers: {
        Authorization: `Bearer ${tokenDecrypted()}`,
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};
export const EditLocationAPI = async (id, payload) => {
  try {
    const response = await axios.put(`${URL_API}/location/${id}`, payload, {
      headers: {
        Authorization: `Bearer ${tokenDecrypted()}`,
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};
export const AddLocationAPI = async (payload, query) => {
  try {
    const response = await axios.post(`${URL_API}/location${query}`, payload, {
      headers: {
        Authorization: `Bearer ${tokenDecrypted()}`,
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};
