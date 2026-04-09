import { GenerateSignature } from "@/utils/signatureSupeapp";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { methode, body } = req.body;
  const timestampStr = req.body.body.timeStamp;

  const { signature, timestamp } = GenerateSignature(
    methode,
    timestampStr,
    body
  );
  return res.status(200).json({ signature, timestamp });
}
