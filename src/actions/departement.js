import { URL_API } from "@/config";
import { tokenDecrypted } from "@/utils/decryptToken";
import axios from "axios";

export const AddDepartementAPI = async (payload, query) => {
  try {
    const response = await axios.post(
      `${URL_API}/departement${query}`,
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
export const GetDepartementAPI = async (query) => {
  try {
    const response = await axios.get(`${URL_API}/departement${query}`, {
      headers: {
        Authorization: `Bearer ${tokenDecrypted()}`,
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};
export const DetailDepartementAPI = async (id) => {
  try {
    const response = await axios.get(`${URL_API}/departement/${id}`);
    return response;
  } catch (error) {
    return error.response;
  }
};
export const EditDepartementAPI = async (id, payload) => {
  try {
    const response = await axios.put(`${URL_API}/departement/${id}`, payload, {
      headers: {
        Authorization: `Bearer ${tokenDecrypted()}`,
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};
