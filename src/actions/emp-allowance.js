import { URL_API } from "@/config";
import { tokenDecrypted } from "@/utils/decryptToken";
import axios from "axios";

export const AddAllowanceAPI = async (payload) => {
  try {
    const response = await axios.post(`${URL_API}/allowance`, payload, {
      headers: {
        Authorization: `Bearer ${tokenDecrypted()}`,
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};
export const GetAllowanceOptionsAPI = async (id) => {
  try {
    const response = await axios.get(`${URL_API}/allowance/options/${id}`, {
      headers: {
        Authorization: `Bearer ${tokenDecrypted()}`,
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};
export const GetAllowanceAPI = async (id) => {
  try {
    const response = await axios.get(`${URL_API}/allowance/${id}`, {
      headers: {
        Authorization: `Bearer ${tokenDecrypted()}`,
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};
export const ChangeStatusAllowanceAPI = async (id) => {
  try {
    const response = await axios.get(`${URL_API}/allowance/status/${id}`, {
      headers: {
        Authorization: `Bearer ${tokenDecrypted()}`,
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};
export const EditAllowanceAPI = async (id, payload) => {
  try {
    const response = await axios.put(`${URL_API}/allowance/${id}`, payload, {
      headers: {
        Authorization: `Bearer ${tokenDecrypted()}`,
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};
export const DeleteAllowanceAPI = async (id) => {
  try {
    const response = await axios.delete(`${URL_API}/allowance/${id}`, {
      headers: {
        Authorization: `Bearer ${tokenDecrypted()}`,
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};
