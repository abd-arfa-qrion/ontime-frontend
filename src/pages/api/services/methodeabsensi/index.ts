import instance from "@/lib/axios/instance";

const methodeAbsensiServices = {
  getAllData: (token: string) =>
    instance.get("/api/datamethodeabsensi", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};

export default methodeAbsensiServices;
