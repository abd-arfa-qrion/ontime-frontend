import instance from "@/lib/axios/instance";
import { Update } from "@mui/icons-material";

const jadwalUmumServices = {
  getAllData: (data: any, token: string) =>
    instance.post("/api/datajadwalumum", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  AddData: (data: any, token: string) =>
    instance.post("/api/tambahjadwalumum", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  UpdateData: (data: any, token: string) =>
    instance.post("/api/updatejadwalumum", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};

export default jadwalUmumServices;
