import instance from "@/lib/axios/instance";

const guruServices = {
  getAllData: (data: any, token: string) =>
    instance.post("/api/dataguru", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  
};

export default guruServices;
