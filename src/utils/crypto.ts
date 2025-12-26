import CryptoJS from "crypto-js";

const secretKey = "secret_key";

// 加密
export function encryptData(data: string) {
  return CryptoJS.AES.encrypt(data, secretKey).toString();
}

// 解密
export function decryptData(data: string) {
  const bytes = CryptoJS.AES.decrypt(data, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
}
