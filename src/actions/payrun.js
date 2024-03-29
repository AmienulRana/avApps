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
export const RecalculatePayrunAPI = async (id) => {
  try {
    const response = await axios.put(
      `${URL_API}/payrun/recalculate/${id}`,
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
export const EditPayrunDataAPI = async (id, data) => {
  try {
    const response = await axios.put(
      `${URL_API}/payrun/data/${id}`,
      { ...data },
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
export const UploadPDFFileAPI = async (data, id) => {
  try {
    const response = await axios.post(
      `${URL_API}/payrun/upload-pdf/${id}`,
      data,
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
