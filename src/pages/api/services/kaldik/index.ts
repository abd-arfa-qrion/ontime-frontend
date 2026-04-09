import instance from "@/lib/axios/instance";

const kaldikServices = {
  getAllData: (data: any, token: string) =>
    instance.post("/api/datakaldik", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  AddData: (data: any, token: string) =>
    instance.post("/api/addkaldik", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  UpdateData: (data: any, token: string) =>
    instance.post("/api/updatekaldik", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};

export default kaldikServices;
