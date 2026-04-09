import { AES, enc } from 'crypto-js';

// Kunci rahasia untuk enkripsi dan dekripsi
const secretKey = process.env.NEXT_PUBLIC_URL_ENCRYPT_KEY || '';

// Fungsi untuk mengenkripsi data
export const encrypt = (text: string): string => {
    return AES.encrypt(text, secretKey).toString();
};

// Fungsi untuk mendekripsi data
export const decrypt = (cipherText: string): string => {
    const bytes = AES.decrypt(cipherText, secretKey);
    return bytes.toString(enc.Utf8);
};