import { URL_API } from "@/config";
import { tokenDecrypted } from "@/utils/decryptToken";
import axios from "axios";

export const AddExperienceAPI = async (payload) => {
  try {
    const response = await axios.post(`${URL_API}/experience`, payload, {
      headers: {
        Authorization: `Bearer ${tokenDecrypted()}`,
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};
export const GetExperienceAPI = async (id) => {
  try {
    const response = await axios.get(`${URL_API}/experience?emp_id=${id}`, {
      headers: {
        Authorization: `Bearer ${tokenDecrypted()}`,
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};

export const EditExperienceAPI = async (id, payload) => {
  try {
    const response = await axios.put(`${URL_API}/experience/${id}`, payload, {
      headers: {
        Authorization: `Bearer ${tokenDecrypted()}`,
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};
export const DeleteExperienceAPI = async (id) => {
  try {
    const response = await axios.delete(`${URL_API}/experience/${id}`, {
      headers: {
        Authorization: `Bearer ${tokenDecrypted()}`,
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};
