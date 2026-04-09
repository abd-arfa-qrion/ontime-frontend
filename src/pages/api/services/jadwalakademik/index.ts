import instance from "@/lib/axios/instance";

const jadwalAkademikServices = {
  getAllData: (data: any, token: string) =>
    instance.post("/api/datajadwalpelajaran", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  AddData: (data: any, token: string) =>
    instance.post("/api/tambahdatajadwalpelajaran", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  updateData: (data: any, token: string) =>
    instance.post("/api/updatedatajadwalpelajaran", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};

export default jadwalAkademikServices;
