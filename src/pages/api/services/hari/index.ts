import instance from "@/lib/axios/instance";

const hariServices = {
  getAllData: (token: string) =>
    instance.get("/api/datahari", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};

export default hariServices;
