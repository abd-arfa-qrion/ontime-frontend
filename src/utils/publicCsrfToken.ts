import { encrypt } from "./secureUrl";

export const GeneratePublicCsrfToken = (): string => {
  const timestamp = new Date().getTime();
  const secretKey = process.env.NEXT_PUBLIC_URL_ENCRYPT_KEY || "";
  const plainText = timestamp.toString() + "-" + secretKey;
  const encryptedText = encrypt(plainText) + timestamp.toString();
  return encryptedText;
};
