import instance from "@/lib/axios/instance";
import { get } from "http";

const userService = {
  getAllUsers: (perpage: number, page: number, token: string) =>
    instance.get(`/api/usersPaginate?perpage=${perpage}&page=${page}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  getAllUser: (token: string) =>
    instance.get(`/api/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  addUser: (data: any, token: string) =>
    instance.post("/api/user", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  updateUser: (email: string, data: any, token: string) =>
    instance.patch(`/api/userupdate/${email}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  ConfigureUserBaru: (data: any, token: string) =>
    instance.patch("/api/updatesnk", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  addNewUser: (data: any, signature: string, timestamp: string) =>
    instance.post("/auth/adduserfromregister", data, {
      headers: {
        "Content-Type": "application/json",
        "X-Signature": signature,
        "X-Timestamp": timestamp,
      },
      withCredentials: true,
    }),
  updateUserRole: (id: string, data: any, token: string) =>
    instance.put(`/api/user/roleupdate/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  deleteUser: (data: any, token: string) =>
    instance.delete("/api/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: data,
    }),
  getProfile: (param: string, token: string) =>
    instance.get(`/api/userprofile/${param}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  updateProfile: (data: any, token: string) =>
    instance.put(`/api/user/profile`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  getSearchUser: (
    searchData: string,
    perpage: number,
    page: number,
    token: string
  ) =>
    instance.get(
      `/api/userSearch/${searchData}?perpage=${perpage}&page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ),
};

export default userService;
