import instance from "@/lib/axios/instance";
import { User } from "@/type/user.type";

const authService = {
  registerAccount: (data: any, publicToken: string) =>
    instance.post("/auth/register", data),

  retrieveDataByField: (data: User) => instance.post("/auth/login", data),

  verificationEmail: (data: any, signature: string, timestamp: string) =>
    instance.post("/auth/emailverification", data, {
      headers: {
        "Content-Type": "application/json",
        "X-Signature": signature,
        "X-Timestamp": timestamp,
      },
      withCredentials: true,
    }),
};

export default authService;
