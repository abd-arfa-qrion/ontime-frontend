import crypto from "crypto";
// Kunci rahasia untuk enkripsi dan dekripsi
const secretKey = process.env.NEXT_PUBLIC_SUPEBASE_SECRET_KEY;

// Fungsi untuk mengenkripsi data
export const CompareSecret = (secretKeyEncript: string): string => {
  if (secretKey) {
    const hmac = crypto.createHmac(
      "sha256",
      Buffer.from(secretKey, "utf-8") as any
    );
    hmac.update(secretKey);
    const encryptedText = hmac.digest("hex").substring(0, 25);
    if (encryptedText !== secretKeyEncript) {
      return "false";
    } else {
      return "true";
    }
  } else {
    return "false";
  }
};
