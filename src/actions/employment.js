import { URL_API } from "@/config";
import { tokenDecrypted } from "@/utils/decryptToken";
import axios from "axios";

export const AddEmploymentAPI = async (payload, query) => {
  try {
    const response = await axios.post(
      `${URL_API}/employment${query}`,
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
export const GetAllEmployementAPI = async (query) => {
  try {
    const response = await axios.get(`${URL_API}/employment${query}`, {
      headers: {
        Authorization: `Bearer ${tokenDecrypted()}`,
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};

export const DetailEmployementAPI = async (id) => {
  try {
    const response = await axios.get(`${URL_API}/employment/${id}`, {
      headers: {
        Authorization: `Bearer ${tokenDecrypted()}`,
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};
