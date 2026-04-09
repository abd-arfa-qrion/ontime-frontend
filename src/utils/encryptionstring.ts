import CryptoJS from "crypto-js";

// Gunakan kunci rahasia dari environment (jangan gunakan NEXT_PUBLIC)
const secretKey = process.env.NEXT_PUBLIC_SUPEBASE_SECRET_KEY;

// Fungsi untuk mengenkripsi string
export const encryptString = (text: string): string => {
  if (!secretKey) throw new Error("Secret key is missing");

  const encrypted = CryptoJS.AES.encrypt(text, secretKey).toString();
  return encrypted;
};

// Fungsi untuk mendekripsi string
export const decryptString = (cipherText: string): string => {
  if (!secretKey) throw new Error("Secret key is missing");

  const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);

  return decrypted;
};
