import { URL_API } from "@/config";
import { tokenDecrypted } from "@/utils/decryptToken";
import axios from "axios";

export const GetAllCompanyAPI = async () => {
  try {
    const response = await axios.get(`${URL_API}/company/all`, {
      headers: {
        Authorization: `Bearer ${tokenDecrypted()}`,
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};
export const DeleteCompanyAPI = async (id) => {
  try {
    const response = await axios.delete(`${URL_API}/company/${id}`, {
      headers: {
        Authorization: `Bearer ${tokenDecrypted()}`,
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};
export const AddCompanyAPI = async (payload) => {
  try {
    const response = await axios.post(
      `${URL_API}/company/registrasi`,
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
export const EditCompanyAPI = async (id, payload) => {
  try {
    const response = await axios.put(`${URL_API}/company/${id}`, payload, {
      headers: {
        Authorization: `Bearer ${tokenDecrypted()}`,
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};

export const GetDahsboardAPI = async (query) => {
  try {
    const response = await axios.get(`${URL_API}/company/dashboard${query}`, {
      headers: {
        Authorization: `Bearer ${tokenDecrypted()}`,
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};
