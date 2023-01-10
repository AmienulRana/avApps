import { URL_API } from "@/config";
import { tokenDecrypted } from "@/utils/decryptToken";
import axios from "axios";

export const AddDeductionAPI = async (payload) => {
  try {
    const response = await axios.post(`${URL_API}/deduction`, payload, {
      headers: {
        Authorization: `Bearer ${tokenDecrypted()}`,
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};
export const GetDeductionOptionsAPI = async (id) => {
  try {
    const response = await axios.get(`${URL_API}/deduction/options/${id}`, {
      headers: {
        Authorization: `Bearer ${tokenDecrypted()}`,
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};
export const GetDeductionAPI = async (id) => {
  try {
    const response = await axios.get(`${URL_API}/deduction/${id}`, {
      headers: {
        Authorization: `Bearer ${tokenDecrypted()}`,
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};
export const ChangeStatusDeductionAPI = async (id) => {
  try {
    const response = await axios.get(`${URL_API}/deduction/status/${id}`, {
      headers: {
        Authorization: `Bearer ${tokenDecrypted()}`,
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};
export const EditDeductionAPI = async (id, payload) => {
  try {
    const response = await axios.put(`${URL_API}/deduction/${id}`, payload, {
      headers: {
        Authorization: `Bearer ${tokenDecrypted()}`,
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};
export const DeleteDeductionAPI = async (id) => {
  try {
    const response = await axios.delete(`${URL_API}/deduction/${id}`, {
      headers: {
        Authorization: `Bearer ${tokenDecrypted()}`,
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};
