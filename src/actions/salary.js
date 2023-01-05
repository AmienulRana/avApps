import { URL_API } from "@/config";
import { tokenDecrypted } from "@/utils/decryptToken";
import axios from "axios";

export const AddSalaryAPI = async (payload) => {
  try {
    const response = await axios.post(`${URL_API}/salary`, payload, {
      headers: {
        Authorization: `Bearer ${tokenDecrypted()}`,
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};
export const GetSalaryAPI = async (id) => {
  try {
    const response = await axios.get(`${URL_API}/salary?emp_id=${id}`, {
      headers: {
        Authorization: `Bearer ${tokenDecrypted()}`,
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};

export const EditSalaryAPI = async (id, payload) => {
  try {
    const response = await axios.put(`${URL_API}/salary/${id}`, payload, {
      headers: {
        Authorization: `Bearer ${tokenDecrypted()}`,
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};
export const DeleteSalaryAPI = async (id) => {
  try {
    const response = await axios.delete(`${URL_API}/salary/${id}`, {
      headers: {
        Authorization: `Bearer ${tokenDecrypted()}`,
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};
