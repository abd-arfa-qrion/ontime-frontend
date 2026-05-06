import instance from "@/lib/axios/instance";

const dashboardServices = {
  getAllData: (data: any, token: string) =>
    instance.post("/api/getdashboardresumesiswa", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  getRekapAbsensi: (data: any, token: string) =>
    instance.post("/api/getdashboardrekapabsen", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  getResume7Hari: (data: any, token: string) =>
    instance.post("/api/getdatarekap7hari", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  getResume7HariTidakhadir: (data: any, token: string) =>
    instance.post("/api/getdatarekap7haritdkhadir", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  getResume7HariPerbulan: (data: any, token: string) =>
    instance.post("/api/getdatarekap7hariPerbulan", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};

export default dashboardServices;
