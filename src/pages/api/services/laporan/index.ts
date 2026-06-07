import instance from "@/lib/axios/instance";

const laporanServices = {
  getDataMasukPulangGuru: (data: any, token: string) =>
    instance.post("/api/datamasukpulangguru", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};

export default laporanServices;
