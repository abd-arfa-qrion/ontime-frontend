import instance from "@/lib/axios/instance";

const SetAreaServices = {
  uploadKml: (data: FormData, token: string) =>
    instance.post("/api/setarea", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  getDataArea: (data: any, token: string) =>
    instance.post("/api/getarea", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  updateArea: (data: FormData, token: string) =>
    instance.post("/api/updatearea", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};

export default SetAreaServices;
