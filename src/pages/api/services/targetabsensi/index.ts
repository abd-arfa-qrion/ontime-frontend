import instance from "@/lib/axios/instance";

const targetAbsensiServices = {
  getAllData: (token: string) =>
    instance.get("/api/datatargetabsensi", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};

export default targetAbsensiServices;
