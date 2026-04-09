import crypto from "crypto";

export const GenerateSignature = (
  methode: string,
  timestamp: string,
  body: object
): { signature: string; timestamp: string } => {
  // const publicKey = process.env.NEXT_PUBLIC_SUPEBASE_PUBLIC_KEY || "";
  const publicKey = process.env.SUPEBASE_PUBLIC_KEY || "";

  const hashBody = crypto
    .createHash("sha256")
    .update(JSON.stringify(body))
    .digest("hex");
  const text = methode + ":" + publicKey + ":" + hashBody + ":" + timestamp;

  const signature = crypto
    .createHmac("sha256", publicKey)
    .update(text)
    .digest("hex");
  
  return { signature, timestamp };
};
