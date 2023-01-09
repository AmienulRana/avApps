import { SECRET_KEY } from "@/config";
import CryptoJS from "crypto-js";
import jwtDecode from "jwt-decode";
import store from "../store";

function decryptToken() {
  const encryptedToken = store.state.token || localStorage.getItem("token");
  const bytes = CryptoJS.AES.decrypt(encryptedToken, SECRET_KEY);
  const token = bytes.toString(CryptoJS.enc.Utf8);
  const payload = jwtDecode(token);
  return payload;
}

export default decryptToken;

export function tokenDecrypted() {
  const encryptedToken = store.state.token || localStorage.getItem("token");
  const bytes = CryptoJS.AES.decrypt(encryptedToken, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}
