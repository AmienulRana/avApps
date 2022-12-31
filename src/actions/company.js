import { URL_API } from "@/config";
import { tokenDecrypted } from "@/utils/decryptToken";
import axios from "axios";

export const GetAllCompanyAPI = async () => {
  try {
    const response = await axios.get(`${URL_API}/company/all`, {
      headers: {
        Authorization: `Bearer ${tokenDecrypted()}`,
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};