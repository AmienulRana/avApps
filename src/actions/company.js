import { URL_API } from "@/config";
import { tokenDecrypted } from "@/utils/decryptToken";
import axios from "axios";

export const GetAllCompanyAPI = async () => {
  try {
    const response = await axios.get(`${URL_API}/company/all`, {
      headers: {
        Authorization: `Bearer ${tokenDecrypted()}`,
      },
      secure: true,
    });
    return response;
  } catch (error) {
    return error.response;
  }
};
export const GetDahsboardAPI = async (query) => {
  try {
    const response = await axios.get(`${URL_API}/company/dashboard${query}`, {
      headers: {
        Authorization: `Bearer ${tokenDecrypted()}`,
      },
      secure: true,
    });
    return response;
  } catch (error) {
    return error.response;
  }
};
