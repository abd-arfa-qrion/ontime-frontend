import instance from "@/lib/axios/instance";

const mapelServices = {
  getAllData: (data: any, token: string) =>
    instance.post("/api/datamapel", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  AddData: (data: any, token: string) =>
    instance.post("/api/addmapel", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};

export default mapelServices;
