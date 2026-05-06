import instance from "@/lib/axios/instance";

const justifikasiServices = {
  getAllData: (data: any, token: string) =>
    instance.post("/api/datajustifikasi", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};

export default justifikasiServices;
