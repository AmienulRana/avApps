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
export const DeleteEmployementAPI = async (id) => {
  try {
    const response = await axios.delete(`${URL_API}/employment/${id}`, {
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
export const EditPersonalEmployementAPI = async (id, payload) => {
  try {
    const response = await axios.put(
      `${URL_API}/employment/personal-detail/${id}`,
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
export const EditEmployementAPI = async (id, payload) => {
  try {
    const response = await axios.put(
      `${URL_API}/employment/employment-detail/${id}`,
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
export const EditWorkShiftAPI = async (id, payload) => {
  try {
    const response = await axios.put(
      `${URL_API}/employment/employment-workshift/${id}`,
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
export const UpdateProfileAPI = async (id, payload) => {
  try {
    const response = await axios.put(
      `${URL_API}/employment/profile/${id}`,
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

export const GetShiftEmpAPI = async (id) => {
  try {
    const response = await axios.get(
      `${URL_API}/employment/workshift/${id}`,
      {},
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
