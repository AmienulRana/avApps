import { URL_API } from "@/config";
import { tokenDecrypted } from "@/utils/decryptToken";
import axios from "axios";

export const AddAnnouncementAPI = async (query, payload) => {
  try {
    const response = await axios.post(
      `${URL_API}/announcement${query}`,
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
export const EditAnnouncementAPI = async (id, payload) => {
  try {
    const response = await axios.put(`${URL_API}/announcement/${id}`, payload, {
      headers: {
        Authorization: `Bearer ${tokenDecrypted()}`,
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};
export const GetAnnouncementAPI = async (query) => {
  try {
    const response = await axios.get(`${URL_API}/announcement${query}`, {
      headers: {
        Authorization: `Bearer ${tokenDecrypted()}`,
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};
export const DeleteAnnouncementAPI = async (id) => {
  try {
    const response = await axios.delete(`${URL_API}/announcement/${id}`, {
      headers: {
        Authorization: `Bearer ${tokenDecrypted()}`,
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};
