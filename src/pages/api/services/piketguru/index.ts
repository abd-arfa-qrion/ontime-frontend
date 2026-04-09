import instance from "@/lib/axios/instance";
import { Update } from "@mui/icons-material";

const piketGuruServices = {
  getAllData: (data: any, token: string) =>
    instance.post("/api/datapiketguru", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  UpdateData: (data: any, token: string) =>
    instance.post("/api/updatepiketguru", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};

export default piketGuruServices;
