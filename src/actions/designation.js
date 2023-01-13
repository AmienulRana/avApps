import { URL_API } from "@/config";
import { tokenDecrypted } from "@/utils/decryptToken";
import axios from "axios";

export const AddDesignationAPI = async (payload, query) => {
  try {
    const response = await axios.post(
      `${URL_API}/designation${query}`,
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
export const EditDesignationAPI = async (payload, id) => {
  try {
    const response = await axios.put(`${URL_API}/designation/${id}`, payload, {
      headers: {
        Authorization: `Bearer ${tokenDecrypted()}`,
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};
export const GetDesignationAPI = async (query) => {
  try {
    const response = await axios.get(`${URL_API}/designation${query}`, {
      headers: {
        Authorization: `Bearer ${tokenDecrypted()}`,
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};
