import instance from "@/lib/axios/instance";

const jadwalMasukServices = {
  getAllData: (data: any, token: string) =>
    instance.post("/api/datajadwalmasuk", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  AddData: (data: any, token: string) =>
    instance.post("/api/tambahdatajadwalmasuk", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  GenerateData: (data: any, token: string) =>
    instance.post("/api/generatejadwalmasuk", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  getDataById: (data: any, token: string) =>
    instance.post("/api/datajadwalmasukbyid", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  UpdateData: (data: any, token: string) =>
    instance.post("/api/updatejadwalmasuk", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};

export default jadwalMasukServices;
