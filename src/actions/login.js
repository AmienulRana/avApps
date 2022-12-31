import { URL_API } from "@/config";
import axios from "axios";

export const LoginSuperAPI = async (payload) => {
  try {
    const response = await axios.post(`${URL_API}/admin/login`, payload);
    return response;
  } catch (error) {
    return error.response;
  }
};
export const LoginAdminAPI = async (payload) => {
  try {
    const response = await axios.post(`${URL_API}/company/login`, payload);
    return response;
  } catch (error) {
    return error.response;
  }
};
