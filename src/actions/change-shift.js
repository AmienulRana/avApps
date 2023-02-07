import { URL_API } from "@/config";
import { tokenDecrypted } from "@/utils/decryptToken";
import axios from "axios";

export const AddChangeShiftRequest = async (query, payload) => {
  try {
    const response = await axios.post(
      `${URL_API}/change-shift${query}`,
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
export const EditChangeWorkshiftAPI = async (id, payload) => {
  try {
    const response = await axios.put(`${URL_API}/change-shift/${id}`, payload, {
      headers: {
        Authorization: `Bearer ${tokenDecrypted()}`,
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};
export const GetShiftRequestAPI = async (query) => {
  try {
    const response = await axios.get(`${URL_API}/change-shift${query}`, {
      headers: {
        Authorization: `Bearer ${tokenDecrypted()}`,
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};
export const DeleteChangeWorkshiftAPI = async (id) => {
  try {
    const response = await axios.delete(`${URL_API}/change-shift/${id}`, {
      headers: {
        Authorization: `Bearer ${tokenDecrypted()}`,
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};
export const GetOffdayEmploymentAPI = async (id) => {
  try {
    const response = await axios.get(`${URL_API}/off-day/${id}`, {
      headers: {
        Authorization: `Bearer ${tokenDecrypted()}`,
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};
export const EditOvertimeRequestAPI = async (id, payload) => {
  try {
    const response = await axios.put(
      `${URL_API}/outside-request/${id}`,
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
