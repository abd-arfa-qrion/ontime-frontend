import instance from "@/lib/axios/instance";

const taSmesterServices = {
  getDataTA: (data: any, token: string) =>
    instance.post("/api/datatahunajaran", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  getDataTAFilter: (data: any, token: string) =>
    instance.post("/api/datatahunajaranfilter", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  getDataSemester: (data: any, token: string) =>
    instance.post("/api/datatasmester", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};

export default taSmesterServices;
