import instance from "@/lib/axios/instance";
import { Add, Update } from "@mui/icons-material";

const pengumumanServices = {
  getAllData: (data: any, token: string) =>
    instance.post("/api/datapengumuman", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  AddData: (data: any, token: string) =>
    instance.post("/api/tambahpengumuman", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  UpdateData: (data: any, token: string) =>
    instance.post("/api/updatepengumuman", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};

export default pengumumanServices;
