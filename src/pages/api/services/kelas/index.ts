import instance from "@/lib/axios/instance";

const kelasServices = {
  getAllData: (data: any, token: string) =>
    instance.post("/api/datakelas", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  getDataMonitoringKelas: (data: any, token: string) =>
    instance.post("/api/monitoringkelas", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};

export default kelasServices;
