import { URL_API } from "@/config";
import { tokenDecrypted } from "@/utils/decryptToken";
import axios from "axios";

export const AddLeaveRequestAPI = async (query, payload) => {
  try {
    const response = await axios.post(
      `${URL_API}/leave-request${query}`,
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
export const GetLeaveRequestAPI = async (query) => {
  try {
    const response = await axios.get(`${URL_API}/leave-request${query}`, {
      headers: {
        Authorization: `Bearer ${tokenDecrypted()}`,
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};
export const DeleteStatusLeaveRequestAPI = async (id) => {
  try {
    const response = await axios.delete(`${URL_API}/leave-request/${id}`, {
      headers: {
        Authorization: `Bearer ${tokenDecrypted()}`,
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};
export const EditStatusLeaveRequestAPI = async (id, payload) => {
  try {
    const response = await axios.put(
      `${URL_API}/leave-request/status/${id}`,
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
export const EditDataLeaveRequestAPI = async (id, payload) => {
  try {
    const response = await axios.put(
      `${URL_API}/leave-request/data/${id}`,
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
