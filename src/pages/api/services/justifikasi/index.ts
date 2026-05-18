import instance from "@/lib/axios/instance";

const justifikasiServices = {
  getAllData: (data: any, token: string) =>
    instance.post("/api/datajustifikasi", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  updateDataJustifikasi: (data: any, token: string) =>
    instance.post("/api/updatejustifikasi", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  getAllDataGuru: (data: any, token: string) =>
    instance.post("/api/datajustifikasiguru", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  updateDataJustifikasiGuru: (data: any, token: string) =>
    instance.post("/api/updatejustifikasiguru", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};

export default justifikasiServices;
