import { URL_API } from "@/config";
import { tokenDecrypted } from "@/utils/decryptToken";
import axios from "axios";

export const AddBankAPI = async (payload) => {
  try {
    const response = await axios.post(`${URL_API}/bank`, payload, {
      headers: {
        Authorization: `Bearer ${tokenDecrypted()}`,
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};
export const GetBankAPI = async (id) => {
  try {
    const response = await axios.get(`${URL_API}/bank?emp_id=${id}`, {
      headers: {
        Authorization: `Bearer ${tokenDecrypted()}`,
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};

export const EditBankAPI = async (id, payload) => {
  try {
    const response = await axios.put(`${URL_API}/bank/${id}`, payload, {
      headers: {
        Authorization: `Bearer ${tokenDecrypted()}`,
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};
export const DeleteBankAPI = async (id) => {
  try {
    const response = await axios.delete(`${URL_API}/bank/${id}`, {
      headers: {
        Authorization: `Bearer ${tokenDecrypted()}`,
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};
