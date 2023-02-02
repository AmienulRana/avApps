import { URL_API } from "@/config";
import { tokenDecrypted } from "@/utils/decryptToken";
import axios from "axios";

export const GeneratePayslipAPI = async (query) => {
  try {
    const response = await axios.post(
      `${URL_API}/payrun${query}`,
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
export const GetPayslipAPI = async (query) => {
  try {
    const response = await axios.get(`${URL_API}/payrun${query}`, {
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
export const ChangeStatusPeriodicAPI = async (id) => {
  try {
    const response = await axios.put(
      `${URL_API}/periodic/${id}`,
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
export const EditPayrunStatusAPI = async (id, query) => {
  try {
    const response = await axios.put(
      `${URL_API}/payrun/${id}${query}`,
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
export const DeleteAllowDeductAPI = async (id) => {
  try {
    const response = await axios.delete(
      `${URL_API}/allowance-deduction/${id}`,
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
