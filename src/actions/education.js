import { URL_API } from "@/config";
import { tokenDecrypted } from "@/utils/decryptToken";
import axios from "axios";

export const AddEducationAPI = async (payload) => {
  try {
    const response = await axios.post(`${URL_API}/education`, payload, {
      headers: {
        Authorization: `Bearer ${tokenDecrypted()}`,
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};
export const GetEducationAPI = async (id) => {
  try {
    const response = await axios.get(`${URL_API}/education?emp_id=${id}`, {
      headers: {
        Authorization: `Bearer ${tokenDecrypted()}`,
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};
// export const DetailDepartementAPI = async (id) => {
//   try {
//     const response = await axios.get(`${URL_API}/departement/${id}`);
//     return response;
//   } catch (error) {
//     return error.response;
//   }
// };
export const EditEducationAPI = async (id, payload) => {
  try {
    const response = await axios.put(`${URL_API}/education/${id}`, payload, {
      headers: {
        Authorization: `Bearer ${tokenDecrypted()}`,
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};
export const DeleteEducationAPI = async (id) => {
  try {
    const response = await axios.delete(`${URL_API}/education/${id}`, {
      headers: {
        Authorization: `Bearer ${tokenDecrypted()}`,
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};
