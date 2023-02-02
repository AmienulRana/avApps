import { URL_API } from "@/config";
import { tokenDecrypted } from "@/utils/decryptToken";
import axios from "axios";

export const AddOffDayRequest = async (query, payload) => {
  try {
    const response = await axios.post(`${URL_API}/off-day${query}`, payload, {
      headers: {
        Authorization: `Bearer ${tokenDecrypted()}`,
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};
export const EditOffdayRequestAPI = async (id, payload) => {
  try {
    const response = await axios.put(`${URL_API}/off-day/${id}`, payload, {
      headers: {
        Authorization: `Bearer ${tokenDecrypted()}`,
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};
export const GetOffDayRequestAPI = async (query) => {
  try {
    const response = await axios.get(`${URL_API}/off-day${query}`, {
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
